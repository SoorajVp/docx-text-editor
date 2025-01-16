import express from  "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()

import { GetDocumentTexts, UpdateDocument } from "./controllers/controller.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.send("Document editor server ")
})

app.get("/api/get-text-blocks", GetDocumentTexts)
app.post("/api/update-document", UpdateDocument)

app.get("*", ( req, res) => {
    res.status(404).json({ 
        message: "Invalid server path" , 
        status : 404
    })
})

app.listen(port,() => {
    console.log(`Server running on port: ${port}`)
})