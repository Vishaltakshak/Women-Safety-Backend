import mongoose, { Mongoose, SchemaType, SchemaTypes } from "mongoose";


const sosSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:"users",required:true},
    name:{type: SchemaTypes.String, required:true},
    coordinates: {
    type: { type: String, enum: ["Point"], required: true }, // GeoJSON type
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
    areaName: { type: String },
    requestName: { type: String, unique: true },
    status: { type: String, enum: ["active", "resolved"], default: "active" },
    createdAt: { type: Date, default: Date.now, expires:"36h" }
})
sosSchema.index({ coordinates: "2dsphere" });
export const emergencySchema = mongoose.model("EmergencyRequestSchema",sosSchema);