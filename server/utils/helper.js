import axios from "axios";
import JSZip from "jszip";

const ConvertDocToXML = async (docxtUrl) => {
    // Fetch the document from the URL
    const response = await axios.get(docxtUrl, { responseType: "arraybuffer" });
    const originalDoc = Buffer.from(response.data);

    // Load the DOCX as a ZIP archive
    const zip = await JSZip.loadAsync(originalDoc);
    const documentXml = await zip.file("word/document.xml").async("string");
    return documentXml
}


// Function to generate a 4-digit random number
const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);

// Function to get the filename and add a random number
const GenerateFileName = (url) => {
    const fileName = url.split('/').pop(); 
    return fileName
};


export default { ConvertDocToXML, GenerateFileName }