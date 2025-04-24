import React from "react";
import { getTagColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  type: "brand" | "availability" | "category";
  onRemove?: () => void;
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, type, onRemove, className }) => {
  const { bg, text } = getTagColor(type, tag);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        bg,
        text,
        className
      )}
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          className={`ml-1 ${text.replace("text", "hover:text")}`}
          onClick={onRemove}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      )}
    </span>
  );
};

export default TagBadge;
