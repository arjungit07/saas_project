'use server';

import { getDbConnection } from "@/lib/db";
import { formatFileNameAsTitle } from "@/lib/format-file";
import { generateSummaryFromGemini } from "@/lib/gemini-ai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/open-ai";
import { auth } from "@clerk/nextjs/server";
import { success } from "zod";

interface PdfSummaryType {
    userId?: string,
    fileUrl: string,
    summary: string | null,
    title: string,
    fileName: string
}

export async function generatePdfSummary(uploadResponse: any) {
    if (!uploadResponse || !uploadResponse[0]) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        };
    }

    const {
        name: fileName,
        serverData: {
            userId,
            fileId: pdfUrl
        }
    } = uploadResponse[0];

    if (!pdfUrl) {
        return {
            success: false,
            message: 'File upload failed: Missing file URL',
            data: null,
        };
    }

    let summary

    try {
        console.log("pdfUrl", pdfUrl)
        const pdfText = await fetchAndExtractPdfText(pdfUrl);
        console.log(pdfText)

        try {
            summary = generateSummaryFromOpenAI(pdfText)
            console.log({ summary })
        } catch (error) {
            console.log(error)
            if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
                try {
                    summary = generateSummaryFromGemini(pdfText)
                } catch (error) {
                    console.error("Gemini API failed after OPEN AI quota exceeded")
                    throw new Error("Failed to generate summary with both the API's")
                }
            }
        }
        if (!summary) {
            return {
                success: false,
                message: "Failed to extract PDF",
                data: null,
            };
        }

        const formattedFileName = formatFileNameAsTitle(fileName)

        return {
            success: true,
            message: "Summary Generated Successfully",
            data: {
                title: formattedFileName,
                summary

            }
        }



        // return {
        //     success: true,
        //     message: "PDF extracted successfully",
        //     data: {
        //         userId,
        //         fileName,
        //         pdfUrl,
        //         pdfText
        //     }
        // }
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Failed to extract PDF",
            data: null,
        };
    }
}

export async function savePdfSummary(
    { userId, fileUrl, summary, title, fileName }: PdfSummaryType
) {
    // SQL Inserting pdf summary
    try {
        const sql = await getDbConnection();
        await sql.query(`
        INSERT INTO pdf_summaries (
          user_id,
          original_file_url,
          summary_text,
          title,
          file_name
        ) VALUES (
            ${userId},
            ${fileUrl},
            ${summary},
            ${title},
            ${fileName}
        );
      `);
    } catch (error) {
        console.error('Error saving PDF summary', error);
        throw error;
    }
}

export async function storePdfSummaryAction({ fileUrl, summary, title, fileName }: PdfSummaryType) {
    let savePdfSummary: any

    try {
        const userId = await auth()
        if (!userId) {
            return {
                success: false,
                message: "User not found"
            }
        }
        savePdfSummary = await savePdfSummary({
            userId,
            fileUrl,
            summary,
            title,
            fileName
        })
        if (!savePdfSummary) {
            return {
                success: false,
                message: "Error in saving summary"
            }
        }
        return {
            success: true,
            message: "PDF saved successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error in saving PDF"
        }
    }
}
