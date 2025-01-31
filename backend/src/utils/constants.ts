
import dotenv from "dotenv";

dotenv.config({
  path: './.env'
})
function getEnv (key :string , defaultValue? :string):string{
    const value = process.env[key] || defaultValue;

    if(!value || value === undefined){
        throw new Error(`Environment variable ${key} is missing`);
    }
    return value;
}

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "4004");
export const MONGO_URI = getEnv("MONGO_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET")
export const REFRESH_TOKEN_EXPIRY = getEnv("REFRESH_TOKEN_EXPIRY");
export const ACCESS_TOKEN_EXPIRY = getEnv("ACCESS_TOKEN_EXPIRY");
// export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
// export const RESEND_API_KEY = getEnv("RESEND_API_KEY");

const enum VerificationCodeType {
  EmailVerification = "email_verification",
  PasswordReset = "password_reset",
  login = "login_verification"
}

export { VerificationCodeType};