import Document from "../models/document.js";
import Access from "../models/access.js";
import User from "../models/user.js";
import mailService from "../utils/mailService.js";
import helper from "../utils/helper.js";
import AppError from "../utils/appError.js";


/* ── Send invitations ────────────────────────────────────────────── */
const sendAccessInviation = async (req, res, next) => {
    try {
        const {
            doc_id,
            emails = [],
            mode = 'viewer',
            visibility = 'private',
        } = req.body;

        const ownerId = req.userId;
        const document = await Document.findOneAndUpdate(
            { _id: doc_id, user_id: ownerId, deletedAt: null },
            {
                visibility: visibility
            },
            {
                new: true
            }
        ).populate('user_id', 'name email');

        if (!document) {
            throw new AppError('Document not found', 404);
        }

        /* ─────────────────────────────────────────────
           PRIVATE SHARING
        ───────────────────────────────────────────── */
        let access = null;

        for (const email of emails) {

            const recipient = await User.findOne({
                email: email.toLowerCase(),
            });

            if (!recipient) continue;

            // Create or update access
            access = await Access.findOneAndUpdate(
                {
                    recipientId: recipient._id,
                    documentId: doc_id,
                    visibility: 'private',
                },
                {
                    ownerId,
                    recipientId: recipient._id,
                    documentId: doc_id,
                    permission: mode,
                    visibility: 'private',
                    enabled: true,
                    deletedAt: null,
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                }
            );

            // Update recipient cache
            await Document.findByIdAndUpdate(
                doc_id,
                {
                    $addToSet: {
                        recipientIds: recipient._id,
                    },
                }
            );

            // Send email
            await mailService.sendAccessRequestEmail({
                senderName: document.user_id.name,
                senderEmail: document.user_id.email,
                recipientEmail: recipient.email,
                documentName: document.file_name,
                documentId: document._id,
                accessId: access._id,
                permission: mode,
            });
        }

        let accessUri = null;
        if (document.visibility === "public") {
            accessUri = access ? `${process.env.FRONTEND_URL}/shared/${document.user_id._id}?doc=${document._id}` : null;
        }

        return res.status(201).json({
            message: 'Access shared successfully',
            toast: true,
            accessUri
        });

    } catch (error) {
        console.error('Error sending access request:', error);
        next(error);
    }
};



const enableFileEditing = async (req, res, next) => {
    try {
        const { accessId } = req.body;
        const userId = req.userId;
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

        res.status(200).json({ message: "Editing enabled. You can now edit the document.", access: updatedAccess, toast: true });
    } catch (error) {
        next(error);
    }
}


/* ── Get shared document details (+ access metadata) ────────────── */
const getSharedDocument = async (req, res, next) => {
    try {
        const { accessId, documentId } = req.query;
        const userId = req.userId;
        let user = null;
        if (userId !== "UNAUTHORIZED_USER") {
            user = await User.findOne({ _id: userId, status: true })
        }
        let access = null;

        const document = await Document.findById(documentId)

        if (!document) {
            throw new AppError('Document not found', 404);
        }

        if (document.visibility === "public") {
            access = await Access.findById(accessId);
            return res.status(200).json({
                document, user,
                access: {
                    _id: access ? access._id : null,
                    permission: access ? access.permission : "viewer",
                },
            });
        } else {
            if (!user) {
                throw new AppError('Sign in to view this document', 400);
            }

            access = await Access.findOne({ documentId, recipientId: userId, deletedAt: null });
            if (!access) {
                throw new AppError('You do not have access to this document', 403);
            }
        }



        res.status(200).json({
            document, user,
            access: {
                _id: access._id,
                permission: access.permission,
            },
        });
    } catch (error) {
        console.log('error', error)
        next(error);
    }
};

const getSharedFileList = async (req, res, next) => {
    try {
        const { accessId } = req.query;
        const userId = req.userId;

        const sharedFiles = await Access.find({ recipientId: userId, deletedAt: null })
            .populate("ownerId")
            .populate("documentId");

        res.status(200).json({ sharedFiles });
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

        // Find document
        const document = await Document.findOne({
            _id: doc_id,
            deletedAt: null,
        });

        // Document not found
        if (!document) {
            throw new AppError('Document not found', 404);
        }

        // Only owner can view access list
        if (document.visibility === "private" && document.user_id.toString() !== userId.toString()) {
            throw new AppError('You do not have access to this document', 403);
        }

        // Get all access entries
        const accessList = await Access.find({
            documentId: doc_id,
            deletedAt: null,
            enabled: true,
        })
            .populate('recipientId', 'name email picture')
            .sort({ createdAt: -1 });

        // Public access entry
        const publicAccess = accessList.find(
            (item) => item.visibility === 'public'
        );

        // Public share URL
        const publicShareUrl = publicAccess
            ? `${process.env.FRONTEND_URL}/shared/${publicAccess._id}`
            : null;

        res.status(200).json({
            accessList,
            documentVisibility: document.visibility,
        });

    } catch (error) {

        console.error('Error fetching access list:', error);

        next(error);
    }
};

export default { sendAccessInviation, getSharedDocument, getSharedDocumentTextBlocks, enableFileEditing, getSharedFileList, getDocumentAccessList };
