import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userSchema=new mongoose.Schema({

  userName:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,

  },

  Email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  }, 

  fullName:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    index:true
  },

  avatar:{
    type:String, //couldinary url
    required:true
  },

  coverImage:{
    type:String

  },

  watchHistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"video"
    }
  ], 

  password:{
    type:String,
    required:[true, 'Password is required']
  },

  refreshToken:{
    type:String
  }

}, {timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("Password")) return next()

    this.password= await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
 return await  bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
        _id: this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName


    },
     process.env.ACESS_TOKEN_SECRET,
     {
          expiresIn:process.env.ACESS_TOKEN_EXPIRY
     }
    
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
         _id: this._id
 
 
     },
      process.env.ACESS_TOKEN_SECRET,
      {
           expiresIn:process.env.ACESS_TOKEN_EXPIRY
      }
     
     )
 }
userSchema.methods.generateRefreshToken=function(){}

export const User = mongoose.model ("User", userSchema)