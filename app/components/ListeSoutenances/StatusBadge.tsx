import type React from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, AlertCircle, CalendarClock } from "lucide-react"

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (
    status: string,
  ): {
    color: string
    bg: string
    hoverBg: string
    icon: React.ReactNode
    text: string
  } => {
    switch (status) {
      case "Scheduled":
        return {
          color: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-100 dark:bg-blue-900/50",
          hoverBg: "hover:bg-blue-200 dark:hover:bg-blue-900/70",
          icon: <CalendarClock className="w-3.5 h-3.5" />,
          text: "Scheduled",
        }
      case "Completed":
        return {
          color: "text-green-700 dark:text-green-300",
          bg: "bg-green-100 dark:bg-green-900/50",
          hoverBg: "hover:bg-green-200 dark:hover:bg-green-900/70",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          text: "Completed",
        }
      case "Pending":
        return {
          color: "text-yellow-700 dark:text-yellow-300",
          bg: "bg-yellow-100 dark:bg-yellow-900/50",
          hoverBg: "hover:bg-yellow-200 dark:hover:bg-yellow-900/70",
          icon: <Clock className="w-3.5 h-3.5" />,
          text: "Pending",
        }
      case "Cancelled":
        return {
          color: "text-red-700 dark:text-red-300",
          bg: "bg-red-100 dark:bg-red-900/50",
          hoverBg: "hover:bg-red-200 dark:hover:bg-red-900/70",
          icon: <XCircle className="w-3.5 h-3.5" />,
          text: "Cancelled",
        }
      default:
        return {
          color: "text-gray-700 dark:text-gray-300",
          bg: "bg-gray-100 dark:bg-gray-800",
          hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-800/70",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          text: "Unknown",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge
      variant="outline"
      className={`
        ${config.bg} 
        ${config.color} 
        ${config.hoverBg}
        border-0 
        font-medium 
        gap-1.5
        px-2.5 
        py-0.5 
        transition-colors
        duration-200
        inline-flex
        items-center
        cursor-default
        select-none
        shadow-sm
      `}
    >
      {config.icon}
      {config.text}
    </Badge>
  )
}

export default StatusBadge

