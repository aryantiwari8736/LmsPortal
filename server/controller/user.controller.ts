import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import ErrorHandler from "../utills/Errorhandler";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import jwt from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import path from "path";
import sendMail from "../utills/sendMail";
//register user ---

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next) => {
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
            success:true,
            message:`please check your mail :${user.email} to activate your account`,
            activationToken:activationToken.token
        })
      } catch (error) {
        return new ErrorHandler(error.message,400);
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
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};
