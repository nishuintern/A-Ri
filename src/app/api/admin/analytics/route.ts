import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Lead from "@/lib/models/Lead";

export async function GET() {
  try {
    await connectDB();

    // Aggregating monthly revenue and order count
    const monthlyRevenueRaw = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 } // Last 6 months
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let monthlyRevenue = monthlyRevenueRaw.map(item => {
      const [year, month] = item._id.split("-");
      return {
        month: monthNames[parseInt(month) - 1],
        revenue: item.revenue,
        orders: item.orders
      };
    });

    if (monthlyRevenue.length === 0) {
        // Fallback dummy structure if no orders
        monthlyRevenue = [
            { month: "Jan", revenue: 0, orders: 0 },
            { month: "Feb", revenue: 0, orders: 0 },
            { month: "Mar", revenue: 0, orders: 0 },
        ];
    }

    // Top selling products (currently mocked by total ordered across all time)
    // Needs complex aggregation over orderItems. For now, doing a simple aggregate:
    const topProductsRaw = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName", // Assuming we store name in items or we lookup by product ID
          units: { $sum: "$items.quantity" }
        }
      },
      { $sort: { units: -1 } },
      { $limit: 5 }
    ]);

    let topProducts = topProductsRaw.map(item => ({
      name: item._id,
      units: item.units
    }));

    if (topProducts.length === 0) {
         topProducts = [
            { name: "No Data", units: 0 },
        ];
    }

    // B2B vs B2C Split 
    const b2cCount = await Order.countDocuments();
    const b2bCount = await Lead.countDocuments();
    const totalCount = b2cCount + b2bCount || 1; // Prevent division by zero

    const b2bVsB2c = [
      { name: "B2C (Orders)", value: Math.round((b2cCount / totalCount) * 100), color: "#675d4e" },
      { name: "B2B (Leads)", value: Math.round((b2bCount / totalCount) * 100), color: "#3b82f6" },
    ];

    return NextResponse.json({ 
        monthlyRevenue, 
        b2bVsB2c, 
        topProducts 
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
