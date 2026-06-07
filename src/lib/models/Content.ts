import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  title: string;
  type: "Hero Section" | "Page Content" | "FAQ" | "Banner" | "Blog Article";
  status: "Published" | "Draft";
  contentData: any; // Can store text, images, or JSON structured data
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Hero Section", "Page Content", "FAQ", "Banner", "Blog Article"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Draft",
    },
    contentData: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);

export default Content;
