import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
require('dotenv').config();
import jwt from 'jsonwebtoken';
//used for email check or verification --  it is a regular expression --- 

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;



export interface IUser extends Document {
//interface IUser: This line declares an interface named IUser. Interfaces in TypeScript define a contract specifying the structure and shape of objects. In this case, IUser is an interface used to define the structure of objects that represent users in your code.

//extends Document: This part of the interface declaration is extending another interface named Document. In TypeScript, you can extend one interface from another. In this context, it means that IUser should inherit the properties and methods of the Document interface.

  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  //function - 
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "PLease enter your name"],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "PLease enter your password"],
      minlenght: [6, "password must be grater than 6"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);


//Hash the password before storing ----


//userSchema.pre("save", ...): This code is setting up a pre-save middleware for a Mongoose schema. In this case, it's targeting the "save" event, which typically occurs when you save a document to the database.

userSchema.pre<IUser>("save", async function (next) {

    //if (!this.isModified("password")) { next(); }: This conditional check ensures that the password is only hashed if it has been modified. This prevents unnecessary rehashing of the password when other fields of the user document are updated.

  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//sign access token - 
userSchema.methods.SignAccessToken = function (){
return jwt.sign({id:this._id},process.env.ACCESS_TOKEN ||'',{
  expiresIn:'5m'
})
}

// refresh token - 
userSchema.methods.SignRefreshToken = function (){
  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN ||'',{
    expiresIn:'7d'
  })
  }
  
  






//compare password --

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;


