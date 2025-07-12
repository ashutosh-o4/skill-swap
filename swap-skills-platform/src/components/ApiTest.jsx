import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/lib/userService';
import { swapService } from '@/lib/swapService';
import { toast } from '@/hooks/use-toast';
import { Loader2, Check, X } from 'lucide-react';

export function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const testApi = async (testName, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
      toast({
        title: `${testName} Success`,
        description: `API test passed successfully`,
      });
    } catch (error) {
      console.error(`${testName} failed:`, error);
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
      toast({
        title: `${testName} Failed`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testHealth = () => fetch('http://localhost:8080/api/actuator/health').then(res => res.json());
  const testGetUsers = () => userService.getAllUsers();
  const testCreateUser = () => userService.createUser({
    name: "Test User",
    location: "Test City",
    availability: ["weekends"],
    skillsOffered: ["JavaScript"],
    skillsWanted: ["Python"],
    publicProfile: true,
    about: "Test user for API testing"
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={() => testApi('Health Check', testHealth)}
            disabled={loading}
            variant="outline"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Health Endpoint
          </Button>
          
          <Button 
            onClick={() => testApi('Get Users', testGetUsers)}
            disabled={loading}
            variant="outline"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Get Users
          </Button>
          
          <Button 
            onClick={() => testApi('Create User', testCreateUser)}
            disabled={loading}
            variant="outline"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Create User
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Test Results:</h4>
          {Object.entries(results).map(([testName, result]) => (
            <div key={testName} className="flex items-center space-x-2 p-2 bg-muted rounded">
              {result.success ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span className="font-medium">{testName}:</span>
              <span className={result.success ? "text-green-600" : "text-red-600"}>
                {result.success ? "PASSED" : "FAILED"}
              </span>
              {!result.success && (
                <span className="text-sm text-muted-foreground">({result.error})</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 