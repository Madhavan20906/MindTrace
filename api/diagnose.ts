import { GoogleGenAI } from '@google/genai';

interface ApiRequest {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(data: any): void;
  end(): void;
}

// Server-side sliding-window rate limiter (30 requests/min per IP)
const IP_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const IP_MAX_REQUESTS = 30;
const ipRequestMap = new Map<string, number[]>();

function checkServerRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (ipRequestMap.get(clientIp) || []).filter((t) => now - t < IP_RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= IP_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  timestamps.push(now);
  ipRequestMap.set(clientIp, timestamps);
  return { allowed: true, remaining: IP_MAX_REQUESTS - timestamps.length };
}

// Serverless Edge Proxy Handler for MindTrace AI Engine
// Isolates GEMINI_API_KEY safely on serverless edge environment without client JS exposure
export default async function handler(req: ApiRequest, res: ApiResponse) {
  // CORS & Security Headers
  const allowedOrigin = (typeof process !== 'undefined' && process.env && process.env.ALLOWED_ORIGIN) || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract client IP for throttling
  const rawIp = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || '127.0.0.1';
  const clientIp = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();

  const rateLimitStatus = checkServerRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', String(IP_MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(rateLimitStatus.remaining));

  if (!rateLimitStatus.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded: Maximum 30 requests per minute allowed.',
      success: false,
    });
  }

  const apiKey = (typeof process !== 'undefined' && process.env)
    ? (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)
    : '';

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server edge proxy.',
      isConfigured: false,
    });
  }

  try {
    const { prompt, model = 'gemini-3.6-flash', systemInstruction, temperature = 0.2 } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
      },
    });

    const text = response.text || '';
    return res.status(200).json({
      success: true,
      text,
    });
  } catch (err: any) {
    console.error('Edge Proxy AI execution error:', err);
    return res.status(500).json({
      error: err.message || 'Internal AI proxy error',
      success: false,
    });
  }
}

