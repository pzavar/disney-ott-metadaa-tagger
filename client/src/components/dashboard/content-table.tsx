import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TagBadge from "@/components/tags/tag-badge";
import { Content } from "@shared/schema";
import ContentDetailModal from "./content-detail-modal";
import { FixedSizeList as List } from "react-window";

interface ContentTableProps {
  content: Content[];
  isLoading: boolean;
}

const ContentTable: React.FC<ContentTableProps> = ({ content, isLoading }) => {
  const [contentType, setContentType] = useState("all");
  const [tagType, setTagType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (item: Content) => {
    setSelectedContent(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Filter content based on selected filters
  const filteredContent = content;
  const paginatedContent = filteredContent.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  // Create a ref to measure the container width for virtualized list
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listWidth, setListWidth] = useState(0);
  
  // Update width on mount and window resize
  useEffect(() => {
    const updateWidth = () => {
      if (listContainerRef.current) {
        setListWidth(listContainerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Row renderer for virtualized list
  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filteredContent[index];
    if (!item) return null;
    
    return (
      <div style={style} key={item.id} className="border-b border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-12 overflow-hidden rounded-md bg-gray-200">
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  {item.type.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-[#0063e5]">{item.title}</div>
                <div className="text-xs text-gray-500">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.releaseYear}
                  {item.type === "series" && " • 1 Season"}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags?.brand?.slice(0, 1).map((tag, idx) => (
                    <TagBadge key={`brand-${idx}`} tag={tag} type="brand" />
                  ))}
                  {item.tags?.availability?.slice(0, 1).map((tag, idx) => (
                    <TagBadge key={`avail-${idx}`} tag={tag} type="availability" />
                  ))}
                  {item.tags?.category?.slice(0, 1).map((tag, idx) => (
                    <TagBadge key={`cat-${idx}`} tag={tag} type="category" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500 mb-1">
                Auto-tagged • {item.confidenceScore}% confidence
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]"
                  onClick={() => handleViewDetails(item)}
                >
                  Edit Tags
                </Button>
                <Button
                  size="sm"
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-[#0063e5] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]"
                  onClick={() => handleViewDetails(item)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2 sm:mb-0">Recent Content</h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Content" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="series">Series</SelectItem>
              <SelectItem value="short">Shorts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tagType} onValueChange={setTagType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="brand">Brand Tags</SelectItem>
              <SelectItem value="availability">Availability Tags</SelectItem>
              <SelectItem value="category">Category Tags</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md" ref={listContainerRef}>
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0063e5]"></div>
          </div>
        ) : content.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No content available</p>
          </div>
        ) : (
          <List
            height={Math.min(500, filteredContent.length * 100)} // Limit max height
            width={listWidth || 300}
            itemCount={filteredContent.length}
            itemSize={100} // Approximate height of each row
          >
            {renderRow}
          </List>
        )}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </Button>
            <Button
              variant="outline" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredContent.length)}
                </span>{" "}
                of <span className="font-medium">{filteredContent.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, idx) => (
                  <Button
                    key={idx}
                    variant={currentPage === idx + 1 ? "default" : "outline"}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === idx + 1
                        ? "z-10 bg-[#0063e5] border-[#0063e5] text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Button>
                ))}
                {totalPages > 3 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
                {totalPages > 3 && (
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === totalPages
                        ? "z-10 bg-[#0063e5] border-[#0063e5] text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedContent && (
        <ContentDetailModal 
          content={selectedContent} 
          open={showModal} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default ContentTable;
