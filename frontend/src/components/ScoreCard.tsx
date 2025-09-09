import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Shield, Eye, Lock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { AnalysisResult } from '../types/analysis';

interface ScoreCardProps {
  analysis: AnalysisResult;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Overall Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(analysis.overallScore)}>
                {analysis.overallScore}
              </span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {getScoreGrade(analysis.overallScore)}
            </div>
          </div>
          <Progress value={analysis.overallScore} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Analyzed on {new Date(analysis.timestamp).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Security */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">
                {analysis.categoryScores.security}
              </span>
              <Badge variant={getSeverityBadgeVariant(
                analysis.security.vulnerabilities.length > 0 ? 'high' : 'low'
              )}>
                {analysis.security.vulnerabilities.length} issues
              </Badge>
            </div>
            <Progress value={analysis.categoryScores.security} className="h-2" />
            <div className="mt-3 space-y-1 text-sm">
              {analysis.security.isWordPress ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  WordPress detected
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-500" />
                  WordPress not detected
                </div>
              )}
              {analysis.security.wordpressVersion && (
                <div className="text-muted-foreground">
                  Version: {analysis.security.wordpressVersion}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* GDPR */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-4 w-4" />
              GDPR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">
                {analysis.categoryScores.gdpr}
              </span>
              <Badge variant={analysis.gdpr.hasCookieBanner && analysis.gdpr.hasPrivacyPolicy ? 'success' : 'warning'}>
                {analysis.gdpr.trackers.filter(t => t.detected).length} trackers
              </Badge>
            </div>
            <Progress value={analysis.categoryScores.gdpr} className="h-2" />
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-1">
                {analysis.gdpr.hasCookieBanner ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                Cookie banner
              </div>
              <div className="flex items-center gap-1">
                {analysis.gdpr.hasPrivacyPolicy ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                Privacy policy
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-4 w-4" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">
                {analysis.categoryScores.accessibility}
              </span>
              <Badge variant={
                analysis.accessibility.missingAltImages + analysis.accessibility.headingIssues.length + analysis.accessibility.missingAriaLabels > 5 
                  ? 'error' : 'warning'
              }>
                {analysis.accessibility.missingAltImages + analysis.accessibility.headingIssues.length + analysis.accessibility.missingAriaLabels} issues
              </Badge>
            </div>
            <Progress value={analysis.categoryScores.accessibility} className="h-2" />
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <div>{analysis.accessibility.missingAltImages} missing alt texts</div>
              <div>{analysis.accessibility.headingIssues.length} heading issues</div>
              <div>{analysis.accessibility.missingAriaLabels} missing ARIA labels</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recommendations ({analysis.recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.slice(0, 10).map((rec, index) => (
                <div key={index} className="border-l-4 border-l-primary pl-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={getSeverityBadgeVariant(rec.severity)}>
                          {rec.severity}
                        </Badge>
                        <Badge variant="outline">
                          {rec.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <p className="text-sm font-medium">
                        Action: {rec.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {analysis.recommendations.length > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  ... and {analysis.recommendations.length - 10} more recommendations
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
