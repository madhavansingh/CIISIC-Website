import { vi, describe, it, expect, beforeEach } from "vitest";
import { POST as uploadFile } from "../src/app/api/upload/route";
import { NextRequest } from "next/server";
import { auth } from "../src/lib/auth";

vi.mock("../src/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("../src/lib/storage", () => ({
  storageProvider: {
    uploadFile: vi.fn().mockResolvedValue({
      url: "http://example.com/uploads/doc.pdf",
      secureName: "doc.pdf",
      path: "uploads/doc.pdf",
      bucket: "local",
    }),
  },
}));

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    auditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe("File Upload validations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth as any).mockResolvedValue({
      user: { id: "user-1", role: "STUDENT", email: "student@jlu.edu.in", name: "Student" },
      expires: "",
    });
  });

  it("should reject if no file is provided", async () => {
    const formData = new FormData();
    formData.append("type", "LOGO");

    const req = new NextRequest("http://ciisic.test/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadFile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("No file uploaded");
  });

  it("should reject if upload type is invalid", async () => {
    const file = new File(["dummy logo content"], "logo.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "INVALID");

    const req = new NextRequest("http://ciisic.test/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadFile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toContain("Invalid upload type");
  });

  it("should reject logo files exceeding 2MB size limit", async () => {
    const hugeBlob = new Blob([new Uint8Array(2.5 * 1024 * 1024)]); // 2.5MB
    const file = new File([hugeBlob], "big-logo.png", { type: "image/png" });
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "LOGO");

    const req = new NextRequest("http://ciisic.test/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadFile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toContain("exceeds the 2MB limit");
  });

  it("should reject document files exceeding 10MB size limit", async () => {
    const hugeBlob = new Blob([new Uint8Array(11 * 1024 * 1024)]); // 11MB
    const file = new File([hugeBlob], "big-doc.pdf", { type: "application/pdf" });
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "DOCUMENT");

    const req = new NextRequest("http://ciisic.test/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadFile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toContain("exceeds the 10MB limit");
  });

  it("should reject invalid mime types for logo", async () => {
    const file = new File(["plain text content"], "text.txt", { type: "text/plain" });
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "LOGO");

    const req = new NextRequest("http://ciisic.test/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadFile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toContain("Invalid logo format");
  });

  it("should accept valid document file", async () => {
    const file = new File(["valid pdf content"], "doc.pdf", { type: "application/pdf" });
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "DOCUMENT");

    const req = new NextRequest("http://ciisic.test/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadFile(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.url).toBe("http://example.com/uploads/doc.pdf");
    expect(json.data.path).toBe("uploads/doc.pdf");
    expect(json.data.bucket).toBe("local");
  });
});
