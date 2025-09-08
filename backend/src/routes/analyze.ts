import express from 'express';
import { WordPressAnalyzer } from '../services/WordPressAnalyzer';

const router = express.Router();

router.get('/analyze', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'URL parameter is required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format'
      });
    }

    const analyzer = new WordPressAnalyzer();
    const analysis = await analyzer.analyze(url);
    
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze website',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as analyzeRoute };
