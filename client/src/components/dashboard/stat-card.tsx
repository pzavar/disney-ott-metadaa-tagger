import React from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown,
  Tag,
  CheckCircle,
  Clock,
  BarChart
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  icon: "content" | "tagged" | "pending" | "accuracy";
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "content":
        return <Tag className="h-6 w-6 text-white" />;
      case "tagged":
        return <CheckCircle className="h-6 w-6 text-white" />;
      case "pending":
        return <Clock className="h-6 w-6 text-white" />;
      case "accuracy":
        return <BarChart className="h-6 w-6 text-white" />;
      default:
        return <Tag className="h-6 w-6 text-white" />;
    }
  };

  const getTrendIcon = () => {
    if (change.trend === "up") {
      return (
        <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
      );
    } else if (change.trend === "down") {
      return (
        <TrendingDown className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
      );
    }
    return null;
  };

  const getTrendColor = () => {
    if (change.trend === "up") {
      return "text-green-600";
    } else if (change.trend === "down") {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", color)}>
            {getIcon()}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className={cn("ml-2 flex items-baseline text-sm font-semibold", getTrendColor())}>
                  {getTrendIcon()}
                  <span className="sr-only">
                    {change.trend === "up" ? "Increased by" : "Decreased by"}
                  </span>
                  {change.value}
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
