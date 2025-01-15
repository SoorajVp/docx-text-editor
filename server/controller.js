import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import cloudinary from "./config/cloudinary.js";
import JSZip from "jszip";
import axios from "axios";
import helper from "./utils/helper.js";

export const GetDocumentTexts = async(req, res) => {
    const { documentUrl } = req.query;

    if (!documentUrl) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    try {
        // const documentXml = await Helper.ConvertDocToXML(documentUrl)
        const response = await axios.get(documentUrl, { responseType: "arraybuffer" });
        const originalDoc = Buffer.from(response.data);

        // Load the DOCX as a ZIP archive
        const zip = await JSZip.loadAsync(originalDoc);
        let documentXml = await zip.file("word/document.xml").async("string");

        // Parse the XML content to extract text
        const parser = new DOMParser();
        const doc = parser.parseFromString(documentXml, "application/xml");
        const textNodes = Array.from(doc.getElementsByTagName("w:t"));

        // Extract text content from the <w:t> elements
        const textBlocks = textNodes.map((node) => node.textContent.trim()).filter(Boolean);

        // Return the extracted text blocks
        res.status(200).json({ textBlocks });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Failed to fetch or parse document" });
    }
}




// Utility Functions
const escapeXML = (str) =>
    str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const normalizeWhitespace = (str) => str.replace(/\s+/g, " ").trim();

export const UpdateDocument = async(req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { documentUrl, updatedTextBlocks } = req.body;

    if (!documentUrl || !Array.isArray(updatedTextBlocks)) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    try {
        const fileName = helper.GenerateFileName(documentUrl)
        const response = await axios.get(documentUrl, { responseType: "arraybuffer" });
        const originalDoc = Buffer.from(response.data);

        // Load the DOCX as a ZIP archive
        const zip = await JSZip.loadAsync(originalDoc);
        let documentXml = await zip.file("word/document.xml").async("string");

        // Parse the XML document to modify the text content
        const parser = new DOMParser({ preserveWhiteSpace: true });
        const serializer = new XMLSerializer();
        const doc = parser.parseFromString(documentXml, "application/xml");

        const textNodes = Array.from(doc.getElementsByTagName("w:t"));

        // Ensure text blocks align with text nodes
        let normalizedBlocks = updatedTextBlocks.map(normalizeWhitespace);

        if (normalizedBlocks.length > textNodes.length) {
            console.warn("Extra text blocks detected. Truncating...");
            normalizedBlocks = normalizedBlocks.slice(0, textNodes.length);
        } else if (normalizedBlocks.length < textNodes.length) {
            console.warn("Fewer text blocks detected. Padding with empty strings...");
            normalizedBlocks = [
                ...normalizedBlocks,
                ...Array(textNodes.length - normalizedBlocks.length).fill(""),
            ];
        }

        // Update text nodes with the new content
        normalizedBlocks.forEach((block, index) => {
            textNodes[index].textContent = escapeXML(block);
        });

        // Serialize the updated document back to XML
        documentXml = serializer.serializeToString(doc);

        // Update the ZIP file with the modified document.xml
        zip.file("word/document.xml", documentXml);
        const updatedDoc = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });

        // Upload the updated document to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "auto", public_id: fileName },
                (error, result) => (error ? reject(error) : resolve(result))
            ).end(updatedDoc);
        });

        // Return the URL of the uploaded document
        res.status(200).json({
            message: "Document saved successfully",
            updatedUrl: uploadResult.secure_url,
            size: updatedDoc.length,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error:", error);

        if (error.response) {
            return res.status(500).json({ message: "Failed to fetch the document" });
        }

        if (error.name === "JSZipError") {
            return res.status(500).json({ message: "Failed to process the DOCX file" });
        }

        res.status(500).json({ message: "Unexpected error occurred" });
    }
}
