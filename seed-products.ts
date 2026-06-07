import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    sku: { type: String, required: true, unique: true },
    category: { type: String, default: "Uncategorized" },
    productType: { type: String, enum: ["B2B", "B2C", "Both"], default: "B2C" },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Draft", "Archived"], default: "Draft" },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const productsToSeed = [
  {
    name: "Pristine Himalayan Salt & Pepper",
    nameEn: "Pristine Himalayan Salt & Pepper",
    slug: "himalayan-salt",
    sku: "AERI-SALT",
    category: "SIGNATURE",
    description: "La pureté du sel rose de l'Himalaya mariée au piquant subtil du poivre noir concassé. Torréfié à l'huile d'olive — jamais frit.",
    descriptionEn: "The purity of Himalayan pink salt married with the subtle kick of crushed black pepper. Roasted in olive oil — never fried.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_salt_v2.png"],
    productType: "Both"
  },
  {
    name: "Gourmet Truffle Fusion",
    nameEn: "Gourmet Truffle Fusion",
    slug: "black-truffle",
    sku: "AERI-TRUFFLE",
    category: "GOURMET",
    description: "Une infusion luxueuse d'huile de truffe blanche et d'éclats de truffe noire d'été. Torréfié à l'huile d'olive — jamais frit.",
    descriptionEn: "A luxurious infusion of white truffle oil and summer black truffle shavings. Roasted in olive oil — never fried.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_truffle_v2.png"],
    productType: "Both"
  },
  {
    name: "Mediterranean Herb Fusion",
    nameEn: "Mediterranean Herb Fusion",
    slug: "mediterranean-herb-fusion",
    sku: "AERI-HERB",
    category: "VÉGÉTAL",
    description: "Un bouquet aromatique d'origan sauvage, romarin et basilic séché au soleil. Torréfié à l'huile d'olive — jamais frit.",
    descriptionEn: "An aromatic bouquet of wild oregano, rosemary, and sun-dried basil. Roasted in olive oil — never fried.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_herbes_v2.png"],
    productType: "Both"
  },
  {
    name: "Caramel & Beurre Salé",
    nameEn: "Caramel & Sea Salt",
    slug: "caramel-salt",
    sku: "AERI-CARAMEL",
    category: "SUCRÉ",
    description: "Un mélange luxueux de caramel riche et d'une pointe de sel de mer. Torréfié, jamais frit.",
    descriptionEn: "A luxurious blend of rich caramel and a hint of sea salt. Roasted, never fried.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_caramel_salt.png"],
    productType: "Both"
  },
  {
    name: "Chocolat Noir 70%",
    nameEn: "Dark Chocolate 70%",
    slug: "dark-chocolate",
    sku: "AERI-CHOC",
    category: "SUCRÉ",
    description: "Chocolat noir 70% d'origine unique enrobant délicatement notre Makhana soufflé premium.",
    descriptionEn: "Rich, 70% single-origin dark chocolate gently coating our premium puffed Makhana.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_dark_chocolate.png"],
    productType: "Both"
  },
  {
    name: "Citron & Menthe",
    nameEn: "Lemon & Mint",
    slug: "lemon-mint",
    sku: "AERI-LEMON",
    category: "VÉGÉTAL",
    description: "Un éclat vif et citronné de citron associé à la fraîcheur de la menthe.",
    descriptionEn: "A bright, citrusy burst of lemon paired with cooling mint.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_lemon_mint.png"],
    productType: "Both"
  },
  {
    name: "Beurre de Cacahuète",
    nameEn: "Peanut Butter",
    slug: "peanut-butter",
    sku: "AERI-PB",
    category: "SUCRÉ",
    description: "Beurre de cacahuète onctueux et torréfié enrobant naturellement notre Makhana.",
    descriptionEn: "Smooth, roasted peanut butter naturally coats our Makhana for a protein-packed experience.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_peanut_butter.png"],
    productType: "Both"
  },
  {
    name: "Peri Peri",
    nameEn: "Peri Peri",
    slug: "peri-peri",
    sku: "AERI-PERI",
    category: "ÉPICÉ",
    description: "Un mélange audacieux et vibrant de piment africain, d'agrumes et d'ail.",
    descriptionEn: "A bold, vibrant blend of African bird's eye chili, citrus, and garlic.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_peri_peri.png"],
    productType: "Both"
  },
  {
    name: "BBQ Fumé",
    nameEn: "Smokey BBQ",
    slug: "smokey-bbq",
    sku: "AERI-BBQ",
    category: "GOURMET",
    description: "Notes profondes et fumées de caryer associées à une touche de douceur.",
    descriptionEn: "Deep, smoky hickory notes paired with a touch of molasses sweetness and savory spices.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_smokey_bbq.png"],
    productType: "Both"
  },
  {
    name: "Tomate Acidulée",
    nameEn: "Tangy Tomato",
    slug: "tangy-tomato",
    sku: "AERI-TOMATO",
    category: "VÉGÉTAL",
    description: "L'éclat sucré et acidulé des tomates mûries au soleil avec des herbes subtiles.",
    descriptionEn: "The sweet and tart brilliance of sun-ripened tomatoes, seasoned with subtle herbs.",
    price: 5.99,
    status: "Active",
    images: ["/flavor_tangy_tomato.png"],
    productType: "Both"
  }
];

async function seed() {
  try {
    // If not using mongoose.connect it might complain, but since it's just a script
    if (mongoose.connection.readyState !== 1) {
       await mongoose.connect(MONGODB_URI as string);
    }
    console.log("Connected to MongoDB for seeding...");

    for (const prod of productsToSeed) {
      await Product.findOneAndUpdate({ sku: prod.sku }, prod, { upsert: true, new: true });
      console.log(`Seeded: ${prod.name}`);
    }

    console.log("Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
