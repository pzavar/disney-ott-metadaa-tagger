import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const getBrandColor = (brand: string): { bg: string; text: string } => {
  switch (brand.toLowerCase()) {
    case "disney":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "marvel":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "star wars":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "pixar":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "national geographic":
      return { bg: "bg-green-100", text: "text-green-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

export const getAvailabilityColor = (availability: string): { bg: string; text: string } => {
  switch (availability.toLowerCase()) {
    case "new arrival":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "leaving soon":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "exclusive":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    default:
      return { bg: "bg-purple-100", text: "text-purple-800" };
  }
};

export const getCategoryColor = (category: string): { bg: string; text: string } => {
  switch (category.toLowerCase()) {
    case "family":
      return { bg: "bg-indigo-100", text: "text-indigo-800" };
    case "action":
      return { bg: "bg-orange-100", text: "text-orange-800" };
    case "documentary":
      return { bg: "bg-teal-100", text: "text-teal-800" };
    case "animation":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "sci-fi":
      return { bg: "bg-purple-100", text: "text-purple-800" };
    case "drama":
      return { bg: "bg-pink-100", text: "text-pink-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return "bg-green-500";
  if (confidence >= 80) return "bg-yellow-500";
  return "bg-red-500";
};

export const getTagColor = (tagType: string, tag: string): { bg: string; text: string } => {
  switch (tagType) {
    case "brand":
      return getBrandColor(tag);
    case "availability":
      return getAvailabilityColor(tag);
    case "category":
      return getCategoryColor(tag);
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};
