import { Router } from "express";
import { registeruser } from "../controllers/user.controller";

const userrouter = Router();

userrouter.post('/register', registeruser )

export {userrouter};