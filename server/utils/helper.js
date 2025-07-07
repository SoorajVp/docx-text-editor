import axios from "axios";
import JSZip from "jszip";
import path from "path";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
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

const GetFileExtFromMimeType = (mimeType) => {
    switch (mimeType) {
        case "application/pdf":
            return "pdf";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "pptx";

        default:
            return "unKnown"; // Default icon
    }
};

const GetFileBufferFromUrl = async (fileUrl) => {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const bufferData = response.data;
    if (!bufferData || bufferData.length === 0) {
        throw new Error("The document is empty or corrupted.");
    }
    return bufferData
}



const DocxTextBlocksFromUrl = async (fileUrl) => {
    try {
        const bufferData = await GetFileBufferFromUrl(fileUrl);
        const originalDoc = Buffer.from(bufferData);
        const zip = await JSZip.loadAsync(originalDoc);
        let documentXml = await zip.file("word/document.xml").async("string");

        const parser = new DOMParser();
        const doc = parser.parseFromString(documentXml, "application/xml");

        const paragraphElements = Array.from(doc.getElementsByTagName("w:p"));
        const textBlocks = [];

        // Helper function to check if an element is inside alternate content
        const isAlternateContent = (element) => {
            let parent = element.parentNode;
            while (parent) {
                if (parent.nodeName === "mc:AlternateContent") {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        };

        paragraphElements.forEach((para, paraIndex) => {
            // Skip paragraphs that are inside alternate content (like text boxes)
            if (isAlternateContent(para)) {
                return;
            }

            const paraId = para.getAttribute("w14:paraId") || null;
            const textId = para.getAttribute("w14:textId") || null;

            const textElements = Array.from(para.getElementsByTagName("w:t"));
            let sentId = 0;

            textElements.forEach((textElement, textIndex) => {
                const textContent = textElement.textContent || "";

                // Skip empty text nodes
                if (!textContent.trim()) {
                    return;
                }

                textBlocks.push({
                    id: `para-${paraIndex}-text-${textIndex}`,
                    paraId: paraId ?? paraIndex,
                    textId: textId ?? textIndex,
                    sentId,
                    text: textContent,
                });

                if (textContent.includes('.')) {
                    sentId++;
                }
            });
        });

        return textBlocks;
    } catch (err) {
        throw new Error(`Error parsing document: ${err.message}`);
    }
};

const UpdateDocxDocument = async (fileUrl, updatedTextBlocks) => {
    try {
        const bufferData = await GetFileBufferFromUrl(fileUrl);
        const originalDoc = Buffer.from(bufferData);

        // Load the DOCX as a ZIP archive
        const zip = await JSZip.loadAsync(originalDoc);
        let documentXml = await zip.file("word/document.xml").async("string");

        // Parse the XML document to modify the text content
        const parser = new DOMParser({ preserveWhiteSpace: true });
        const serializer = new XMLSerializer();
        const doc = parser.parseFromString(documentXml, "application/xml");


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
        const updatedDoc = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
        return updatedDoc

    } catch (error) {
        throw new Error(`Error updating document: ${error.message}`);

    }
}

const UpdatePptxDocument = async (fileUrl, updatedTextBlocks) => {
    try {
        const bufferData = await GetFileBufferFromUrl(fileUrl);
        const originalPptx = Buffer.from(bufferData);

        // Load the PPTX as a ZIP archive
        const zip = await JSZip.loadAsync(originalPptx);

        const textBlocksMap = new Map();
        updatedTextBlocks.forEach(block => {
            textBlocksMap.set(block.id, block);
        });

        // Get all slide files
        const slideFiles = Object.keys(zip.files).filter(file =>
            file.startsWith("ppt/slides/slide") && file.endsWith(".xml")
        );

        // Process each slide file
        for (const slideFile of slideFiles) {
            let slideXml = await zip.file(slideFile).async("string");
            const parser = new DOMParser({ preserveWhiteSpace: true });
            const serializer = new XMLSerializer();
            const doc = parser.parseFromString(slideXml, "application/xml");

            // Get all shapes in the slide
            const shapes = Array.from(doc.getElementsByTagName("p:sp"));
            let changesMade = false;

            for (const shape of shapes) {
                const cNvPr = Array.from(shape.getElementsByTagName("p:cNvPr"))[0];
                const shapeId = cNvPr?.getAttribute("id") || `shape-${shapes.indexOf(shape)}`;

                const paragraphs = Array.from(shape.getElementsByTagName("a:p"));

                for (let paraIndex = 0; paraIndex < paragraphs.length; paraIndex++) {
                    const para = paragraphs[paraIndex];
                    const textElements = Array.from(para.getElementsByTagName("a:t"));

                    for (let textIndex = 0; textIndex < textElements.length; textIndex++) {
                        const textElement = textElements[textIndex];
                        const blockId = `slide-${slideFile}-shape-${shapeId}-para-${paraIndex}-text-${textIndex}`;

                        if (textBlocksMap.has(blockId)) {
                            const updatedBlock = textBlocksMap.get(blockId);
                            if (textElement.textContent !== updatedBlock.text) {
                                textElement.textContent = updatedBlock.text || "";
                                changesMade = true;
                            }
                        }
                    }
                }
            }

            if (changesMade) {
                // Serialize the updated slide XML back to a string
                slideXml = serializer.serializeToString(doc);
                // Update the ZIP file with the modified slide XML
                zip.file(slideFile, slideXml);
            }
        }

        // Generate the updated PPTX file
        const updatedPptx = await zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        });
        return updatedPptx

    } catch (error) {
        throw new Error(`Error updating document: ${error.message}`);

    }
}

