import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    await writeFile(path.join(uploadDir, filename), buffer);
    
    // Return absolute URL or relative URL. Emails need absolute URLs.
    const host = req.headers.get("host") || "terrifictravel.co.uk";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
