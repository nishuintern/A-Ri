import mongoose, { Schema, Document, Model } from "mongoose";

/* Product Model - AÉRI Admin Dashboard */

export interface IProduct extends Document {
  name: string;
  nameEn?: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  shortDescription: string;
  sku: string;
  category: string;
  productType: "B2B" | "B2C" | "Both";
  price: number;
  discountPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  weight?: string;
  dimensions?: string;
  status: "Active" | "Draft" | "Archived";
  featured: boolean;
  tags: string[];
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    sku: { type: String, required: true, unique: true },
    category: { type: String, default: "Uncategorized" },
    productType: {
      type: String,
      enum: ["B2B", "B2C", "Both"],
      default: "B2C",
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    costPrice: { type: Number },
    stockQuantity: { type: Number, default: 0 },
    weight: { type: String },
    dimensions: { type: String },
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived"],
      default: "Draft",
    },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    images: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

/* Model reuse karo agar already compiled hai */
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
