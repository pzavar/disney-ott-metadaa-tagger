import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PanelTopOpen, RefreshCw } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import TagDistributionChart from "@/components/dashboard/tag-distribution-chart";
import ContentTable from "@/components/dashboard/content-table";
import { Content } from "@shared/schema";

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: content, isLoading: contentLoading } = useQuery<Content[]>({
    queryKey: ["/api/content/recent"],
  });

  return (
    <>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-['Source_Sans_Pro']">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of the content tagging system and metrics
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]"
                onClick={() => {
                  // Generate a CSV report from the data
                  if (!content || !stats) return;
                  
                  const headers = ['Title', 'Type', 'Release Year', 'Studio', 'Brand Tags', 'Availability', 'Categories', 'Confidence'];
                  const rows = content.map(item => [
                    item.title,
                    item.type,
                    item.releaseYear.toString(),
                    item.studio || '',
                    item.tags.brand.join(', '),
                    item.tags.availability.join(', '),
                    item.tags.category.join(', '),
                    `${item.confidenceScore}%`
                  ]);
                  
                  // Add summary stats at the top
                  rows.unshift(['SUMMARY STATS', '', '', '', '', '', '', '']);
                  rows.unshift(['Total Content', stats.totalContent.toString(), '', '', '', '', '', '']);
                  rows.unshift(['Tagged Content', stats.taggedContent.toString(), '', '', '', '', '', '']);
                  rows.unshift(['Pending Review', stats.pendingReview.toString(), '', '', '', '', '', '']);
                  rows.unshift(['Tagging Accuracy', `${stats.taggingAccuracy}%`, '', '', '', '', '', '']);
                  rows.unshift(['', '', '', '', '', '', '', '']);
                  rows.unshift(['CONTENT DETAILS', '', '', '', '', '', '', '']);
                  
                  // Convert to CSV
                  const csvContent = [
                    headers.join(','),
                    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                  ].join('\n');
                  
                  // Create downloadable link
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `disney-ott-report-${new Date().toISOString().split('T')[0]}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <PanelTopOpen className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Export Report
              </Button>
              <Button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0063e5] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Run Auto-Tagger
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Content"
            value={statsLoading ? "..." : stats?.totalContent || 536}
            change={{ value: "12%", trend: "up" }}
            icon="content"
            color="bg-[#0063e5]"
          />
          <StatCard
            title="Tagged Content"
            value={statsLoading ? "..." : stats?.taggedContent || 498}
            change={{ value: "8%", trend: "up" }}
            icon="tagged"
            color="bg-purple-600"
          />
          <StatCard
            title="Pending Review"
            value={statsLoading ? "..." : stats?.pendingReview || 38}
            change={{ value: "5%", trend: "down" }}
            icon="pending"
            color="bg-yellow-500"
          />
          <StatCard
            title="Tagging Accuracy"
            value={statsLoading ? "..." : `${stats?.taggingAccuracy || 92}%`}
            change={{ value: "2.5%", trend: "up" }}
            icon="accuracy"
            color="bg-green-500"
          />
        </div>

        {/* Tag Distribution Chart */}
        <TagDistributionChart />

        {/* Recent Content Table */}
        <ContentTable
          content={content || []}
          isLoading={contentLoading}
        />
      </div>
    </>
  );
};

export default Dashboard;
