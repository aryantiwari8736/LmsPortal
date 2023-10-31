require('dotenv').config();
import { json } from 'stream/consumers';
import {IUser} from '../models/userModel';
import { redis } from './redis';
import { Response } from 'express';
interface ITokenOptions {
    expires:Date,
    maxAge:number,
    httpOnly:boolean,
    sameSite: 'lax'|'strict'| 'none'|undefined,
    secure?:boolean
}
 export const sendToken  = (user:IUser,statusCode:number,res:Response )=>{
    const accesToken = user.SignAccessToken;
    const refreshToken = user.SignRefreshToken;
    //uplode refresh token to redis 
        redis.set(user._id,JSON.stringify(user) as any);

    //parse enviornment variable to integrate with fallback value

    const accesTokenExpire  = parseInt(process.env.ACCESS_TOKEN_EXPIRE ||'300',10);
    const refreshTokenExpire  = parseInt(process.env.REFRESH_TOKEN_EXPIRE ||'1200',10);


    //options fro cookies  - 
    const accesTokenOptions:ITokenOptions = {

    expires:new Date(Date.now() + accesTokenExpire * 1000),
    maxAge:accesTokenExpire * 1000,
    httpOnly:true,
    sameSite:"lax"

 }
 const refreshTokenOptions:ITokenOptions = {

    expires:new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge:refreshTokenExpire * 1000,
    httpOnly:true,
    sameSite:"lax"

 }

 //only set secure to true in production
 if(process.env.NODE_ENV === 'production'){
  accesTokenOptions.secure = true;  
 }
 res.cookie('access_token',accesToken,accesTokenOptions);
 res.cookie('refresh_token',refreshToken,refreshTokenOptions);
 res.status(statusCode).json({success:true,accesToken,refreshToken});
}