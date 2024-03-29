import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router=Router()

//middleware is use for get files using multer
router.route("/register").post(
upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
)

export default router