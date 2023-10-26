
require("dotenv").config(); // as it was module.exports
import express , {NextFunction, Request,Response} from 'express' // it is named export and default export -- 
export const app = express(); 
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { ErrorMiddleware} from './middlewares/error';


// The app.use() method is typically used to add middleware at the application level, meaning the middleware will be executed for all routes within the Express application. Here's the basic syntax:
//body parser(middleware) --  used for cloudinary ...  -- it is parsing the req.body data send by the browser to the server so that we can use it in our express server .
app.use(express.json({limit:"50mb"}));

//cookie parser(middle-ware)  -   use for sending and using cookies  - it parsing cookie (a small piece of data send by the server to the browser for- session,personalization and etc...)
app.use(cookieParser());

//cors -  we can add origin from which servers our api can be hit  - 
app.use(cors({
    origin: process.env.ORIGIN
})) ;





//testing api - 
app.get("/test",(req:Request,res:Response)=>{
res.status(200).json({
    success:true,
    message:"Api is running"
})
})

//unknown route - 
app.all("*",(req:Request,res:Response,next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
})


//error handler ---- 
app.use(ErrorMiddleware);