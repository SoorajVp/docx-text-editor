import mongoose from 'mongoose';

// Define the schema for the User model
const auditLogSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },
        doc_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },
        source_text: {
            type: String,
            required: true,
        },
        updated_text: {
            type: String,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const DocumentAuditLog = mongoose.model('DocumentAuditLog', auditLogSchema);

export default DocumentAuditLog;
