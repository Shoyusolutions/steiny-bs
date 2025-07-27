import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function deleteAllSteinyFiles() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME not found in environment variables");
    return;
  }

  console.log(`🗑️  Deleting all Steiny's files from bucket: ${bucketName}`);
  
  try {
    // List all objects with "steiny/" prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "steiny/",
    });
    
    const listResponse = await s3Client.send(listCommand);
    
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log("No Steiny files found to delete.");
      return;
    }
    
    console.log(`Found ${listResponse.Contents.length} files to delete:`);
    listResponse.Contents.forEach(obj => {
      console.log(`  - ${obj.Key}`);
    });
    
    // Prepare objects for deletion
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key }));
    
    // Delete objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: objectsToDelete,
      },
    });
    
    const deleteResponse = await s3Client.send(deleteCommand);
    
    console.log(`\n✅ Successfully deleted ${deleteResponse.Deleted?.length || 0} files`);
    
    if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
      console.error("❌ Errors occurred:");
      deleteResponse.Errors.forEach(error => {
        console.error(`  - ${error.Key}: ${error.Message}`);
      });
    }
    
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}

// Add confirmation prompt
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('⚠️  Are you sure you want to delete ALL Steiny files from S3? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes') {
    deleteAllSteinyFiles().then(() => {
      readline.close();
    });
  } else {
    console.log('Deletion cancelled.');
    readline.close();
  }
});