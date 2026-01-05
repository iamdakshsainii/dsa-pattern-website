// Roadmap Model Schema
export const RoadmapSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["slug", "title", "category", "difficulty"],
      properties: {
        slug: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        category: {
          bsonType: "string",
          enum: ["DSA", "Data Science", "Web Development", "Cybersecurity", "Mobile Development", "DevOps", "Machine Learning"]
        },
        difficulty: {
          bsonType: "string",
          enum: ["Beginner", "Intermediate", "Advanced"]
        },
        estimatedWeeks: { bsonType: "int" },
        icon: { bsonType: "string" },
        color: { bsonType: "string" },
        stats: {
          bsonType: "object",
          properties: {
            totalNodes: { bsonType: "int" },
            totalResources: { bsonType: "int" },
            followers: { bsonType: "int" },
            avgRating: { bsonType: "double" }
          }
        },
        prerequisites: { bsonType: "array", items: { bsonType: "string" } },
        outcomes: { bsonType: "array", items: { bsonType: "string" } },
        targetRoles: { bsonType: "array", items: { bsonType: "string" } },
        published: { bsonType: "bool" },
        order: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
}

export function createRoadmap({
  slug, title, description, category, difficulty, estimatedWeeks,
  icon = "🗺️", color = "#3b82f6", prerequisites = [], outcomes = [],
  targetRoles = [], published = true, order = 0
}) {
  return {
    slug, title, description, category, difficulty, estimatedWeeks, icon, color,
    stats: { totalNodes: 0, totalResources: 0, followers: 0, avgRating: 0 },
    prerequisites, outcomes, targetRoles, published, order,
    createdAt: new Date(), updatedAt: new Date()
  }
}
