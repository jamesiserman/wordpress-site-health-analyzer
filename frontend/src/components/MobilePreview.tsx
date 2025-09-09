import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface MobilePreviewProps {
  url: string;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ url }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Site Preview
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div 
            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              viewMode === 'mobile' 
                ? 'w-[375px] h-[667px]' 
                : 'w-full h-[600px]'
            }`}
          >
            <iframe
              src={url}
              className="w-full h-full"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {viewMode === 'mobile' ? 'Mobile view (375px width)' : 'Desktop view (responsive)'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Preview may not reflect all site functionality due to security restrictions
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
