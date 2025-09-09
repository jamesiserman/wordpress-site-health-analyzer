import { AnalysisResult } from '../types/analysis';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export class ApiService {
  static async analyzeWebsite(url: string): Promise<AnalysisResult> {
    try {
      console.log('Making API request to:', `${API_BASE_URL}/analyze?url=${encodeURIComponent(url)}`);
      
      const response = await fetch(`${API_BASE_URL}/analyze?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API success response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to analyze website');
    }
  }
}
