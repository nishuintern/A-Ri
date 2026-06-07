import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: any;
  category: "General" | "Payment" | "Shipping" | "Email";
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ["General", "Payment", "Shipping", "Email"],
      required: true,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
