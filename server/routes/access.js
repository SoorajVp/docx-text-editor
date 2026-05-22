import express from "express";
import controller from "../controllers/access.js"
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.post('/send-invite',        verifyUser, controller.sendAccessInviation)
router.get('/shared-document', verifyUser, controller.getSharedDocument)
router.post('/enable-editing',     verifyUser, controller.enableFileEditing)

router.get('/shared-text-blocks', verifyUser, controller.getSharedDocumentTextBlocks)

router.get('/shared-files',  verifyUser, controller.getSharedFileList)
router.get('/document-access', verifyUser, controller.getDocumentAccessList)


export default router;