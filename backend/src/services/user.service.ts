
import mongoose from "mongoose";

import UserModel, { UserDocument } from "../models/user.model";
import { v4 as uuidv4 } from 'uuid'
import { ApiError } from "../utils/ApiError";
import { VerificationCodeType } from "../utils/constants";
import { sendmail , getVerifyEmailTemplate } from "../utils/resend.mail";
import { loginSchema  , registerSchema} from "../controllers/user.schema";
import { z } from "zod";
import OTP from "../models/otp.model";
type LoginData = z.infer<typeof loginSchema>;
type registerdata = z.infer<typeof registerSchema>;



  export const createAccount = async (userdatafromrequest: registerdata) => {
    const userexist = await UserModel.exists({ email: userdatafromrequest.email })

    if (userexist) {
      // console.log(userexist);
        throw new ApiError(501 , "User already exists" );

      }

      
      const user: UserDocument = await UserModel.create({
        email: userdatafromrequest.email,
        password: userdatafromrequest.password,
      });

      
        const userWithoutPassword = user.omitPassword();
       return userWithoutPassword;

        

    }

   export const verifyuser = async (data : LoginData) => {
      const user = await UserModel.findOne({ email: data.email });
      if (!user) {
        throw new ApiError(401, "Invalid credentials");
      }
      if (!(await user.comparePassword(data.password))) {
        throw new ApiError(401, "Invalid credentials");
      }

      return user;
     }

    export const createsession = async (userId: mongoose.Types.ObjectId, userAgent: string |undefined, jwt: string) => {
      const session =  UserModel.updateOne(
        { _id : userId }, // Find the user
        { 
          $push: { 
            sessions: { 
              sessionId: uuidv4(),
              userAgent: userAgent || "unkown user agent",
              expiresIn: new Date(Date.now() + 1000*60 *60*24*10), // 10 days from now
              jwt: jwt,
            }
          }
        }
      );
    
      return session;
    }

    export const generateOTP = async (userId: mongoose.Types.ObjectId | string) => {
      if (!userId) {
        throw new ApiError(400, "User ID is required"); // Ensure userId is not undefined
      }
    
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    
      try {
        await OTP.create({
          userId, // Ensure field name is `userId`, not `userID`
          otp, // Ensure field name is `otp`, not `code`
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 mins
        });
    
        return otp;
      } catch (error) {
        console.error("Error generating OTP:", error);
        throw new ApiError(500, "Error while generating OTP");
      }
    };
    
    // // const verificationcode =   await VerificationCodeModel.create({
    // //     userId,
    // //     code: otp,
    // //     type: type,
    // //     expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    // //   });
    
    //   return verificationcode;
    // }

    export const verifyOTP = async (userId: string, otp: string) => {
      console.log("🔍 Verifying OTP...");
      console.log("User ID:", userId);
      console.log("OTP from request:", otp);
  
      // Fetch OTP from database (parsed as number)
          // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find OTP record by userId and OTP code
    const verificationCode = await OTP.findOne({
      userId: userObjectId,
      otp: parseInt(otp),  // Ensure OTP is a number
      expiresAt: { $gt: new Date() },  // Check expiration date
      isVerified: false  // Ensure OTP is not already verified
    });
  
      console.log("Verification code from DB:", verificationCode);
  
      if (!verificationCode) {
          console.log("❌ OTP not found or expired.");
          throw new ApiError(401, "Invalid or expired OTP");
      }
  
      const user = await UserModel.findById(userId);
      return user;
  };
  

    export const generateRefreshToken = async (
      user: UserDocument,
   
    ): Promise<string> => {
      // Ensure the method is properly bound to the user instance
      const refreshToken = user.setRefreshToken();
    
      return refreshToken; // Return the generated token
    };
    
    export const  generateAccessToken = async (
      user: UserDocument,

    ): Promise<string> => {
      // Ensure the method is properly bound to the user instance
      const refreshToken = user.setAccessToken();
    
      return refreshToken; // Return the generated token
    };

    export const sendVerificationEmail = async (user: UserDocument , code : number) => {
        await sendmail({
          from: 'onboarding@resend.dev',
          to: [user.email],
          ...getVerifyEmailTemplate(code ),
        });
      }