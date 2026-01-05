// Resource Model Schema
export const ResourceSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["resourceId", "title", "url", "type"],
      properties: {
        resourceId: { bsonType: "string" },
        title: { bsonType: "string" },
        url: { bsonType: "string" },
        type: { bsonType: "string", enum: ["video", "article", "course", "documentation", "practice", "book"] },
        provider: { bsonType: "string" },
        author: { bsonType: "string" },
        description: { bsonType: "string" },
        duration: { bsonType: "int" },
        difficulty: { bsonType: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
        isPremium: { bsonType: "bool" },
        language: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        ratings: {
          bsonType: "object",
          properties: {
            avgScore: { bsonType: "double", minimum: 0, maximum: 5 },
            totalRatings: { bsonType: "int" },
            distribution: {
              bsonType: "object",
              properties: {
                five: { bsonType: "int" },
                four: { bsonType: "int" },
                three: { bsonType: "int" },
                two: { bsonType: "int" },
                one: { bsonType: "int" }
              }
            }
          }
        },
        analytics: {
          bsonType: "object",
          properties: {
            views: { bsonType: "int" },
            clicks: { bsonType: "int" },
            completions: { bsonType: "int" },
            lastChecked: { bsonType: "date" },
            isBroken: { bsonType: "bool" }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
}

export function createResource({
  resourceId, title, url, type, provider, author = "", description = "",
  duration = 0, difficulty = "Beginner", isPremium = false, language = "English", tags = []
}) {
  return {
    resourceId, title, url, type, provider, author, description, duration,
    difficulty, isPremium, language, tags,
    ratings: {
      avgScore: 0, totalRatings: 0,
      distribution: { five: 0, four: 0, three: 0, two: 0, one: 0 }
    },
    analytics: { views: 0, clicks: 0, completions: 0, lastChecked: new Date(), isBroken: false },
    createdAt: new Date(), updatedAt: new Date()
  }
}
