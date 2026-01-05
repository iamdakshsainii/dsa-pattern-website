export function validateRoadmapJSON(data) {
  const errors = []

  if (!data.roadmapId || typeof data.roadmapId !== 'string') {
    errors.push('Missing or invalid roadmapId')
  }

  if (!Array.isArray(data.nodes)) {
    errors.push('nodes must be an array')
    return { valid: false, errors }
  }

  const nodeIds = new Set()
  const subtopicIds = new Set()

  data.nodes.forEach((node, nodeIndex) => {
    const nodePrefix = `Node ${nodeIndex + 1}`

    if (!node.nodeId || typeof node.nodeId !== 'string') {
      errors.push(`${nodePrefix}: Missing or invalid nodeId`)
    } else if (nodeIds.has(node.nodeId)) {
      errors.push(`${nodePrefix}: Duplicate nodeId "${node.nodeId}"`)
    } else {
      nodeIds.add(node.nodeId)
    }

    if (!node.weekNumber || typeof node.weekNumber !== 'number') {
      errors.push(`${nodePrefix}: Missing or invalid weekNumber`)
    }

    if (!node.title || typeof node.title !== 'string') {
      errors.push(`${nodePrefix}: Missing or invalid title`)
    }

    if (!node.description || typeof node.description !== 'string') {
      errors.push(`${nodePrefix}: Missing or invalid description`)
    }

    if (!node.estimatedHours || typeof node.estimatedHours !== 'number') {
      errors.push(`${nodePrefix}: Missing or invalid estimatedHours`)
    }

    if (!Array.isArray(node.prerequisites)) {
      errors.push(`${nodePrefix}: prerequisites must be an array`)
    }

    if (!Array.isArray(node.subtopics)) {
      errors.push(`${nodePrefix}: subtopics must be an array`)
    } else {
      node.subtopics.forEach((subtopic, subtopicIndex) => {
        const subtopicPrefix = `${nodePrefix} > Subtopic ${subtopicIndex + 1}`

        if (!subtopic.subtopicId || typeof subtopic.subtopicId !== 'string') {
          errors.push(`${subtopicPrefix}: Missing or invalid subtopicId`)
        } else if (subtopicIds.has(subtopic.subtopicId)) {
          errors.push(`${subtopicPrefix}: Duplicate subtopicId "${subtopic.subtopicId}"`)
        } else {
          subtopicIds.add(subtopic.subtopicId)
        }

        if (!subtopic.title || typeof subtopic.title !== 'string') {
          errors.push(`${subtopicPrefix}: Missing or invalid title`)
        }

        if (!subtopic.description || typeof subtopic.description !== 'string') {
          errors.push(`${subtopicPrefix}: Missing or invalid description`)
        }

        if (!subtopic.estimatedMinutes || typeof subtopic.estimatedMinutes !== 'number') {
          errors.push(`${subtopicPrefix}: Missing or invalid estimatedMinutes`)
        }

        if (!subtopic.contentType || !['external', 'internal'].includes(subtopic.contentType)) {
          errors.push(`${subtopicPrefix}: contentType must be "external" or "internal"`)
        }

        if (subtopic.contentType === 'external') {
          if (!subtopic.resourceLinks || typeof subtopic.resourceLinks !== 'object') {
            errors.push(`${subtopicPrefix}: Missing resourceLinks for external content`)
          } else {
            const hasAnyResource =
              subtopic.resourceLinks.youtube ||
              subtopic.resourceLinks.article ||
              subtopic.resourceLinks.practice

            if (!hasAnyResource) {
              errors.push(`${subtopicPrefix}: At least one resource link required`)
            }
          }
        }
      })
    }

    if (node.keyTakeaways && !Array.isArray(node.keyTakeaways)) {
      errors.push(`${nodePrefix}: keyTakeaways must be an array`)
    }
  })

  data.nodes.forEach((node) => {
    node.prerequisites?.forEach((prereqId) => {
      if (!nodeIds.has(prereqId)) {
        errors.push(`Node "${node.nodeId}": Invalid prerequisite "${prereqId}"`)
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      totalNodes: data.nodes.length,
      totalSubtopics: subtopicIds.size,
      uniqueWeeks: new Set(data.nodes.map(n => n.weekNumber)).size
    }
  }
}
