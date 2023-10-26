// we have to create a class for error handler  - we have to write same oject for multiple errors - 

class ErrorHandler extends Error {
    statusCode:Number;
    //constructor function --- for creating new instances of Errorhandler class - 
    constructor(message:any,statusCode:Number){
    super (message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this,this.constructor)

}
}
export default ErrorHandler;