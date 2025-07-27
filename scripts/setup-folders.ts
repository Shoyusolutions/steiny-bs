import { uploadToS3 } from "../lib/s3";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function setupFolders() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME not found in environment variables");
    return;
  }

  console.log(`Setting up folders in bucket: ${bucketName}`);
  
  // Create folder structure for Steiny's
  const folders = [
    "steiny/images/burgers/",
    "steiny/images/chicken/", 
    "steiny/images/sides/",
    "steiny/images/drinks/",
    "steiny/images/hero/",
    "steiny/images/restaurant/",
    "steiny/videos/"
  ];
  
  for (const folder of folders) {
    try {
      await uploadToS3(
        "",
        `${folder}.keep`,
        "text/plain",
        bucketName
      );
      console.log(`✅ Created folder: ${folder}`);
    } catch (error) {
      console.error(`❌ Error creating folder ${folder}:`, error);
    }
  }
  
  console.log("\n🎉 Folder setup complete!");
  console.log("\nYou can now upload images to:");
  folders.forEach(folder => {
    console.log(`  - ${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/${folder}`);
  });
}

// Run the setup
setupFolders().catch(console.error);