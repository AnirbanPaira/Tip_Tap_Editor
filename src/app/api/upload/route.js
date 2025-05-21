import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
});

async function createPresignedUrlWithClient({
  region,
  bucket,
  key,
  contentType,
}) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
}

export async function POST(request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    const signedUrl = await createPresignedUrlWithClient({
      region: process.env.NEXT_PUBLIC_S3_REGION,
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      key: filename, // Use the provided filename as the S3 object key
      contentType: contentType,
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate pre-signed URL" },
      { status: 500 }
    );
  }
}
