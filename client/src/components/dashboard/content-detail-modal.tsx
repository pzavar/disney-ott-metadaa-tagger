import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { formatDate, getConfidenceColor } from "@/lib/utils";
import { Content, Tag } from "@shared/schema";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TagBadge from "@/components/tags/tag-badge";
import TagConfidenceIndicator from "@/components/tags/tag-confidence-indicator";

interface ContentDetailModalProps {
  content: Content;
  open: boolean;
  onClose: () => void;
}

interface TagWithConfidence {
  name: string;
  confidence: number;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ content, open, onClose }) => {
  const [currentTags, setCurrentTags] = useState({
    brand: content.tags.brand.map((tag) => ({ name: tag, confidence: 97 })),
    availability: content.tags.availability.map((tag) => ({ name: tag, confidence: 95 })),
    category: content.tags.category.map((tag) => ({ name: tag, confidence: 90 })),
  });

  const suggestedTags: TagWithConfidence[] = [
    { name: "Western", confidence: 75 },
    { name: "Drama", confidence: 65 },
  ];

  const removeTag = (tagType: keyof typeof currentTags, index: number) => {
    setCurrentTags({
      ...currentTags,
      [tagType]: currentTags[tagType].filter((_, i) => i !== index),
    });
  };

  const addTag = (tag: TagWithConfidence, type: keyof typeof currentTags) => {
    setCurrentTags({
      ...currentTags,
      [type]: [...currentTags[type], tag],
    });
  };
  
  const handleSave = () => {
    // Here we would save the updated tags to the server
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg leading-6 font-medium text-gray-900">
            Content Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex-shrink-0">
            <div className="w-full h-auto rounded-lg shadow-lg bg-gray-200 aspect-[2/3] flex items-center justify-center text-gray-400 text-5xl">
              {content.title.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="md:w-2/3 md:ml-6 mt-4 md:mt-0">
            <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-sm text-gray-500">
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)} • {content.releaseYear}
              {content.type === "series" && " • 1 Season"}
            </p>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600">{content.description}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Content Information</h4>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="col-span-1">
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 text-gray-900">{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-500">Release Year:</span>
                  <span className="ml-2 text-gray-900">{content.releaseYear}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-500">Added Date:</span>
                  <span className="ml-2 text-gray-900">{formatDate(content.addedDate)}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-500">Studio:</span>
                  <span className="ml-2 text-gray-900">{content.studio}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700">Current Tags</h4>
              <div className="mt-2">
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-500 mb-2">Brand Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentTags.brand.map((tag, index) => (
                      <div key={`brand-${index}`} className="group relative">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {tag.name}
                          <button
                            className="ml-1 text-blue-500 hover:text-blue-700"
                            onClick={() => removeTag("brand", index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                        <TagConfidenceIndicator confidence={tag.confidence} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-500 mb-2">Availability Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentTags.availability.map((tag, index) => (
                      <div key={`avail-${index}`} className="group relative">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {tag.name}
                          <button
                            className="ml-1 text-green-500 hover:text-green-700"
                            onClick={() => removeTag("availability", index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                        <TagConfidenceIndicator confidence={tag.confidence} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-medium text-gray-500 mb-2">Category Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentTags.category.map((tag, index) => (
                      <div key={`cat-${index}`} className="group relative">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          {tag.name}
                          <button
                            className="ml-1 text-orange-500 hover:text-orange-700"
                            onClick={() => removeTag("category", index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                        <TagConfidenceIndicator confidence={tag.confidence} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700">Suggested Tags</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedTags.map((tag, index) => (
                  <div key={`suggested-${index}`} className="group relative">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {tag.name}
                      <button
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => addTag(tag, "category")}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </span>
                    <TagConfidenceIndicator confidence={tag.confidence} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0063e5] text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5] sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
