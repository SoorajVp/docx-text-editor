import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import cloudinary from "../config/cloudinary.js";
import JSZip from "jszip";
import axios from "axios";
import helper from "../utils/helper.js";
import Document from "../models/document.js";
import AppError from "../utils/appError.js";

const CreateDocument = async (req, res, next) => {
    try {
        const _id = req.userId
        const { buffer, originalname, size, mimetype } = req.file
        // Convert file buffer to Cloudinary stream upload
        const result = await helper.cloudinaryUpload(buffer, originalname, "documents")

        const documentDetails = {
            user_id: _id,
            file_name: originalname,
            mime_type: mimetype,
            size: size,
            updated_urls: [result?.secure_url],
            url: result?.secure_url
        }
        let document = await Document.create(documentDetails)
        res.status(201).json({ message: `Document Created Successfully`, document, toast: true })
    } catch (error) {
        next(error)
    }
}

const GetDocumentById = async (req, res, next) => {
    try {
        const { id } = req.query

        const document = await Document.findById(id);

        if (!document) {
            throw new AppError('Document not found', 404);
        }

        res.status(200).json({ message: 'Document fetched successfully', document });
    } catch (error) {
        next(error)
    }
}


const UpdateFileNameById = async (req, res, next) => {
    try {
        const { id, fileName, mimetype } = req.body
        const ext = helper.GetFileExtFromMimeType(mimetype)

        const document = await Document.findByIdAndUpdate(id, { file_name: fileName + "." + ext }, { new: true });

        if (!document) {
            throw new AppError('Document not found', 404);
        }

        res.status(200).json({ message: 'File name updated successfully', document, toast: true });
    } catch (error) {
        next(error)
    }
}

const GetDocumentList = async (req, res, next) => {
    try {
        const _id = req.userId
        const { search } = req.query

        let filter = {
            user_id: _id,
            deletedAt: null
        };

        if (search) {
            filter.$or = [
                { file_name: { $regex: search, $options: "i" } },
                { mime_type: { $regex: search, $options: "i" } },
            ];
        }

        // Fetch filtered documents
        let documents = await Document.find(filter).sort({ updatedAt: -1 })
        res.status(200).json({ message: `Document list fetched`, documents })
    } catch (error) {
        next(error)
    }
}

const GetDocumentTexts = async (req, res, next) => {
    try {
        const { id } = req.query;
        const document = await Document.findById(id);

        if (!document) {
            throw new AppError("Document not found", 404);
        }

        let textBlocks;

        switch (document.mime_type) {
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                textBlocks = await helper.DocxTextBlocksFromUrl(document.url);
                break;

            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                const data = await helper.PptxTextBlocksFromUrl(document.url);

                // Sort slides numerically
                textBlocks = data.sort((a, b) => {
                    const slideNumberA = parseInt(a.slide.match(/slide(\d+)\.xml/)[1]);
                    const slideNumberB = parseInt(b.slide.match(/slide(\d+)\.xml/)[1]);
                    return slideNumberA - slideNumberB;
                });
                break;

            default:
                throw new AppError("Unknown Document Type", 400);
        }

        res.status(200).json({ textBlocks, document, message: "Text blocks fetched" });
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};



const UpdateDocument = async (req, res, next) => {

    try {
        const { documentUrl, updatedTextBlocks } = req.body;

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
            updatedAt: new Date().toISOString(), toast: true
        });
    } catch (error) {
        next(error)
    }
};


const SoftDeleteDocument = async (req, res, next) => {
    const { id } = req.query;
    try {
        const document = await Document.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!document) {
            throw new AppError('Document not found', 404);
        }

        res.status(200).json({ message: 'Document moved to Bin successfully', document, toast: true });
    } catch (error) {
        next(error)
    }
};

const RestoreDocuments = async (req, res, next) => {
    const { ids } = req.body; // Expecting an array of document IDs in the request body
    console.log(req.body)
    try {
        const result = await Document.updateMany(
            { _id: { $in: ids } }, // Match documents with the given IDs
            { deletedAt: null }, // Restore documents by setting deletedAt to null
        );

        if (result.modifiedCount === 0) {
            throw new AppError("No documents found to restore", 404);
        }

        res.status(200).json({
            message: `${result.modifiedCount} document(s) restored successfully`,
            toast: true
        });
    } catch (error) {
        next(error);
    }
};



const GetDeletedDocumentList = async (req, res, next) => {
    try {
        const _id = req.userId

        let filter = { user_id: _id, deletedAt: { $ne: null } };

        // Fetch filtered documents
        let documents = await Document.find(filter).sort({ updatedAt: -1 })
        res.status(200).json({ message: `Document list fetched`, documents })
    } catch (error) {
        next(error)
    }
}

const DeleteDocuments = async (req, res, next) => {
    const { ids } = req.body; // Expecting an array of document IDs
    console.log('req.body', req.body)
    try {

        const result = await Document.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            throw new AppError('No documents found to delete', 404);
        }

        res.status(200).json({
            message: `${result.deletedCount} document(s) deleted successfully`,
            toast: true
        });
    } catch (error) {
        next(error);
    }
};



export default { GetDocumentById, UpdateFileNameById, GetDocumentTexts, UpdateDocument, CreateDocument, GetDocumentList, SoftDeleteDocument, RestoreDocuments, GetDeletedDocumentList, DeleteDocuments }