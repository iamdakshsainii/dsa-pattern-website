require('dotenv').config();
const { MongoClient } = require("mongodb");
const seedData = require('./seedData.json');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "dsa_patterns";

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);

    // Clear existing collections
    await db.collection("patterns").deleteMany({});
    await db.collection("questions").deleteMany({});
    await db.collection("users").deleteMany({});
    console.log("🧹 Cleared existing data");

    // Insert patterns
    const patternResult = await db.collection("patterns").insertMany(seedData.patterns);
    console.log(`📁 Inserted ${patternResult.insertedCount} patterns`);

    // Insert questions
    const questionResult = await db.collection("questions").insertMany(seedData.questions);
    console.log(`❓ Inserted ${questionResult.insertedCount} questions`);

    // 🔥 FIX: Update questionCount for each pattern based on actual questions
    console.log("\n🔄 Updating question counts...");
    for (const pattern of seedData.patterns) {
      const count = await db.collection("questions").countDocuments({
        pattern_id: pattern.slug
      });

      await db.collection("patterns").updateOne(
        { slug: pattern.slug },
        { $set: { questionCount: count } }
      );

      console.log(`   ${pattern.name}: ${count} questions`);
    }

    // Create test user
    await db.collection("users").insertOne({
      name: "Test User",
      email: "test@example.com",
      password: "test123",
      created_at: new Date(),
    });
    console.log("\n👤 Created test user (test@example.com / test123)");

    // Create indexes
    await db.collection("patterns").createIndex({ slug: 1 }, { unique: true });
    await db.collection("questions").createIndex({ pattern_id: 1 });
    await db.collection("questions").createIndex({ slug: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("user_progress").createIndex({ user_id: 1, question_id: 1 });
    await db.collection("bookmarks").createIndex({ user_id: 1, question_id: 1 });
    await db.collection("notes").createIndex({ user_id: 1, question_id: 1 });
    console.log("🔍 Created indexes");

    console.log("\n🎉 Database seeded successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Patterns: ${patternResult.insertedCount}`);
    console.log(`   Questions: ${questionResult.insertedCount}`);
    console.log(`   Test User: test@example.com / test123`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
