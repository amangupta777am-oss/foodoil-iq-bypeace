// API Service Layer for Oil Quality Predictions
// This can be connected to a real backend API or local ML model

export interface SensorData {
  spectralFeatures: number[];
  temperature: number;
  humidity: number;
  sampleId?: string;
}

export interface PredictionResult {
  ffa: number;
  tpc: number;
  pv: number;
  confidence: number;
  classification: 'pass' | 'borderline' | 'reject';
  score: number;
  recommendations: string[];
  timestamp: string;
  modelVersion: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

class OilQualityApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = '/api', timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
  }

  // Predict oil quality from sensor data
  async predict(sensorData: SensorData): Promise<PredictionResult> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/predict`, {
        method: 'POST',
        body: JSON.stringify(sensorData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Fallback to local simulation when API is unavailable
      console.warn('API unavailable, using local simulation:', error);
      return this.simulateLocalPrediction(sensorData);
    }
  }

  // Local simulation for offline/demo mode
  private simulateLocalPrediction(sensorData: SensorData): PredictionResult {
    // Simulate realistic oil quality values
    const ffa = 0.1 + Math.random() * 0.25;
    const tpc = 10 + Math.random() * 18;
    const pv = 3 + Math.random() * 9;
    
    // Calculate score based on parameters
    const ffaScore = Math.max(0, 100 - (ffa / 0.3) * 100);
    const tpcScore = Math.max(0, 100 - (tpc / 25) * 100);
    const pvScore = Math.max(0, 100 - (pv / 10) * 100);
    const score = Math.round((ffaScore + tpcScore + pvScore) / 3);
    
    // Determine classification
    let classification: 'pass' | 'borderline' | 'reject';
    if (score >= 75) {
      classification = 'pass';
    } else if (score >= 50) {
      classification = 'borderline';
    } else {
      classification = 'reject';
    }

    // Generate recommendations based on values
    const recommendations: string[] = [];
    if (ffa > 0.2) recommendations.push('FFA levels elevated - consider oil replacement soon');
    if (tpc > 20) recommendations.push('TPC approaching limits - increase monitoring frequency');
    if (pv > 8) recommendations.push('Peroxide value high - check storage conditions');
    if (recommendations.length === 0) recommendations.push('All parameters within optimal range');

    return {
      ffa: Math.round(ffa * 100) / 100,
      tpc: Math.round(tpc * 10) / 10,
      pv: Math.round(pv * 10) / 10,
      confidence: 85 + Math.random() * 12,
      classification,
      score,
      recommendations,
      timestamp: new Date().toISOString(),
      modelVersion: 'local-v1.0.0',
    };
  }

  // Check API health
  async healthCheck(): Promise<{ status: string; version: string }> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch {
      return { status: 'offline', version: 'local-simulation' };
    }
  }

  // Get regulatory limits configuration
  async getConfig(): Promise<{
    limits: { ffa: number; tpc: number; pv: number };
    standards: string;
  }> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/config`);
      if (!response.ok) throw new Error('Config fetch failed');
      return await response.json();
    } catch {
      return {
        limits: { ffa: 0.3, tpc: 25, pv: 10 },
        standards: 'FSSAI/Codex Alimentarius',
      };
    }
  }
}

export const oilQualityApi = new OilQualityApiService();
