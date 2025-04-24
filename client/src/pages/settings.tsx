import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Save, 
  RefreshCcw, 
  Users, 
  Bell, 
  Database, 
  Shield, 
  Sliders 
} from "lucide-react";

const Settings: React.FC = () => {
  const [apiUrl, setApiUrl] = useState("https://api.disney-tagger.com/v1");
  const [apiKey, setApiKey] = useState("sk_test_disney_ott_tagger_api_key");
  const [minConfidence, setMinConfidence] = useState("85");
  const [isSaving, setIsSaving] = useState(false);
  const [isResetTagEngine, setIsResetTagEngine] = useState(false);
  const { toast } = useToast();

  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved.",
      });
    }, 1000);
  };

  const resetTagEngine = () => {
    setIsResetTagEngine(true);
    
    // Simulate resetting tag engine
    setTimeout(() => {
      setIsResetTagEngine(false);
      toast({
        title: "Tag Engine Reset",
        description: "The tagging engine has been reset to default settings.",
      });
    }, 2000);
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-['Source_Sans_Pro']">
                Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Configure your Disney+ OTT Metadata Tagger system preferences
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                disabled={isSaving}
                onClick={saveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0063e5] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="general">
          <TabsList className="mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tagging">Tagging Engine</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>View information about your system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Version</Label>
                      <p className="text-sm font-medium mt-1">Disney+ OTT Metadata Tagger v1.0.0</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Environment</Label>
                      <p className="text-sm font-medium mt-1">Production</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                      <p className="text-sm font-medium mt-1">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Database Status</Label>
                      <p className="text-sm font-medium text-green-600 mt-1">Connected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>Customize the appearance of your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-sm text-gray-500">Reduce spacing between elements</p>
                    </div>
                    <Switch id="compact-view" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-confidence">Display Confidence Scores</Label>
                      <p className="text-sm text-gray-500">Show tag confidence scores in content lists</p>
                    </div>
                    <Switch id="show-confidence" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tagging">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tag Engine Configuration</CardTitle>
                  <CardDescription>Configure how the automatic tagging system works</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="min-confidence">Minimum Confidence Score</Label>
                      <div className="flex items-center">
                        <Input 
                          id="min-confidence" 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={minConfidence}
                          onChange={(e) => setMinConfidence(e.target.value)}
                        />
                        <span className="ml-2">%</span>
                      </div>
                      <p className="text-xs text-gray-500">Tags with confidence below this threshold will require manual review</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tag-generation-mode">Tag Generation Mode</Label>
                      <select 
                        id="tag-generation-mode" 
                        className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#0063e5] focus:border-[#0063e5]"
                      >
                        <option value="balanced">Balanced (Default)</option>
                        <option value="aggressive">Aggressive (More Tags)</option>
                        <option value="conservative">Conservative (Higher Accuracy)</option>
                      </select>
                      <p className="text-xs text-gray-500">Controls how aggressively the system assigns tags</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label>Auto-tagging Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center">
                        <input
                          id="tag-availability"
                          name="tag-availability"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="tag-availability" className="ml-2 block text-sm text-gray-700">
                          Availability Status
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="tag-brand"
                          name="tag-brand"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="tag-brand" className="ml-2 block text-sm text-gray-700">
                          Brand Association
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="tag-category"
                          name="tag-category"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="tag-category" className="ml-2 block text-sm text-gray-700">
                          Content Category
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="tag-system"
                          name="tag-system"
                          type="checkbox"
                          className="h-4 w-4 text-[#0063e5] focus:ring-[#0063e5] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="tag-system" className="ml-2 block text-sm text-gray-700">
                          System Tags
                        </label>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-800" />
                    <AlertTitle className="text-yellow-800">Important</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Changes to these settings will only affect newly tagged content and batch processes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetTagEngine} disabled={isResetTagEngine}>
                    {isResetTagEngine ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset to Defaults
                      </>
                    )}
                  </Button>
                  <Button onClick={saveSettings} disabled={isSaving}>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brand Recognition</CardTitle>
                  <CardDescription>Configure brand pattern matching rules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="disney-patterns">Disney Patterns</Label>
                        <Input
                          id="disney-patterns"
                          placeholder="Enter comma-separated patterns"
                          defaultValue="Disney, Walt Disney, Disney Animation, Disney Classics"
                        />
                      </div>
                      <div>
                        <Label htmlFor="marvel-patterns">Marvel Patterns</Label>
                        <Input
                          id="marvel-patterns"
                          placeholder="Enter comma-separated patterns"
                          defaultValue="Marvel, MCU, Avengers, Marvel Studios"
                        />
                      </div>
                      <div>
                        <Label htmlFor="star-wars-patterns">Star Wars Patterns</Label>
                        <Input
                          id="star-wars-patterns"
                          placeholder="Enter comma-separated patterns"
                          defaultValue="Star Wars, Mandalorian, Jedi, Lucasfilm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pixar-patterns">Pixar Patterns</Label>
                        <Input
                          id="pixar-patterns"
                          placeholder="Enter comma-separated patterns"
                          defaultValue="Pixar, Toy Story, Finding, Incredibles"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="natgeo-patterns">National Geographic Patterns</Label>
                        <Input
                          id="natgeo-patterns"
                          placeholder="Enter comma-separated patterns"
                          defaultValue="National Geographic, Nat Geo, Geography, Nature, Wildlife"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure when and how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Batch Processing Completion</Label>
                      <p className="text-sm text-gray-500">Receive notifications when batch processing completes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Confidence Tags</Label>
                      <p className="text-sm text-gray-500">Be notified when content receives low confidence tags</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Content Expiry</Label>
                      <p className="text-sm text-gray-500">Receive notifications about content that will expire soon</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">System Alerts</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Usage Warnings</Label>
                      <p className="text-sm text-gray-500">Be alerted when API usage approaches limits</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Notification Recipients</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-recipients">Email Recipients</Label>
                    <Input 
                      id="email-recipients" 
                      placeholder="Enter comma-separated email addresses" 
                      defaultValue="admin@example.com, manager@example.com"
                    />
                    <p className="text-xs text-gray-500">
                      These email addresses will receive all enabled notifications
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">AU</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Admin User</div>
                                <div className="text-sm text-gray-500">admin@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Administrator</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Just now
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">CM</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Content Manager</div>
                                <div className="text-sm text-gray-500">manager@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Manager</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            3 hours ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-700">VU</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Viewer User</div>
                                <div className="text-sm text-gray-500">viewer@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Viewer</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            2 days ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-[#0063e5] hover:bg-blue-700">
                      Add New User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  API Configuration
                </CardTitle>
                <CardDescription>Manage API settings and keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url">API Base URL</Label>
                  <Input 
                    id="api-url" 
                    value={apiUrl} 
                    onChange={(e) => setApiUrl(e.target.value)} 
                  />
                  <p className="text-xs text-gray-500">
                    Base URL for all API endpoints
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex">
                    <Input 
                      id="api-key" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-grow font-mono"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        toast({
                          title: "API Key copied to clipboard",
                          duration: 2000,
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This key is used to authenticate API requests
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Rate Limiting</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">Requests per Minute</Label>
                      <Input 
                        id="rate-limit" 
                        type="number" 
                        defaultValue="60" 
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="daily-limit">Daily Request Limit</Label>
                      <Input 
                        id="daily-limit" 
                        type="number" 
                        defaultValue="10000" 
                        min="1" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">API Access Control</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable CORS</Label>
                        <p className="text-sm text-gray-500">Allow cross-origin requests to the API</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowed-origins">Allowed Origins</Label>
                      <Input 
                        id="allowed-origins" 
                        placeholder="Enter comma-separated domains" 
                        defaultValue="https://app.disney-tagger.com, https://admin.disney-tagger.com"
                      />
                      <p className="text-xs text-gray-500">
                        Domains that are allowed to make cross-origin requests
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>Save API Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security options for your system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all administrator accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="session-timeout" 
                      type="number" 
                      defaultValue="30" 
                      min="5"
                    />
                    <p className="text-xs text-gray-500">
                      Time in minutes before an inactive session expires
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Password Policy</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Strong Passwords</Label>
                        <p className="text-sm text-gray-500">Enforce password complexity requirements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Password Expiration</Label>
                        <p className="text-sm text-gray-500">Force password changes periodically</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input 
                        id="password-expiry" 
                        type="number" 
                        defaultValue="90" 
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">API Security</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Key Rotation</Label>
                      <p className="text-sm text-gray-500">Automatically rotate API keys periodically</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="key-rotation">Key Rotation Period (days)</Label>
                    <Input 
                      id="key-rotation" 
                      type="number" 
                      defaultValue="180" 
                      min="30"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings} disabled={isSaving}>Save Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
