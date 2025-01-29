
import { NextFunction, Request, Response } from 'express';
import { loginSchema, registerSchema } from './user.schema';
import { createAccount } from '../services/user.service';
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
    const requestdata = loginSchema.parse({... req.body , userAgent: req.headers['user-agent']});
    const user = await (requestdata);
} catch (error) {
    console.log(error)
   next(error); 
}

}


export {registeruser};