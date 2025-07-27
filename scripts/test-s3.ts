import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testS3Connection() {
  console.log("Testing S3 connection...");
  console.log(`Region: ${process.env.AWS_REGION}`);
  console.log(`Access Key: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 10)}...`);
  
  try {
    const client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command = new ListBucketsCommand({});
    const response = await client.send(command);
    
    console.log("Successfully connected to AWS S3!");
    console.log("Available buckets:", response.Buckets?.map(b => b.Name).join(", "));
    
    return true;
  } catch (error) {
    console.error("Error connecting to S3:", error);
    return false;
  }
}

testS3Connection();