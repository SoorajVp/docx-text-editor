import express from "express";
import controller from "../controllers/document.js"
import { verifyUser } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post('/create', verifyUser, upload.single("document"), controller.CreateDocument)

router.get('/view', verifyUser, controller.GetDocumentById)

router.get('/list', verifyUser, controller.GetDocumentList)

router.post('/change-filename', verifyUser, controller.UpdateFileNameById)

router.get('/text-blocks', verifyUser, controller.GetDocumentTexts)

router.post('/update', verifyUser, controller.UpdateDocument)

router.post('/move-to-bin', verifyUser, controller.SoftDeleteDocument)

router.post('/restore-bin', verifyUser, controller.RestoreDocuments)

router.get('/bin-files', verifyUser, controller.GetDeletedDocumentList)

router.post('/delete', verifyUser, controller.DeleteDocuments)


export default router;