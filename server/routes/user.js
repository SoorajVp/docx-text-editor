import express from "express";
import controller from "../controllers/user.js"
import { verifyUser } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get('/get-info', verifyUser, controller.GetUserDetails)

router.post('/update', verifyUser, upload.single("picture"), controller.UpdateUser)

export default router;