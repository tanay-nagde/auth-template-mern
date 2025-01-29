import mongoose from "mongoose";
import SessionModel from "../models/session.model";
import UserModel, { UserDocument } from "../models/user.model";
import VerificationCodeModel from "../models/verification.model";
import { ApiError } from "../utils/ApiError";
import { VerificationCodeType } from "../utils/constants";
import { sendmail , getVerifyEmailTemplate } from "../utils/resend.mail";
import { loginSchema } from "../controllers/user.schema";
import { z } from "zod";
type LoginData = z.infer<typeof loginSchema>;

type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
  };

  export const createAccount = async (userdatafromrequest: CreateAccountParams) => {
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

        // //  generate verification code  
        // const verificationCode = await VerificationCodeModel.create({
        //   userId,
        //   type: VerificationCodeType.EmailVerification,
        //   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        // });
      
        // const url = `http://localhost:3000/email/verify/${verificationCode._id}`;

        // // send verification email
        // await sendmail({
        //   from: 'tanaynagde@gmail.com',
        //   to: [userWithoutPassword.email],
        //   ...getVerifyEmailTemplate(url),
        // });

  //       // create session
  // const session = await SessionModel.create({
  //   userId,
  //   userAgent: userdatafromrequest.userAgent,
  // });

    }

    const login = async (data : LoginData) => {
      const user = await UserModel.findOne({ email: data.email });
      if (!user) {
        throw new ApiError(401, "Invalid credentials");
      }
      if (!(await user.comparePassword(data.password))) {
        throw new ApiError(401, "Invalid credentials");
      }
     }

    export const createsession = async (userId: string, userAgent: string) => {
      const session = await SessionModel.create({
      userId: userId,
        userAgent: userAgent,
        createdAt: Date.now(),
        expiresAt: new Date(Date.now() +  24 * 60 * 60 * 1000),
      });
    
      return session;
    }

    export const  generateOTP = async (userId: string , type : VerificationCodeType) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const verificationcode =   await VerificationCodeModel.create({
        userId,
        code: otp,
        type: type,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
    
      return verificationcode;
    }

    export const verifyOTP = async (userId: mongoose.Types.ObjectId, otp: string) => {
      const verificationcode = await VerificationCodeModel.findOne({
        userId,
        code: otp,
        expiresAt: { $gt: new Date() },
      });
    
      if (!verificationcode) {
        throw new ApiError(401, "Invalid OTP");
      }
    
      return verificationcode;
    }

    export const generateRefreshToken = async (
      user: UserDocument,
      session_id: mongoose.Types.ObjectId
    ): Promise<string> => {
      // Ensure the method is properly bound to the user instance
      const refreshToken = user.setRefreshToken(session_id);
    
      return refreshToken; // Return the generated token
    };
    
    export const  generateAccessToken = async (
      user: UserDocument,
      session_id: mongoose.Types.ObjectId
    ): Promise<string> => {
      // Ensure the method is properly bound to the user instance
      const refreshToken = user.setAccessToken(session_id);
    
      return refreshToken; // Return the generated token
    };

    export const sendVerificationEmail = async (user: UserDocument , code : number) => {
        await sendmail({
          from: 'tanaynagdecool.boy@gmail.com',
          to: [user.email],
          ...getVerifyEmailTemplate(code ),
        });
      }