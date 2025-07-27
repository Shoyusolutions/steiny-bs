import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
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

async function listSteinyFiles() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME not found in environment variables");
    return;
  }

  console.log(`📂 Listing all Steiny's files in bucket: ${bucketName}\n`);
  
  try {
    // List all objects with "steiny/" prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "steiny/",
    });
    
    const listResponse = await s3Client.send(listCommand);
    
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log("No Steiny files found in S3.");
      return;
    }
    
    console.log(`Found ${listResponse.Contents.length} files:\n`);
    
    // Group files by extension
    const jpgFiles: string[] = [];
    const pngFiles: string[] = [];
    const otherFiles: string[] = [];
    
    listResponse.Contents.forEach(obj => {
      const key = obj.Key || "";
      if (key.endsWith('.jpg') || key.endsWith('.jpeg')) {
        jpgFiles.push(key);
      } else if (key.endsWith('.png')) {
        pngFiles.push(key);
      } else {
        otherFiles.push(key);
      }
    });
    
    if (pngFiles.length > 0) {
      console.log(`✅ PNG Files (${pngFiles.length}):`);
      pngFiles.forEach(file => console.log(`   - ${file}`));
      console.log();
    }
    
    if (jpgFiles.length > 0) {
      console.log(`⚠️  JPG Files (${jpgFiles.length}) - These might need to be re-uploaded as PNG:`);
      jpgFiles.forEach(file => console.log(`   - ${file}`));
      console.log();
    }
    
    if (otherFiles.length > 0) {
      console.log(`📄 Other Files (${otherFiles.length}):`);
      otherFiles.forEach(file => console.log(`   - ${file}`));
    }
    
    // Check which expected files are missing
    console.log("\n📊 Upload Status Check:");
    const expectedFiles = [
      // Hero
      "steiny/images/hero/hero-burger.png",
      "steiny/images/hero/hero-bg.png",
      // Burgers
      "steiny/images/burgers/cheese-burger.png",
      "steiny/images/burgers/double-cheese-burger.png",
      "steiny/images/burgers/jalapeno-cheese-burger.png",
      // Chicken
      "steiny/images/chicken/nashville-hot.png",
      "steiny/images/chicken/buffalo-ranch.png",
      "steiny/images/chicken/sweet-chili.png",
      // Sides
      "steiny/images/sides/fries.png",
      "steiny/images/sides/loaded-beef-fries.png",
      "steiny/images/sides/loaded-chicken-fries.png",
      "steiny/images/sides/hot-tenders.png",
      "steiny/images/sides/buttermilk-biscuit.png",
      // Drinks
      "steiny/images/drinks/soft-drinks.png",
      "steiny/images/drinks/vanilla-shake.png",
      "steiny/images/drinks/nutella-shake.png",
      "steiny/images/drinks/strawberry-shake.png",
      "steiny/images/drinks/oreo-shake.png",
      // Meals
      "steiny/images/meals/cheese-burger-meal.png",
      "steiny/images/meals/double-cheese-burger-meal.png",
      "steiny/images/meals/jalapeno-burger-meal.png",
      "steiny/images/meals/nashville-hot-meal.png",
      "steiny/images/meals/buffalo-ranch-meal.png",
      "steiny/images/meals/sweet-chili-meal.png",
      "steiny/images/meals/loaded-fries-combo.png",
      "steiny/images/meals/tenders-meal.png",
      // Restaurant
      "steiny/images/restaurant/interior.png",
      "steiny/images/restaurant/exterior.png",
      "steiny/images/restaurant/kitchen.png",
    ];
    
    const uploadedFiles = new Set(listResponse.Contents.map(obj => obj.Key));
    const missingFiles = expectedFiles.filter(file => !uploadedFiles.has(file));
    
    console.log(`\n✅ Uploaded: ${uploadedFiles.size} files`);
    console.log(`❌ Missing: ${missingFiles.length} files`);
    
    if (missingFiles.length > 0 && missingFiles.length <= 10) {
      console.log("\nMissing files:");
      missingFiles.forEach(file => console.log(`   - ${file}`));
    }
    
  } catch (error) {
    console.error("Error listing files:", error);
  }
}

// Run the listing
listSteinyFiles();