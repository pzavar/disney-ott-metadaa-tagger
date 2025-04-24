import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Play, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiServices: React.FC = () => {
  const [apiKey, setApiKey] = useState("sk_test_disney_ott_tagger_api_key");
  const [copied, setCopied] = useState(false);
  const [testEndpoint, setTestEndpoint] = useState("/api/tag");
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        title: "The Mandalorian",
        type: "series",
        releaseYear: 2019,
        description: "After the fall of the Empire, a lone gunfighter makes his way through the lawless galaxy.",
        studio: "Lucasfilm"
      },
      null,
      2
    )
  );
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      title: "API Key copied to clipboard",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setTestResponse(
          JSON.stringify(
            {
              tags: {
                brand: ["Star Wars"],
                availability: ["Exclusive"],
                category: ["Action", "Sci-Fi"],
              },
              confidence: 97,
              processingTime: "124ms",
            },
            null,
            2
          )
        );
        setIsTesting(false);
        toast({
          title: "API Test Successful",
          description: "The API endpoint responded successfully",
          duration: 3000,
        });
      }, 1000);
    } catch (error) {
      console.error("Error testing API:", error);
      setIsTesting(false);
      toast({
        title: "API Test Failed",
        description: "There was an error calling the API endpoint",
        variant: "destructive",
        duration: 5000,
      });
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
                API Services
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Access tagging capabilities programmatically through our REST API
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="testing">API Tester</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Disney+ OTT Metadata Tagger API
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Our API provides programmatic access to the metadata tagging system, allowing you to
                  integrate automatic tagging into your content management workflows.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-base font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Automatic content tagging with confidence scores
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Bulk content processing
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Content search and filtering by tags
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Comprehensive metadata management
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-base font-medium text-gray-900 mb-2">Getting Started</h4>
                    <ol className="text-sm text-gray-600 space-y-3 list-decimal ml-4">
                      <li>
                        <span className="font-medium">Get your API key</span> from the Authentication
                        section.
                      </li>
                      <li>
                        <span className="font-medium">Choose an endpoint</span> from our comprehensive
                        list of available endpoints.
                      </li>
                      <li>
                        <span className="font-medium">Make your first request</span> using the API
                        testing tool or your preferred HTTP client.
                      </li>
                      <li>
                        <span className="font-medium">Integrate the API</span> into your content
                        workflow.
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-base font-medium text-gray-900 mb-4">API Usage Examples</h4>
                  
                  <div className="rounded-md bg-gray-800 p-4 mb-6">
                    <p className="font-mono text-sm text-white mb-2">
                      # Tagging a single content item
                    </p>
                    <pre className="text-gray-300 text-xs overflow-x-auto">
                      {`curl -X POST https://api.disney-tagger.com/v1/tag \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"The Mandalorian", "type":"series", "releaseYear":2019, "studio":"Lucasfilm"}'`}
                    </pre>
                  </div>

                  <div className="rounded-md bg-gray-800 p-4">
                    <p className="font-mono text-sm text-white mb-2"># Response</p>
                    <pre className="text-gray-300 text-xs overflow-x-auto">
                      {`{
  "tags": {
    "brand": ["Star Wars"],
    "availability": ["Exclusive"],
    "category": ["Action", "Sci-Fi"]
  },
  "confidence": 97,
  "processingTime": "124ms"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authentication">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  API Authentication
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  All API requests must include your API key in the Authorization header. Your API key
                  carries many privileges, so be sure to keep it secure.
                </p>

                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Your API Key</h4>
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          value={apiKey}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          onClick={copyApiKey}
                          className="ml-3 inline-flex items-center"
                          variant="outline"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        This key is for demonstration purposes only.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Using Your API Key
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Pass your API key in the Authorization header with all API requests:
                  </p>
                  <div className="rounded-md bg-gray-800 p-4">
                    <pre className="text-gray-300 text-xs overflow-x-auto">
                      {`Authorization: Bearer ${apiKey}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    API Key Security
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-yellow-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Never share your API key in publicly accessible areas like GitHub or client-side code.
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-yellow-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Keep your API key secure - treat it like a password.
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-yellow-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Only transmit API keys over secure HTTPS connections.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="endpoints">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  API Endpoints
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  The Disney+ OTT Metadata Tagger API provides the following endpoints for tagging and
                  managing content.
                </p>

                <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Endpoint
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Method
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/tag
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800">
                            POST
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Generate tags for a single content item
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/batch
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800">
                            POST
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Process multiple content items in a single request
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/content
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                            GET
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Retrieve all content with their tags
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/content/:id
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                            GET
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Retrieve a specific content item by ID
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/content/:id/tags
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-800">
                            PUT
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Update tags for a specific content item
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/search
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                            GET
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Search content by tags, title, or other metadata
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0063e5]">
                          /api/stats
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                            GET
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Get statistics about content and tagging metrics
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  API Testing Tool
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Use this tool to test API endpoints and see the responses in real-time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="endpoint"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Endpoint
                      </label>
                      <Input
                        id="endpoint"
                        value={testEndpoint}
                        onChange={(e) => setTestEndpoint(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="payload"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Request Payload
                      </label>
                      <textarea
                        id="payload"
                        rows={12}
                        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0063e5] focus:ring-[#0063e5] font-mono text-sm"
                        value={testPayload}
                        onChange={(e) => setTestPayload(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <Button
                        onClick={handleTestApi}
                        disabled={isTesting}
                        className="w-full bg-[#0063e5] hover:bg-blue-700"
                      >
                        {isTesting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Test API
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="response"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      API Response
                    </label>
                    <div
                      className="w-full h-[356px] rounded-md border border-gray-300 bg-gray-50 p-4 overflow-auto font-mono text-sm"
                    >
                      {testResponse ? (
                        <pre>{testResponse}</pre>
                      ) : (
                        <div className="text-gray-400 italic">
                          Response will appear here after running the test
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ApiServices;
