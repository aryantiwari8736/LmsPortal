require("dotenv").config();
import express , {NextFunction, Request,Response} from 'express'
export const app = express(); 
import cors from 'cors'
import cookieParser from 'cookie-parser';

//body parser --  used for cloudinary ...  
app.use(express.json({limit:"50mb"}));

//cookie parser  -   use for sending and using cookies  - 
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