import asycHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asycHandler(async (req, res) => {
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
    const { fullName, Email, userName, password } = req.body   //req.body is use for get user details from frontend
    console.log("email:", Email)
    // console.log(password)
    // console.log(fullName)
    // console.log(userName)


    //2 validation

    //   if(fullName === ""){
    //     throw new ApiError(400, "fullName is required!")
    //   }  or

    if (
        [fullName, Email, userName, password].some((field) =>
            field?.trim() === " ")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    //3 cheak for user already exists or not

    const existedUser = await User.findOne({   //findone returns the first object it will get
        $or: [{ userName }, { Email }]
    })

    //for thowing error to check user exists 
    if (existedUser) {
        throw new ApiError(409, "User with userName or EMail already exists.")
    }
    //    console.log(existedUser)

    // 4 check for images and avatar (routes middleware)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!")
    }

    //5 uploading  on cloudinary
   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar is required!")
   }

   //6.creating user

   const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    Email,
    password,
    userName:userName.toLowerCase()
   })

  const createduser=await User.findById(user._id).select(
    "-password -refreshToken"
  )
  //check for createduser
  if(!createduser){
    throw new ApiError(500, "Something went wrong while registering user.")
  }

  //return user
  return res.status(201).json(
    new ApiResponse(200,createduser, "User registered successfully.")
  )
})

export default registerUser

