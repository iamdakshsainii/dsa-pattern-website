"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function StationWrapper({
  title,
  icon: Icon,
  lineColor = "bg-blue-500",
  children,
  compact,
  defaultOpen = false,
  badge = null,
  preview = null,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="relative">
      {/* Metro Line */}
      <div
        className={`absolute left-4 top-0 bottom-0 w-1 ${lineColor} opacity-20 rounded-full`}
      />

      {/* Station Card */}
      <Card
        className={`relative mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 ${
          isOpen ? lineColor.replace('bg-', 'border-l-') : 'border-l-transparent'
        }`}
      >
        {/* Station Header */}
        <div
          className="p-4 cursor-pointer flex items-center justify-between group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-lg ${lineColor} bg-opacity-10`}>
              <Icon className={`h-5 w-5 ${lineColor.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {title}
                {badge && <span className="ml-2">{badge}</span>}
              </h3>
              {!isOpen && preview && (
                <p className="text-sm text-muted-foreground mt-1">{preview}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </div>
        </div>

        {/* Station Content */}
        {isOpen && (
          <div className="px-4 pb-4 border-t animate-in slide-in-from-top-2 duration-300">
            <div className="pt-4">{children}</div>
          </div>
        )}

        {/* Compact Preview (when collapsed) */}
        {!isOpen && compact && (
          <div className="px-4 pb-4 border-t bg-muted/30">
            <div className="pt-3">{compact}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
