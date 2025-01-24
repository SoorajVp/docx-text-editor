import express from "express";
import controller from "../controllers/auth.js"

const router = express.Router();

router.post('/google-login', controller.GoogleLogin)


export default router;