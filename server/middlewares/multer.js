import multer from "multer";

// Configure Multer to store the file in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;