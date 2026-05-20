const {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExportPDFJob,
    ExportPDFTargetFormat,
    ExportPDFParams,
    ExportPDFResult
} = require("@adobe/pdfservices-node-sdk");

const fs = require("fs");

async function convertPdfToDocx(inputPath, outputPath) {
    let readStream;

    try {
        // 🔐 Setup credentials
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        const pdfServices = new PDFServices({ credentials });

        // 📄 Read and upload PDF
        readStream = fs.createReadStream(inputPath);

        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // ⚙️ Set conversion parameters (PDF → DOCX)
        const params = new ExportPDFParams({
            targetFormat: ExportPDFTargetFormat.DOCX
        });

        // 🚀 Create and submit job
        const job = new ExportPDFJob({
            inputAsset,
            params
        });

        const pollingURL = await pdfServices.submit({ job });

        // ⏳ Get result
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFResult
        });

        const resultAsset = pdfServicesResponse.result.asset;

        // 💾 Save DOCX file
        const streamAsset = await pdfServices.getContent({
            asset: resultAsset
        });

        const outputStream = fs.createWriteStream(outputPath);
        streamAsset.readStream.pipe(outputStream);

        console.log("✅ Conversion complete:", outputPath);

    } catch (err) {
        console.error("❌ Error during conversion:", err);
    } finally {
        readStream?.destroy();
    }
}