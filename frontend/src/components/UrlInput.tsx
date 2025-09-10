import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Search, Globe } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">SitePulse</CardTitle>
        <CardDescription className="text-lg">
          Analyze your website for security vulnerabilities, GDPR compliance, and accessibility issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pr-12"
                disabled={isLoading}
              />
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!url.trim() || !isValidUrl(url.trim()) || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Website
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">What we analyze:</h4>
          <ul className="space-y-1">
            <li>• Security: SSL certificates, security headers, and known vulnerabilities</li>
            <li>• GDPR: Cookie banners, privacy policies, and tracking scripts</li>
            <li>• Accessibility: Alt text, heading structure, and ARIA labels</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
