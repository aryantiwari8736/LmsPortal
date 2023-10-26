import { NextFunction,Request,Response } from "express";

//I dont know how it is working ------ -- this is a higher order function --- CatchAsyncError is a higher-order function that takes one argument func, which is of type any.This means you can pass any type of function to it.The func is expected to be an asynchronous function that takes req (request), res (response), and next (a callback function for passing control to the next middleware) as parameters.
export const CatchAsyncError  = (func:any) => (req:Request,res:Response,next:NextFunction) =>{
    /*
This line creates a Promise using Promise.resolve(). The purpose of this is to ensure that func is executed asynchronously and that it returns a Promise (or something thenable) if it isn't already asynchronous.
    */
    Promise.resolve(func(req,res,next)).catch(next)

    
}