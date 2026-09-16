import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath);
    console.log("Error in cloudinary: ", error);
    return "";
  }
};

export default uploadOnCloudinary;
