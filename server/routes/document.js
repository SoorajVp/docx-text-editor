import express from "express";
import controller from "../controllers/document.js"

const router = express.Router();

router.get('/get-text-blocks', controller.GetDocumentTexts)

router.post('/update-document', controller.UpdateDocument)


export default router;