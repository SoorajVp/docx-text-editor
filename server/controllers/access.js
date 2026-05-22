import Document from "../models/document.js";
import Access from "../models/access.js";
import User from "../models/user.js";
import mailService from "../utils/mailService.js";
import helper from "../utils/helper.js";

/* ── Send invitations ────────────────────────────────────────────── */
const sendAccessInviation = async (req, res, next) => {
    try {
        const { doc_id, emails, mode, is_public } = req.body;
        const ownerId = req.userId;

        const owner    = await User.findById(ownerId);
        const document = await Document.findByIdAndUpdate(doc_id, { is_public }, { new: true });

        if(emails.length === 0 && document?.is_public !== true) {
            
        }

        for (const email of emails) {
            const recipient = await User.findOne({ email });
            if (!recipient) continue;

            // Upsert Access record — one record per (recipient, document) pair
            const access = await Access.findOneAndUpdate(
                { recipientId: recipient._id, documentId: doc_id },
                {
                    ownerId,
                    recipientId: recipient._id,
                    documentId: doc_id,
                    permission: mode,   // "read" | "write"
                    status: "pending",
                    enabled: true,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await mailService.sendAccessRequestEmail({
                senderName:     owner.name,
                senderEmail:    owner.email,
                recipientEmail: recipient.email,
                documentName:   document.file_name,
                accessId:       access._id,
                permission:     mode,
            });
        }

        const shareUrl = is_public
            ? `${process.env.FRONTEND_URL}/shared/${doc_id}`
            : null;

        res.status(201).json({ message: "Access request sent successfully", toast: true, url: shareUrl });
    } catch (error) {
        console.error("Error sending access request:", error);
        next(error);
    }
};

const enableFileEditing = async (req, res, next) => {
    try {
        const { accessId } = req.body;
        const userId = req.userId;
console.log('req.body :>> ', req.body);
        const access = await Access.findById(accessId);
        if (!access || access.deletedAt) {
            return res.status(403).json({ message: "This invitation link is invalid or has expired." });
        }
        if (access.recipientId.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to edit this document." });
        }
        if (access.permission !== "write") {
            return res.status(403).json({ message: "You only have read access to this document." });
        }

        access.enabled = true;
        const updatedAccess = await access.save();
        
        res.status(200).json({ message: "Editing enabled. You can now edit the document.", access: updatedAccess, toast: true});
    } catch (error) {
        next(error);
    }
}

/* ── Get shared document details (+ access metadata) ────────────── */
const getSharedDocument = async (req, res, next) => {
    try {
        const { accessId } = req.query;
        const userId = req.userId;

        const access = await Access.findById(accessId);
        if (!access || access.deletedAt || !access.enabled) {
            return res.status(403).json({ message: "This invitation link is invalid or has expired." });
        }

        // Only the intended recipient may open the link
        if (access.recipientId.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to view this document." });
        }

        const document = await Document.findById(access.documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        res.status(200).json({
            document,
            access: {
                _id:        access._id,
                permission: access.permission,
                status:     access.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getSharedFileList = async (req, res, next) => {
    try {
        const { accessId } = req.query;
        const userId = req.userId;

        const sharedFiles = await Access.find({recipientId: userId, deletedAt: null})
        .populate("ownerId")
        .populate("documentId");
       
        res.status(200).json({  sharedFiles });
    } catch (error) {
        next(error);
    }
};

/* ── Get text blocks for an editable shared document ────────────── */
const getSharedDocumentTextBlocks = async (req, res, next) => {
    try {
        const { accessId } = req.query;
        const userId = req.userId;

        const access = await Access.findById(accessId);

        if (!access || access.deletedAt || !access.enabled) {
            return res.status(403).json({ message: "This invitation link is invalid or has expired." });
        }
        if (access.recipientId.toString() !== userId) {
            return res.status(403).json({ message: "Access denied." });
        }
        if (access.permission !== "write") {
            return res.status(403).json({ message: "You only have read access to this document." });
        }

        const document = await Document.findById(access.documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        const textBlocks = await helper.DocxTextBlocksFromUrl(document.url);

        res.status(200).json({ document, textBlocks });
    } catch (error) {
        next(error);
    }
};

/* ── List users who already have access to a document ────────────── */
const getDocumentAccessList = async (req, res, next) => {
    try {
        const { doc_id } = req.query;
        const userId = req.userId;

        console.log('doc_id :>> ', doc_id);
        const document = await Document.findById(doc_id);
        console.log('document.user_id :>> ', document.user_id);
        if (!document || document.user_id.toString() !== userId) {
            return res.status(403).json({ message: "Access denied." });
        }

        
        const accessList = await Access.find({ documentId: doc_id, deletedAt: null })
            .populate("recipientId", "name email picture");
        
            console.log('accessList :>> ', accessList);
        if(accessList.length === 0) {
            await Access.create({
                ownerId: userId,
                recipientId: null,
                documentId: doc_id,
                status: "accepted",
                permission: "read",
            });
        }

        res.status(200).json({ accessList });
    } catch (error) {
        console.log('error :>> ', error);
        next(error);
    }
};

export default { sendAccessInviation, getSharedDocument, getSharedDocumentTextBlocks, enableFileEditing, getSharedFileList, getDocumentAccessList };
