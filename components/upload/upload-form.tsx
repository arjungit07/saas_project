'use client'

import UploadFormInput from "./upload-form-input";
import { z } from "zod"
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner"
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-action";
import { useRef, useState } from "react";
import { da } from "zod/v4/locales";

// Zod validation schema
const schema = z.object({
    file: z.instanceof(File, { message: "Invalid File" })
        .refine((file) => file.size <= 20 * 1024 * 1024, '📦 File must be less than 20 MB')
        .refine((file) => file.type.startsWith('application/pdf'), "📄 File must be a PDF")
})

export default function UploadForm() {

    const [isLoading, setIsLoading] = useState(false)

    const formRef = useRef<HTMLFormElement>(null)

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

        try {
            setIsLoading(true)

            const formData = new FormData(e.currentTarget);
            const file = formData.get('file') as File;

            // Validate file
            const validateFields = schema.safeParse({ file });

            if (!validateFields.success) {
                const msg = validateFields.error.flatten().fieldErrors.file?.[0]
                    ?? "⚠️ Invalid File";
                toast.error(msg);
                setIsLoading(false)
                return;
            }

            toast.info("🔍 Validating file...");
            console.log("File validated, starting upload...");

            // Start upload
            const resp = await startUpload([file]);

            if (!resp) {
                toast.error("⚠️ Something went wrong while uploading.");
                setIsLoading(false)
                return;
            }
            console.log("-->", resp)
            const result = await generatePdfSummary(resp)

            const { data = null, message = null } = result || {}

            if (data) {
                let storeResult: any
                toast.info("📄 Saving PDF...");
                if (data.summary) {
                    const resolvedSummary = await data.summary;
                    storeResult = await storePdfSummaryAction({
                        summary: resolvedSummary,
                        fileUrl: resp[0].ufsUrl,
                        title: data.title,
                        fileName: file.name
                    });
                }
                formRef.current?.reset()
                toast.info("📄 PDF Saved Successfully!");
            }
        }
        catch (error) {
            setIsLoading(false)
            console.error("Error Occured")
            formRef.current?.reset()
        }

    }
    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
            <UploadFormInput isLoading={isLoading} ref={formRef} onSubmit={handleSubmit} />
        </div>
    );
}