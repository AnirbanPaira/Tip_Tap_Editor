import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
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
    // Add ACL if your bucket doesn't have public read policy
    // ACL: 'public-read',
    
    // Optional: Add metadata
    Metadata: {
      'uploaded-at': new Date().toISOString(),
      'upload-source': 'tiptap-editor'
    }
  });
  
  return getSignedUrl(s3Client, command, { 
    expiresIn: 3600, // URL expires in 1 hour
    // Specify which headers the client must include
    signableHeaders: new Set(['content-type'])
  });
}

export async function POST(request) {
  try {
    const { filename, contentType } = await request.json();

    // Enhanced validation
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    // Validate content type is an image or video
    if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
      return NextResponse.json(
        { error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    // Sanitize filename - remove special characters and ensure uniqueness
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_'); // Replace multiple underscores with single

    // Validate required environment variables
    const requiredEnvVars = {
      S3_REGION: process.env.S3_REGION,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return NextResponse.json(
        { error: `S3 configuration missing: ${missingVars.join(', ')}` },
        { status: 500 }
      );
    }

    console.log('Generating pre-signed URL for:', {
      bucket: process.env.S3_BUCKET_NAME,
      key: sanitizedFilename,
      contentType,
      region: process.env.S3_REGION
    });

    const signedUrl = await createPresignedUrlWithClient({
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET_NAME,
      key: sanitizedFilename,
      contentType: contentType,
    });

    console.log('Pre-signed URL generated successfully');

    return NextResponse.json({ 
      url: signedUrl,
      key: sanitizedFilename,
      bucket: process.env.S3_BUCKET_NAME
    });

  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    
    // More specific error handling
    if (error.name === 'CredentialsError') {
      return NextResponse.json(
        { error: "Invalid AWS credentials" },
        { status: 500 }
      );
    }
    
    if (error.name === 'ConfigError') {
      return NextResponse.json(
        { error: "AWS configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to generate pre-signed URL", 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
