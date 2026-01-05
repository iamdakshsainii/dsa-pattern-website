'use client'

export default function NodeConnectorLine({ status, nextStatus }) {
  const getLineStyle = () => {
    if (status === "completed" && nextStatus === "completed") {
      return "bg-green-500"
    }
    if (status === "completed" || status === "in-progress") {
      return "bg-primary animate-dash-flow"
    }
    return "bg-gray-300 dark:bg-gray-700 opacity-50"
  }

  return (
    <div className="absolute left-8 top-16 w-1 h-6 -translate-x-1/2 z-0">
      <div className={`w-full h-full ${getLineStyle()}`} />
    </div>
  )
}
