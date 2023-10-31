import {app} from './app';
import connectDB from './utills/db';
require("dotenv").config();


// create server - 
app.listen(process.env.PORT,()=>{
    console.log("server is running on ");
    connectDB();
});
