class ApiError extends Error{
    constructor(

        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null  //learn this
        this.message=message
        this.success=false
        this.errors=errors

        if(this.stack){
            this.stack=this.stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export default ApiError