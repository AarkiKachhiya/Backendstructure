import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null
        //upload thr file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto"
            });

        //file has been uploaded successfully
        console.log("File is uploaded successfully", response.url)
        return response
    } catch (err) {
        fs.unlinkSync(localFilePath) //remove locaally saved temp file as the uploaad is filed
        return null;
    }

}

export default uploadOnCloudinary