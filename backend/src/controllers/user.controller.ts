import { verifyOTP } from './../services/user.service';

import { NextFunction, Request, response, Response } from 'express';
import { loginSchema, registerSchema } from './user.schema';
import { createAccount , createsession, generateOTP, sendVerificationEmail, verifyuser } from '../services/user.service';
import UserModel from '../models/user.model';
import { verify } from 'jsonwebtoken';
import { ApiResponse } from '../utils/response';
const registeruser = async (req: Request, res: Response , next : NextFunction ) => {
try {
    const response = registerSchema.parse({... req.body , userAgent: req.headers['user-agent']});
    const user = await createAccount(response);
    res.status(201).json(user);
    
} catch (error :any) {
   console.log(error)
   next(error);  
}
}

const loginuser = async (req: Request, res: Response , next : NextFunction ) => {
try {
    const requestdata = loginSchema.parse({... req.body });
    const user = await verifyuser(requestdata);
    const otp = await generateOTP(user._id);
    await sendVerificationEmail(user, otp);
    res.status(200).json(new ApiResponse(200 ,{user : user._id}, "OTP sent to your email"));

    // const accesstoken =  user.setAccessToken();
    // const refreshtoken = user.setRefreshToken();
    // const userWithoutPassword = user.omitPassword();
    // const session = await createsession(user._id, req.headers['user-agent'], accesstoken);
    // res.cookie("accessToken", accesstoken, { httpOnly: true , secure: true, sameSite: "none"});
    // res.cookie("refreshToken", refreshtoken, { httpOnly: true , secure: true, sameSite: "none"});
    // res.status(200).json(new ApiResponse(200, { user: userWithoutPassword} , "Login success"));
} catch (error) {
    console.log(error)
   next(error); 
}

}

export const verifyOTPandLogin = async (req: Request, res: Response , next : NextFunction ) => {
    try {
        const  otp  = req.body.otp // Extract OTP from body
        console.log(req.params , req.body)
        const { id: userId } = req.params; // ✅ Read userId from route params
        const user = await verifyOTP(userId, otp);
        
        if (!user) {
            throw new Error("Invalid OTP");
        }const accesstoken =  user.setAccessToken();
        const refreshtoken = user.setRefreshToken();
        const userWithoutPassword = user.omitPassword();
        const session = await createsession(user._id, req.headers['user-agent'], accesstoken);
        res.cookie("accessToken", accesstoken, { httpOnly: true , secure: true, sameSite: "none"});
        res.cookie("refreshToken", refreshtoken, { httpOnly: true , secure: true, sameSite: "none"});
        res.status(200).json(new ApiResponse(200, { user: userWithoutPassword} , "Login success"));
    } catch (error) {
        console.log(error)
       next(error); 
    }
    
    }


export {registeruser,loginuser};