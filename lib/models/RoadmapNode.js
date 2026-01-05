// RoadmapNode Model Schema
export const RoadmapNodeSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nodeId", "roadmapId", "title", "order"],
      properties: {
        nodeId: { bsonType: "string" },
        roadmapId: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        weekNumber: { bsonType: "int" },
        order: { bsonType: "int" },
        estimatedHours: { bsonType: "int" },
        nodeType: {
          bsonType: "string",
          enum: ["topic", "milestone", "project"]
        },
        subtopics: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              subtopicId: { bsonType: "string" },
              title: { bsonType: "string" },
              contentType: { bsonType: "string", enum: ["internal", "external"] },
              externalLink: { bsonType: "string" },
              provider: { bsonType: "string" },
              estimatedMinutes: { bsonType: "int" },
              order: { bsonType: "int" }
            }
          }
        },
        prerequisites: { bsonType: "array", items: { bsonType: "string" } },
        resources: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              resourceId: { bsonType: "string" },
              title: { bsonType: "string" },
              url: { bsonType: "string" },
              type: { bsonType: "string", enum: ["video", "article", "course", "documentation", "practice"] },
              provider: { bsonType: "string" },
              isPremium: { bsonType: "bool" },
              rating: { bsonType: "double" },
              order: { bsonType: "int" }
            }
          }
        },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
}

export function createRoadmapNode({
  nodeId, roadmapId, title, description, weekNumber, order,
  estimatedHours = 2, nodeType = "topic", subtopics = [],
  prerequisites = [], resources = [], tags = []
}) {
  return {
    nodeId, roadmapId, title, description, weekNumber, order,
    estimatedHours, nodeType, subtopics, prerequisites, resources, tags,
    createdAt: new Date(), updatedAt: new Date()
  }
}
