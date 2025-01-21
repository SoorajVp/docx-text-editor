import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import cloudinary from "../config/cloudinary.js";
import JSZip from "jszip";
import axios from "axios";
import helper from "../utils/helper.js";

export const GetDocumentTexts = async (req, res) => {
    const { documentUrl } = req.query;
    if (!documentUrl) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    try {
        const response = await axios.get(documentUrl, { responseType: "arraybuffer" });
        const originalDoc = Buffer.from(response.data);

        // Load the DOCX as a ZIP archive
        const zip = await JSZip.loadAsync(originalDoc);
        const documentXml = await zip.file("word/document.xml").async("string");
        // console.log('documentXml ---------------------> ', documentXml)
        // Parse the XML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(documentXml, "application/xml");

        // Extract all <w:p> (paragraph) elements
        const paragraphElements = Array.from(doc.getElementsByTagName("w:p"));

        // Extract individual word/text information from <w:t> tags
        const textBlocks = [];
        paragraphElements.forEach((para, paraIndex) => {
            const paraId = para.getAttribute("w14:paraId") || null; // Get w14:paraId
            const textId = para.getAttribute("w14:textId") || null; // Get w14:textId

            // Extract each <w:t> (text) element inside the paragraph
            const textElements = Array.from(para.getElementsByTagName("w:t"));
            textElements.forEach((textElement, textIndex) => {
                textBlocks.push({
                    id: `para-${paraIndex}-text-${textIndex}`,
                    paraId,
                    textId,
                    text: textElement.textContent || "", // The actual text content of <w:t>
                });
            });
        });

        // Send the text blocks as a response
        res.status(200).json({ textBlocks, message: "Text blocks fetched" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to fetch or parse document" });
    }
};



export const UpdateDocument = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { documentUrl, updatedTextBlocks } = req.body;

    if (!documentUrl || !Array.isArray(updatedTextBlocks)) {
        return res.status(400).json({
            message: "Invalid payload. 'documentUrl' and 'updatedTextBlocks' are required."
        });
    }

    try {
        const fileName = helper.GenerateFileName(documentUrl);

        // Fetch the document
        const response = await axios.get(documentUrl, { responseType: "arraybuffer" });
        const originalDoc = Buffer.from(response.data);

        // Load the DOCX as a ZIP archive
        const zip = await JSZip.loadAsync(originalDoc);
        let documentXml = await zip.file("word/document.xml").async("string");

        // Parse the XML document
        const parser = new DOMParser({ preserveWhiteSpace: true });
        const serializer = new XMLSerializer();
        const doc = parser.parseFromString(documentXml, "application/xml");

        // Get all <w:p> (paragraph) elements
        const paragraphElements = Array.from(doc.getElementsByTagName("w:p"));

        // Update text blocks based on IDs
        updatedTextBlocks.forEach(({ id, text }) => {
            // Extract paragraph and text indices from the ID
            const [paraIndex, textIndex] = id
                .replace("para-", "")
                .split("-text-")
                .map(Number);

            if (
                paraIndex >= 0 && paraIndex < paragraphElements.length // Valid paragraph index
            ) {
                const para = paragraphElements[paraIndex];
                const textElements = Array.from(para.getElementsByTagName("w:t"));

                if (
                    textIndex >= 0 && textIndex < textElements.length // Valid text element index
                ) {
                    const textElement = textElements[textIndex];

                    // Update the text content
                    while (textElement.firstChild) {
                        textElement.removeChild(textElement.firstChild); // Clear old text content
                    }
                    textElement.appendChild(doc.createTextNode(text || "")); // Set new text content
                }
            }
        });

        // Serialize the updated document back to XML
        documentXml = serializer.serializeToString(doc);

        // Update the ZIP file with the modified document.xml
        zip.file("word/document.xml", documentXml);
        const updatedDoc = await zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        });

        // Upload the updated document to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "auto", public_id: fileName },
                (error, result) => (error ? reject(error) : resolve(result))
            ).end(updatedDoc);
        });

        // Return the URL of the uploaded document
        res.status(201).json({
            message: "Document updated successfully",
            updatedUrl: uploadResult.secure_url,
            size: updatedDoc.length,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error while updating the document:", error);

        if (error.response) {
            return res.status(500).json({ message: "Failed to fetch the document" });
        }

        if (error.name === "JSZipError") {
            return res.status(500).json({ message: "Failed to process the DOCX file" });
        }

        res.status(500).json({ message: "Unexpected error occurred" });
    }
};
