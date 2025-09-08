export class ScoreCalculator {
  // Weights for overall score calculation
  private readonly SECURITY_WEIGHT = 0.5;  // 50%
  private readonly GDPR_WEIGHT = 0.25;      // 25%
  private readonly ACCESSIBILITY_WEIGHT = 0.25; // 25%

  calculateOverallScore(categoryScores: {
    security: number;
    gdpr: number;
    accessibility: number;
  }): number {
    const weightedScore = 
      (categoryScores.security * this.SECURITY_WEIGHT) +
      (categoryScores.gdpr * this.GDPR_WEIGHT) +
      (categoryScores.accessibility * this.ACCESSIBILITY_WEIGHT);

    return Math.round(weightedScore);
  }

  getScoreGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  }
}
