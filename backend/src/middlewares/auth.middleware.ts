import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants"; // Make sure this is defined in your project
import User  from "../models/user.model";
import { date } from "zod";
import { ApiError } from "../utils/ApiError";

export interface AuthRequest extends Request {
    user?: {
      id: string;
      email: string;
    };
  }

const authenticate = async (req: AuthRequest, res :Response, next : NextFunction) => {
  try {
    // Extract the token from cookies, headers, or request body
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized acess");
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  

    // Optionally fetch user from the database
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Unauthorized no user found");
    }
    const session = user?.sessions?.find((s) => {s?.jwt === token && s?.expiresIn.getTime() > Date.now() });
    if (!session) {
      throw new ApiError(401, "Session not found or revoked");
    }

    // Attach user information to the request
    req.user = { id: user.id, email: user.email };

    next();
  } catch (error: any) {
    throw new error(error);
   
  }
};

export default authenticate;
