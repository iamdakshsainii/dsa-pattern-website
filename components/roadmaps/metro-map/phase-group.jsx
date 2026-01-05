'use client'

import MapNodeCircle from "./map-node-circle"
import NodeConnectorLine from "./node-connector-line"

export default function PhaseGroup({
  weekNumber,
  nodes,
  userProgress,
  currentUser,
  expandedNodeId,
  currentNodeId,
  onNodeClick,
  onMarkComplete,
  getNodeStatus,
  isNodeUnlocked,
  isLastPhase,
  roadmapSlug
}) {
  const completedCount = nodes.filter(node =>
    getNodeStatus(node.nodeId) === "completed"
  ).length
  const phaseProgress = (completedCount / nodes.length) * 100

  return (
    <div className="relative">
      {/* Phase Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg">
          {weekNumber}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Week {weekNumber}</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${phaseProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(phaseProgress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Nodes */}
      <div className="relative ml-6">
        {/* Vertical Line */}
        {!isLastPhase && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
        )}

        <div className="space-y-6">
          {nodes.map((node, index) => {
            const status = getNodeStatus(node.nodeId)
            const unlocked = isNodeUnlocked(node)
            const isActive = currentNodeId === node.nodeId
            const isLastNode = index === nodes.length - 1

            return (
              <div key={node.nodeId} className="relative">
                {/* Connector Line to Next Node */}
                {!isLastNode && (
                  <NodeConnectorLine
                    status={status}
                    nextStatus={getNodeStatus(nodes[index + 1].nodeId)}
                  />
                )}

                {/* Node Circle */}
                <MapNodeCircle
                  node={node}
                  status={status}
                  isActive={isActive}
                  isUnlocked={unlocked}
                  onClick={() => unlocked && onNodeClick(node.nodeId)}
                  roadmapSlug={roadmapSlug}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
