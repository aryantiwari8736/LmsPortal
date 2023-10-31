import ErrorHandler from "../utills/Errorhandler";
import { NextFunction, Request, Response } from 'express';

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';


    //wrong mongodb id  -- 
    if (err.name == 'CastError') {
        const message = `Resource Not Found Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }


    //Duplicate Key --- 
if(err.code == 11000){
    const message  =`Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400); 
}


res.status(err.statusCode ).json({
    success:false,
    message:err.message,
})


}