import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import ContentTable from "@/components/dashboard/content-table";
import { Content } from "@shared/schema";

const ContentLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  // Filter content based on search query and content type
  const filteredContent = content
    ? content.filter((item) => {
        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.brand.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          item.tags.category.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesType =
          contentType === "all" || item.type === contentType;

        return matchesSearch && matchesType;
      })
    : [];

  return (
    <>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-['Source_Sans_Pro']">
                Content Library
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all Disney+ content and their associated tags
              </p>
            </div>
            <div className="flex space-x-3">
              <Button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0063e5] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]">
                Add New Content
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search by title, tag, or genre"
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                  <SelectItem value="short">Shorts</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="hidden sm:flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced filters - hidden by default */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setFilterOpen(false)}>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Close Filters
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Release Year
                  </label>
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="From" className="w-full" />
                    <Input type="number" placeholder="To" className="w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="disney">Disney</SelectItem>
                      <SelectItem value="marvel">Marvel</SelectItem>
                      <SelectItem value="star-wars">Star Wars</SelectItem>
                      <SelectItem value="pixar">Pixar</SelectItem>
                      <SelectItem value="national-geographic">
                        National Geographic
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new-arrival">New Arrival</SelectItem>
                      <SelectItem value="leaving-soon">Leaving Soon</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Reset Filters
                </Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="tagged">Tagged</TabsTrigger>
            <TabsTrigger value="untagged">Untagged</TabsTrigger>
            <TabsTrigger value="review">Needs Review</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {viewMode === "list" ? (
              <ContentTable
                content={filteredContent || []}
                isLoading={isLoading}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  <div className="col-span-full flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0063e5]"></div>
                  </div>
                ) : filteredContent.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No content found</p>
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="aspect-[2/3] bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                        {item.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-[#0063e5]">{item.title}</h3>
                        <p className="text-xs text-gray-500">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.releaseYear}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.brand[0] && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {item.tags.brand[0]}
                            </span>
                          )}
                          {item.tags.category[0] && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              {item.tags.category[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="tagged">
            <div className="text-center py-10">
              <p className="text-gray-500">Tagged content will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="untagged">
            <div className="text-center py-10">
              <p className="text-gray-500">Untagged content will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="review">
            <div className="text-center py-10">
              <p className="text-gray-500">Content needing review will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ContentLibrary;
