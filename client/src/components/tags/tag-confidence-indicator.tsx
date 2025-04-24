import React from "react";
import { getConfidenceColor } from "@/lib/utils";

interface TagConfidenceIndicatorProps {
  confidence: number;
}

const TagConfidenceIndicator: React.FC<TagConfidenceIndicatorProps> = ({ confidence }) => {
  const colorClass = getConfidenceColor(confidence);

  return (
    <div className="w-full h-1 mt-1 rounded-full overflow-hidden bg-gray-200">
      <div
        className={`${colorClass} h-full rounded-full`}
        style={{ width: `${confidence}%` }}
      ></div>
    </div>
  );
};

export default TagConfidenceIndicator;
