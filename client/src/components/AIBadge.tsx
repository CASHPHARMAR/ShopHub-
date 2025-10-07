import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIBadgeProps {
  className?: string;
  size?: "sm" | "default";
}

export function AIBadge({ className = "", size = "sm" }: AIBadgeProps) {
  return (
    <Badge 
      className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 ${className}`}
      data-testid="badge-ai"
    >
      <Sparkles className={size === "sm" ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1"} />
      AI
    </Badge>
  );
}
