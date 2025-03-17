import axios from "axios";
import JSZip from "jszip";
import path from "path";
import cloudinary from "../config/cloudinary.js";

const ConvertDocToXML = async (docUrl) => {
    // Fetch the document from the URL
    const response = await axios.get(docUrl, { responseType: "arraybuffer" });
    const originalDoc = Buffer.from(response.data);

    // Load the DOCX as a ZIP archive
    const zip = await JSZip.loadAsync(originalDoc);
    const documentXml = await zip.file("word/document.xml").async("string");
    return documentXml
}

const cloudinaryUpload = async (fileBuffer, fileName, folder) => {
    console.log("file mime type => ", fileName )

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


// Function to get the filename and add a random number
const GenerateFileName = (url) => {
    const fileName = url.split('/').pop(); 
    return fileName
};




export default { ConvertDocToXML, GenerateFileName, cloudinaryUpload }