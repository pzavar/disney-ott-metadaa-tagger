import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Filter, Upload, Play, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const BatchProcessing: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingResults, setProcessingResults] = useState<{
    totalProcessed: number;
    successful: number;
    failed: number;
    skipped: number;
  } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a JSON file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulating file upload and processing progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + 10;
          if (newValue >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newValue;
        });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setIsProcessing(false);
        setProgress(100);
        setProcessingResults({
          totalProcessed: 100,
          successful: 82,
          failed: 5,
          skipped: 13,
        });
        toast({
          title: "Batch processing complete",
          description: "Successfully processed 82 out of 100 items",
          variant: "default",
        });
      }, 5000);

      // Actually we'd call the API here to process the file
      // const formData = new FormData();
      // formData.append("file", selectedFile);
      // const response = await apiRequest("POST", "/api/batch/process", formData);
      // setProcessingResults(await response.json());
    } catch (error) {
      console.error("Error processing batch:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing the batch file",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-['Source_Sans_Pro']">
                Batch Processing
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Process multiple content items at once for efficient tagging
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Processing Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="upload">
          <TabsList className="mb-6">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="history">Processing History</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Upload Content Batch
                </h3>
                <div className="max-w-2xl">
                  <p className="text-sm text-gray-500 mb-6">
                    Upload a JSON file containing content metadata to process. The system will
                    automatically apply tags to each item based on the metadata.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                    <div className="flex flex-col items-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#0063e5] hover:text-blue-700"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".json"
                            onChange={handleFileChange}
                            disabled={isProcessing}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        JSON files up to 10MB
                      </p>
                      {selectedFile && (
                        <div className="mt-4 text-sm text-gray-800 bg-gray-100 rounded-md px-3 py-1">
                          {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Processing Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          id="overwrite"
                          name="overwrite"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                        />
                        <label htmlFor="overwrite" className="ml-2 block text-sm text-gray-700">
                          Overwrite existing tags
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="automatic"
                          name="automatic"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="automatic" className="ml-2 block text-sm text-gray-700">
                          Automatic tagging
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notify"
                          name="notify"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notify" className="ml-2 block text-sm text-gray-700">
                          Notify when complete
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="high-confidence"
                          name="high-confidence"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                        />
                        <label
                          htmlFor="high-confidence"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Only apply high confidence tags ({'>'}85%)
                        </label>
                      </div>
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Processing Status</h4>
                      <Progress value={progress} className="h-2" />
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {progress}% complete
                      </p>
                    </div>
                  )}

                  {processingResults && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Results Summary</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm text-center">
                          <p className="text-sm text-gray-500">Total Processed</p>
                          <p className="text-lg font-semibold">{processingResults.totalProcessed}</p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm text-center">
                          <p className="text-sm text-gray-500">Successful</p>
                          <p className="text-lg font-semibold text-green-600">
                            {processingResults.successful}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm text-center">
                          <p className="text-sm text-gray-500">Failed</p>
                          <p className="text-lg font-semibold text-red-600">
                            {processingResults.failed}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm text-center">
                          <p className="text-sm text-gray-500">Skipped</p>
                          <p className="text-lg font-semibold text-yellow-600">
                            {processingResults.skipped}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-right">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Save className="h-4 w-4 mr-1" />
                          Save Report
                        </Button>
                        <Button size="sm">View Detailed Results</Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      disabled={isProcessing}
                      onClick={() => {
                        setSelectedFile(null);
                        setProgress(0);
                        setProcessingResults(null);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      disabled={!selectedFile || isProcessing}
                      onClick={handleUpload}
                      className="bg-[#0063e5] hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Process Batch
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Processing History
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Success Rate
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Q2 2023 Releases
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          May 15, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">94%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Marvel Phase 5
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Apr 30, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Documentaries Update
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Apr 10, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Partial
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Scheduled Tasks
                  </h3>
                  <Button>Schedule New Task</Button>
                </div>
                <div className="text-center py-10">
                  <p className="text-gray-500">No scheduled tasks found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Set up recurring batch processing tasks to automatically tag new content
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BatchProcessing;
