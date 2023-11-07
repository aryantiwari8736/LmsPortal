import nodemailer,{Transporter} from 'nodemailer';
import ejs from 'ejs'
import path from 'path';
require('dotenv').config();
interface EmailOptions {
    email:string,
    subject:string,
    template:string,
    data:{[key:string]:any}
}

const sendMail = async (options:EmailOptions):Promise <void>=>{
   try {
    
    const transporter:Transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT),
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD

        }
    })

    const {email,subject,template,data} = options;
    //get the path to email template file - 
    const templatePath = path.join(__dirname,"../mails",template)

    //render the email template with ejs - 
    const html:string = await ejs.renderFile(templatePath,data);

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:email,
        subject,
        html
    }
    await transporter.sendMail(mailOptions);
   } catch (error) {
    
   }
    } 
    
// update -- 
  const  newMail = async (options:EmailOptions):Promise <void>=>{
        try {
         
         const transporter:Transporter = nodemailer.createTransport({
             host:process.env.SMTP_HOST,
             port:parseInt(process.env.SMTP_PORT),
             service:process.env.SMTP_SERVICE,
             auth:{
                 user:process.env.SMTP_MAIL,
                 pass:process.env.SMTP_PASSWORD
     
             }
         })
     
         const {email,subject,template,data} = options;
         //get the path to email template file - 
         const templatePath = path.join(__dirname,"../mails",template)
     
         //render the email template with ejs - 
         const html:string = await ejs.renderFile(templatePath,data);
     
         const mailOptions = {
             from:process.env.SMTP_MAIL,
             to:email,
             subject,
             html
         }
         await transporter.sendMail(mailOptions);
        } catch (error) {
         
        }
         } 

export default sendMail;