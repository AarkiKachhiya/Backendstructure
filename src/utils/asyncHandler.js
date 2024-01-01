const asycHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}










export default asycHandler

// const asycHandler=(fn)=> async(req, res, next)=>{
//     try{
//         await fn(req,req,next)

//     }catch(error){
//         res.status(err.code || 500).json({
//             success :false,
//             message:err.message
//         })
//     }
// }