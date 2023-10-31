import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/userModel";
import ErrorHandler from "../utills/Errorhandler";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import path from "path";
import sendMail from "../utills/sendMail";
import { sendToken } from "../utills/jwt";
//register user ---

//createing an interface --
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

// export const testContoller = CatchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
//   try {
//    res.json({
//     message:"Hello I am working"
//    })
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// } )

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body --it comes from client browser   ----- in req object --- we have details of user ---
      const { name, email, password, avatar } = req.body;
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already registered", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
        avatar,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `please check your mail :${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error) {
        return new ErrorHandler(error.message, 400);
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  //acticvation code ---
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  //token
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};

//activation of user ---
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exist", 400));
      }
      const user = await userModel.create({ name, email, password });
      res.status(201).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      return new ErrorHandler(error.message, 400);
    }
  }
);

//Login User  -
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginuUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter the eamil or password", 400)
        );
      }
      const user = await userModel.findOne({ email }).select("+passwrod");
      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }
      const isPasswordMatch = user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Logout user ---

export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
