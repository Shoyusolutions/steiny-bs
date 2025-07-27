import { S3Client, PutObjectCommand, CreateBucketCommand, PutBucketPolicyCommand, PutPublicAccessBlockCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 Client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Create S3 bucket with public access for images/videos
export async function createPublicBucket(bucketName: string) {
  try {
    // Create bucket
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      })
    );

    // Disable block public access
    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      })
    );

    // Set bucket policy for public read access
    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    );

    console.log(`Bucket ${bucketName} created successfully with public access`);
    return true;
  } catch (error) {
    console.error("Error creating bucket:", error);
    return false;
  }
}

// Upload file to S3
export async function uploadToS3(
  file: Buffer | Uint8Array | string,
  fileName: string,
  contentType: string,
  bucketName: string = process.env.AWS_S3_BUCKET_NAME!
) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    // Return public URL
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Get signed URL for private uploads (optional)
export async function getSignedUploadUrl(
  fileName: string,
  contentType: string,
  bucketName: string = process.env.AWS_S3_BUCKET_NAME!
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}