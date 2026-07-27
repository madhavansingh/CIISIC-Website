import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

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
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "documents";
    const isPublic = process.env.SUPABASE_STORAGE_BUCKET_IS_PUBLIC !== "false"; // default to true

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL or API key is missing. Check your environment variables.");
    }

    const folderId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    // Path structure: challenges/{folderId}/{uuid}-{originalName} for DOCUMENT, or logos/{folderId}/{uuid}-{originalName} for LOGO
    const subFolder = uploadType === "DOCUMENT" ? "challenges" : "logos";
    const filePath = `${subFolder}/${folderId}/${fileId}-${cleanName}`;

    try {
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout for Supabase Storage

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
          "Content-Type": mimeType,
        },
        body: buffer,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 404 || errText.includes("bucket not found") || errText.includes("Bucket not found")) {
          throw new Error(`Supabase bucket '${bucketName}' does not exist. Please create it in the Supabase console.`);
        }
        throw new Error(`Supabase upload failed: ${errText}`);
      }

      // If bucket is public, construct the direct public URL.
      // If private, generate a signed URL (valid for 1 year = 31,536,000 seconds).
      let fileUrl = "";
      if (isPublic) {
        fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
      } else {
        const signUrl = `${supabaseUrl}/storage/v1/object/sign/${bucketName}/${filePath}`;
        const signRes = await fetch(signUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${supabaseKey}`,
            "apikey": supabaseKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiresIn: 31536000 }), // 1 year expiry
        });

        if (!signRes.ok) {
          const signErr = await signRes.text();
          throw new Error(`Failed to generate signed URL for uploaded file: ${signErr}`);
        }

        const signData = await signRes.json() as { signedURL?: string; signedUrl?: string };
        const relativeSignedUrl = signData.signedURL || signData.signedUrl;
        if (!relativeSignedUrl) {
          throw new Error("Supabase sign URL response did not contain signedURL");
        }

        fileUrl = relativeSignedUrl.startsWith("/")
          ? `${supabaseUrl}${relativeSignedUrl}`
          : relativeSignedUrl;
      }

      return {
        url: fileUrl,
        secureName: filePath, // use full path inside the bucket as secureName
        path: filePath,
        bucket: bucketName,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Supabase Storage upload timed out after 15 seconds.");
      }
      throw error;
    }
  }
}

// Current active storage provider configuration
export const storageProvider: StorageProvider = process.env.SUPABASE_URL 
  ? new SupabaseStorageProvider() 
  : new LocalStorageProvider();
