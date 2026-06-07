import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  company: string;
  siret?: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  quantity: string;
  volume?: string;
  channel?: string;
  status: "New" | "In Progress" | "Qualified" | "Closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    siret: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
    },
    channel: {
      type: String,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Qualified", "Closed"],
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Auto createdAt aur updatedAt fields
  }
);

const Lead = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
