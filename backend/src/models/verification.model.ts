import mongoose from "mongoose";
import {VerificationCodeType} from "../utils/constants";

export interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeType;
  code : string;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
    code: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() +  10 * 60 * 1000) },
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);
export default VerificationCodeModel;
