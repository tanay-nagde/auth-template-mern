import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants"; // Make sure this is defined in your project
import User  from "../models/user.model";

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
      return res.status(401).json({ error: "Access token is missing or invalid" });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Optionally fetch user from the database
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user information to the request
    req.user = { id: user.id, email: user.email };

    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Unauthorized" });
   
  }
};

export default authenticate;
