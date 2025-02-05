import axios from "axios";
import JSZip from "jszip";
import cloudinary from "../config/cloudinary.js";

const ConvertDocToXML = async (docxtUrl) => {
    // Fetch the document from the URL
    const response = await axios.get(docxtUrl, { responseType: "arraybuffer" });
    const originalDoc = Buffer.from(response.data);

    // Load the DOCX as a ZIP archive
    const zip = await JSZip.loadAsync(originalDoc);
    const documentXml = await zip.file("word/document.xml").async("string");
    return documentXml
}

const uploadImageToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(fileBuffer);
    });
};


// Function to get the filename and add a random number
const GenerateFileName = (url) => {
    const fileName = url.split('/').pop(); 
    return fileName
};


export default { ConvertDocToXML, GenerateFileName, uploadImageToCloudinary }