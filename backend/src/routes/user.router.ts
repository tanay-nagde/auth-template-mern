    import { Router } from "express";
    import { loginuser, registeruser, verifyOTPandLogin } from "../controllers/user.controller";

    const userrouter = Router();

    userrouter.post('/register', registeruser )
    userrouter.post('/login', loginuser )
    userrouter.post('/login/verify-otp/:id', verifyOTPandLogin )
    export {userrouter};