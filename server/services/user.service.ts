import { Response } from "express";
import { redis } from "../utills/redis";

export const getUserById = async (id:string,res:Response) =>{ 
const userIson  = await redis.get(id);
if(userIson){

    const user = JSON.parse(userIson);
    res.status(200).json({
        success:true,
        user:user
    })
}


}