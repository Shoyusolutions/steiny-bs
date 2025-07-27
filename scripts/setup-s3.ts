import { createPublicBucket, uploadToS3 } from "../lib/s3";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function setupS3() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME not found in environment variables");
    return;
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("AWS credentials not found in environment variables");
    console.log("Please add your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to .env.local");
    return;
  }

  console.log(`Setting up S3 bucket: ${bucketName}`);
  console.log(`AWS Region: ${process.env.AWS_REGION}`);
  console.log(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 10)}...`);
  
  // Create the bucket
  const success = await createPublicBucket(bucketName);
  
  if (success) {
    console.log("S3 bucket created successfully!");
    console.log(`Bucket URL: https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com`);
    
    // Create folder structure
    console.log("\nCreating folder structure...");
    
    // Upload placeholder files to create folders
    const folders = ["images/burgers/", "images/chicken/", "images/sides/", "images/drinks/", "videos/"];
    
    for (const folder of folders) {
      try {
        await uploadToS3(
          "",
          `${folder}.keep`,
          "text/plain",
          bucketName
        );
        console.log(`Created folder: ${folder}`);
      } catch (error) {
        console.error(`Error creating folder ${folder}:`, error);
      }
    }
    
    console.log("\nS3 setup complete!");
    console.log("\nYou can now upload images and videos to these folders:");
    console.log("- images/burgers/");
    console.log("- images/chicken/");
    console.log("- images/sides/");
    console.log("- images/drinks/");
    console.log("- videos/");
  }
}

// Run the setup
setupS3().catch(console.error);