const PptxTextBlocksFromUrl = async (fileUrl) => {
    try {
        // Fetch the PPTX file
        const bufferData = await GetFileBufferFromUrl(fileUrl);
        const originalPptx = Buffer.from(bufferData);

        // Load the PPTX as a ZIP archive
        const zip = await JSZip.loadAsync(originalPptx);

        // Get all slide files (e.g., slide1.xml, slide2.xml, etc.)
        const slideFiles = Object.keys(zip.files).filter((file) =>
            file.startsWith("ppt/slides/slide") && file.endsWith(".xml")
        );

        // Array to store all text blocks
        const textBlocks = [];

        // Process each slide file
        for (const slideFile of slideFiles) {
            // Extract the slide XML content
            const slideXml = await zip.file(slideFile).async("string");

            // Parse the XML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(slideXml, "application/xml");

            // Get all shapes in the slide
            const shapes = Array.from(doc.getElementsByTagName("p:sp"));

            shapes.forEach((shape, shapeIndex) => {
                // Get shape ID
                const cNvPr = Array.from(shape.getElementsByTagName("p:cNvPr"))[0];
                const shapeId = cNvPr?.getAttribute("id") || `shape-${shapeIndex}`;

                // Extract all <a:p> (paragraph) elements within this shape
                const paragraphElements = Array.from(shape.getElementsByTagName("a:p"));

                // Extract text from each paragraph
                paragraphElements.forEach((para, paraIndex) => {
                    // Extract each <a:t> (text) element inside the paragraph
                    const textElements = Array.from(para.getElementsByTagName("a:t"));
                    textElements.forEach((textElement, textIndex) => {
                        textBlocks.push({
                            slide: slideFile, // Slide file name (e.g., slide1.xml)
                            shapeId, // Added shape ID
                            id: `slide-${slideFile}-shape-${shapeId}-para-${paraIndex}-text-${textIndex}`,
                            text: textElement.textContent || "", // The actual text content of <a:t>
                        });
                    });
                });
            });
        }
        return textBlocks;
    } catch (err) {
        throw new Error(`Error parsing document: ${err.message}`);
    }
};


export default { 
    GenerateFileName, 
    cloudinaryUpload, 
    GetFileExtFromMimeType, 
    DocxTextBlocksFromUrl, 
    UpdateDocxDocument, 
    PptxTextBlocksFromUrl,
    UpdatePptxDocument
}