import express from  "express";
import cors from "cors";

import ConnectDatabase from "./config/mongoose.js";
import errorMiddleware from './middlewares/errorMiddleware.js';

import documentRoutes from "./routes/document.js"
import authRoutes from "./routes/auth.js"

import dotenv from "dotenv";
dotenv.config()

const port = process.env.PORT || 3000;
const app = express();

ConnectDatabase()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.send("Document editor server ")
})

app.use("/api/auth", authRoutes)
app.use("/api/document", documentRoutes)

app.get("*", ( req, res) => {
    res.status(404).json({
        message: "Invalid server path" , 
        status : 404
    })
})

// ErrorHandling Middleware
app.use(errorMiddleware)

app.listen(port,() => {
    console.log(`Server running on port: ${port}`)
})