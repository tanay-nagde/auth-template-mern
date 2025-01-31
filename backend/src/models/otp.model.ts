import mongoose, { Document, Schema } from 'mongoose';

interface OTP extends Document {
    userId: mongoose.Types.ObjectId;
  otp: number;
  expiresAt: Date;
  isVerified: boolean;
}

const otpSchema: Schema = new Schema<OTP>({
    userId : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000),  // Hardcoded 10 minutes from now
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true,  // Adds createdAt and updatedAt fields
});

// Pre-hook to delete the OTP if already verified
otpSchema.pre<OTP>('save', function (next) {
  if (this.isVerified) {
    this.deleteOne(); // Remove the OTP if it's already verified
  }
  next();
});

// TTL index for automatic expiry based on expiresAt field (10 minutes)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model<OTP>('OTP', otpSchema);

export default OTP;
