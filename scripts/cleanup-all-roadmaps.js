import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority";

async function cleanupProgress() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    // console.log(" Connected to MongoDB");

    const db = client.db("dsa_patterns");

    // console.log("🔍 Checking current progress documents...");
    // const count = await db.collection("roadmap_progress").countDocuments();
    // console.log(`📊 Found ${count} progress documents`);

    if (count === 0) {
    //   console.log("✨ No progress documents to delete!");
      return;
    }

    const result = await db.collection("roadmap_progress").deleteMany({});
    // console.log(`🗑️ Deleted ${result.deletedCount} progress documents`);
    // console.log("✅ Cleanup complete!");

  } catch (error) {
    // console.error("❌ Cleanup error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

cleanupProgress();
