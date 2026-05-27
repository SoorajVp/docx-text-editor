import path from "path";
import cloudinary from "../config/cloudinary.js";

const cloudinaryUpload = async (fileBuffer, fileName, folder) => {

    if (fileName.toLowerCase().endsWith(".pdf")) {
        fileName = path.basename(fileName, path.extname(fileName));
    }
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder, public_id: fileName },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(fileBuffer);
    });
};


export default {  cloudinaryUpload };