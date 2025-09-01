import mongoose from "mongoose";
const UserLocationSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  Location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }
});

UserLocationSchema.index({ Location: '2dsphere' });
export const UserLocation = mongoose.model('userlocations', UserLocationSchema);
