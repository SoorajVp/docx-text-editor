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

export default { ConvertDocToXML }