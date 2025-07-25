import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOncloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      return null;
    }
    //else uplaod on cloudinary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    // file uploaded successfully;
    console.log("File is uploaded on cloudinary: ", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); // remove the locally saved temp file as the upload operation got failed

    return null;
  }
};

export { uploadOncloudinary };
