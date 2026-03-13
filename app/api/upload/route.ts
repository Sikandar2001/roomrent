import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "rooms";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(NextResponse.json({ error: error.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ url: result?.secure_url }));
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
