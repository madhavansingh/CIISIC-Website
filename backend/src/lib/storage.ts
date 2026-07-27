import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export interface UploadResult {
  url: string;
  secureName: string;
  path: string;
  bucket: string;
}

export interface StorageProvider {
  uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult>;
}

export class LocalStorageProvider implements StorageProvider {
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult> {
    const fileExt = mimeType === "application/pdf"
      ? "pdf"
      : mimeType === "application/msword"
      ? "doc"
      : mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
      ? "webp"
      : "docx"; // default fallback for ALLOWED_DOC_TYPES

    const secureName = `${crypto.randomUUID()}.${fileExt}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, secureName);
    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${secureName}`,
      secureName,
      path: `uploads/${secureName}`,
      bucket: "local",
    };
  }
}

export class SupabaseStorageProvider implements StorageProvider {
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY;
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "documents";
    const isPublic = process.env.SUPABASE_STORAGE_BUCKET_IS_PUBLIC !== "false";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL or API key is missing. Check your environment variables.");
    }

    // Preserve max file size validation: max 2MB for LOGO, max 10MB for DOCUMENT
    const maxSize = uploadType === "LOGO" ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new Error(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB`);
    }

    // Instantiate official Supabase server-side client
    const supabase = createClient(supabaseUrl, supabaseKey);

    const folderId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    // Path structure: challenges/{folderId}/{uuid}-{originalName} for DOCUMENT, or logos/{folderId}/{uuid}-{originalName} for LOGO
    const subFolder = uploadType === "DOCUMENT" ? "challenges" : "logos";
    const filePath = `${subFolder}/${folderId}/${fileId}-${cleanName}`;

    // Upload using Supabase JS Storage SDK
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: mimeType,
        duplex: "half",
      });

    if (uploadError) {
      if (uploadError.message.includes("bucket not found") || uploadError.message.includes("Bucket not found")) {
        throw new Error(`Supabase bucket '${bucketName}' does not exist. Please create it in the Supabase console.`);
      }
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    // Preserve returned public URL or Signed URL
    let fileUrl = "";
    if (isPublic) {
      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      fileUrl = publicData.publicUrl;
    } else {
      // Generate a signed URL valid for 1 year (31,536,000 seconds)
      const { data: signedData, error: signError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 31536000);

      if (signError) {
        throw new Error(`Failed to generate signed URL for uploaded file: ${signError.message}`);
      }
      fileUrl = signedData.signedUrl;
    }

    return {
      url: fileUrl,
      secureName: filePath,
      path: filePath,
      bucket: bucketName,
    };
  }
}

// Current active storage provider configuration
export const storageProvider: StorageProvider = process.env.SUPABASE_URL 
  ? new SupabaseStorageProvider() 
  : new LocalStorageProvider();
