// RoadmapProgress Model Schema
export const RoadmapProgressSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "roadmapId"],
      properties: {
        userId: { bsonType: "string" },
        roadmapId: { bsonType: "string" },
        startedAt: { bsonType: "date" },
        lastAccessedAt: { bsonType: "date" },
        overallProgress: { bsonType: "double", minimum: 0, maximum: 100 },
        currentNodeId: { bsonType: "string" },
        nodesProgress: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              nodeId: { bsonType: "string" },
              status: { bsonType: "string", enum: ["locked", "unlocked", "in-progress", "completed"] },
              completedSubtopics: { bsonType: "array", items: { bsonType: "string" } },
              timeSpentMinutes: { bsonType: "int" },
              startedAt: { bsonType: "date" },
              completedAt: { bsonType: "date" }
            }
          }
        },
        streaks: {
          bsonType: "object",
          properties: {
            current: { bsonType: "int" },
            longest: { bsonType: "int" },
            lastActivityDate: { bsonType: "date" }
          }
        },
        completedAt: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
}

export function createRoadmapProgress(userId, roadmapId) {
  return {
    userId, roadmapId,
    startedAt: new Date(),
    lastAccessedAt: new Date(),
    overallProgress: 0,
    currentNodeId: null,
    nodesProgress: [],
    streaks: { current: 0, longest: 0, lastActivityDate: null },
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function updateNodeProgress(nodeId, status, completedSubtopics = []) {
  return {
    nodeId, status, completedSubtopics, timeSpentMinutes: 0,
    startedAt: status === "in-progress" ? new Date() : null,
    completedAt: status === "completed" ? new Date() : null
  }
}
