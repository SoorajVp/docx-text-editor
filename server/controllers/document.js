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
        next(error);
    }
};



const UpdateDocument = async (req, res, next) => {

    try {
        const { id, textBlocks } = req.body;
        const document = await Document.findById(id);

        if (!document) {
            throw new AppError("Document not found", 404);
        }

        let updatedFile;

        switch (document.mime_type) {
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                updatedFile = await helper.UpdateDocxDocument(document.url, textBlocks);
                break;

            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                updatedFile = await helper.UpdatePptxDocument(document.url, textBlocks);
                break;

            default:
                throw new AppError("Unknown Document Type", 400);
        }

        const uploadResult = await helper.cloudinaryUpload(updatedFile, document?.file_name, "updated_documents")

        const updatedDocument = await Document.findByIdAndUpdate(
            id,
            {
                $set: { url: uploadResult?.secure_url },
                $push: { updated_urls: uploadResult?.secure_url },
            },
            { new: true } // return the updated document (optional)
        );

        res.status(200).json({ document: updatedDocument, message: "Document Updated Successfully", toast: true });

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
    const { ids } = req.body;

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
    const { ids } = req.body; 
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