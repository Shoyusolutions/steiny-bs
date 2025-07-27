import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

async function deleteSpecificFile(fileName: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME not found in environment variables");
    return;
  }

  console.log(`🗑️  Deleting file: ${fileName} from bucket: ${bucketName}`);
  
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    
    await s3Client.send(deleteCommand);
    
    console.log(`✅ Successfully deleted: ${fileName}`);
    
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

// Get the file to delete from command line arguments
const fileToDelete = process.argv[2];

if (!fileToDelete) {
  console.error("Please provide a file path to delete");
  console.error("Usage: npm run delete-file <file-path>");
  console.error("Example: npm run delete-file steiny/images/meals/cheese-burger-meal.jpg");
  process.exit(1);
}

deleteSpecificFile(fileToDelete);