import mongoose from "mongoose";
import { sign } from "jsonwebtoken";
import { hashvalue, isPasswordcorrect } from "../utils/bycrpt";
import { ACCESS_TOKEN_EXPIRY, JWT_REFRESH_SECRET, JWT_SECRET, REFRESH_TOKEN_EXPIRY } from "../utils/constants";

export interface UserDocument extends mongoose.Document {
   _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
   
    __v: number;
    comparePassword( val : string) :Promise <boolean> ;
    setRefreshToken(session_id :mongoose.Types.ObjectId):string;
    setAccessToken(session_id :mongoose.Types.ObjectId):string 
    omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "verified" | "createdAt" | "updatedAt" | "__v"
  >;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      verified: { type: Boolean, required: true, default: false },
     
    },
    {
      timestamps: true,
    }
  );

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    this.password = await hashvalue(this.password);
    return next();
  });

  userSchema.methods.comparePassword = async function (val: string) {
    return isPasswordcorrect(val, this.password);
  };
  
  userSchema.methods.setRefreshToken =  function (session_id :mongoose.Types.ObjectId) :string{
    return   sign(
        {
            _id: this._id,
            
        },
        JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY 
        }
    )
}
userSchema.methods.setAccessToken = function (session_id :mongoose.Types.ObjectId) : string{
  return sign(
      {
        _id: this._id,
        email : this.email,
        session_id : session_id
          
      },
      JWT_SECRET,
      {
          expiresIn: ACCESS_TOKEN_EXPIRY 
      }
  )
}
userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
  const UserModel = mongoose.model<UserDocument>("User", userSchema);
  export default UserModel;