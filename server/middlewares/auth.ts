import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utills/Errorhandler";
import { redis } from "../utills/redis";
import { CatchAsyncError } from "./catchAsyncError";
require("dotenv").config();
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token as string;
        if (!access_token) {
          return next(new ErrorHandler("You are not logged in", 401));
        }
        const decoded = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN as string
        ) as JwtPayload;
        if (!decoded) {
          return next(new ErrorHandler("incorrect access token", 401));
        }
        const user = await redis.get(decoded.id);
    
        if (!user) {
          return next(new ErrorHandler("user does not exist", 401));
        }
        req.user = JSON.parse(user);
        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 401));
    }
 
  }
);

//validate user role  --
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
