'use client'

import UploadFormInput from "./upload-form-input";
import { z } from "zod"
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner"
import { generatePdfSummary } from "@/actions/upload-action";

// Zod validation schema
const schema = z.object({
    file: z.instanceof(File, { message: "Invalid File" })
        .refine((file) => file.size <= 20 * 1024 * 1024, '📦 File must be less than 20 MB')
        .refine((file) => file.type.startsWith('application/pdf'), "📄 File must be a PDF")
})

export default function UploadForm() {

    const { startUpload } = useUploadThing("pdfUploader", {
        onClientUploadComplete: () => {
            toast.success("🎉 File uploaded successfully!");
            console.log("uploaded successfully!");
        },
        onUploadError: (err) => {
            console.error("error occurred while uploading", err);
            toast.error(`❌ Upload failed: ${err.message || "Unknown error"}`);
        },
        onUploadBegin: ({ file }) => {
            toast.info(`⬆️ Uploading: ${file}`);
            console.log("upload has begun for", file);
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get('file') as File;

        // Validate file
        const validateFields = schema.safeParse({ file });

        if (!validateFields.success) {
            const msg = validateFields.error.flatten().fieldErrors.file?.[0]
                ?? "⚠️ Invalid File";
            toast.error(msg);
            return;
        }

        toast.info("🔍 Validating file...");
        console.log("File validated, starting upload...");

        // Start upload
        const resp = await startUpload([file]);

        if (!resp) {
            toast.error("⚠️ Something went wrong while uploading.");
            return;
        }

        const summary = await generatePdfSummary(resp)
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
            <UploadFormInput onSubmit={handleSubmit} />
        </div>
    );
}
