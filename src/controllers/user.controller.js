import asycHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import { user } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";

const registerUser=asycHandler(async(req,res)=>{
    // res.status(200).json({
    //     message:"HELLO WORLD"
    // })

    // --steps --
    //get user details from fronend (postman)
    //validation - check if users details are right or not 
    //check if user already exists - we can check from email or username
    //check for images, check for avatar
    //fist check ki user uploaded the image then multer uploaded it or not after that cloudinary check
    //upload them to cloudinary, avatar
    //create user object -creation call create entry in db
    //remove password and refreshtoken field from response
    //check for user creation ki user created or not 
    //then return response


    //1 get user details from fronend (postman)
    const {fullName, Email, userName, password}=req.body
    console.log("email:", Email)
    console.log(password)
    console.log(fullName)

    // 2. validation - check if users details are right or not 

    if(
        [fullName, Email, userName,password].some((field)=>
        field?.trim()=== "")
        ){
            throw new ApiError(400, "All fields are required!")
        }

    
    // 3. check if user already exists - we can check from email or username


        const existedUser=user.findOne({
            $or: [{ userName }, {Email}]
        })

        if(existedUser){
            throw new ApiError(409, "User with email or username  already exsits" )
        }
     
        console.log(existedUser)

    // 4.check for images, check for avatar

       const avatarLocalPath= req.files?.avatar[0]?.path;
       const coverImageLocalPath=req.files?.coverImage[0]?.path;

       if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required!")
       }

      const avatar= await uploadOnCloudinary(avatarLocalPath)
      const coverImage=await uploadOnCloudinary(coverImageLocalPath)

      if(!avatar){
        throw new ApiError(400, "Avatar file is required!")

      }

      const user=await  user.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage.url|| " ", //check coverimage hai ki nhi
        Email,
        password,
        userName:userName.toLowerCase()
        
      })
     const createuser= await user.findById(user._id).select(
        "-password -refreshToken"
     )

     if(!createuser){
        throw new ApiError(500, "Somthing went weong while registering the user!")
     }

     return res.status(201).json(
        new ApiResponse(200, createuser, "User registerd successfully.")
     )
    } )


export default registerUser