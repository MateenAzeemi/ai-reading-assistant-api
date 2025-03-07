import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath) => {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
        api_key: process.env.CLOUDNARY_API_KEY,
        api_secret: process.env.CLOUDNARY_API_SECRET
    });
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
        //file has been uploaded successfully
        console.log("the file has been uploaded on cloudinary successfully", result.url);
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the file if upload fails
        console.error("Error uploading file to cloudinary", error);
        return null;
    }
}

export default uploadOnCloudinary;
