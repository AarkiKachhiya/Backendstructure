import express from 'express';
import cookieParser from 'cookie-parser';
import CORS from 'cors'

const app =express();

app.use(CORS({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("Public"))
app.use(cookieParser())

export default express;