import { GoogleGenAI } from '@google/genai';

export interface AIProviderConfig {
  apiKey?: string;
  proxyUrl?: string;
  modelName?: string;
  temperature?: number;
}

export interface AIProviderResponse {
  rawText: string;
  isFallback: boolean;
  providerName: string;
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  generateText(prompt: string, systemInstruction?: string): Promise<AIProviderResponse>;
}

// 1. Live Gemini AI Provider (Google GenAI Direct Client)
export class GeminiLiveProvider implements AIProvider {
  public name = 'Google Gemini 3.6 Engine';
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  public isAvailable(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey.trim().length > 5);
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<AIProviderResponse> {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key is not configured.');
    }

    const ai = new GoogleGenAI({ apiKey: this.config.apiKey! });
    const response = await ai.models.generateContent({
      model: this.config.modelName || 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: this.config.temperature ?? 0.2,
      },
    });

    return {
      rawText: response.text || '',
      isFallback: false,
      providerName: this.name,
    };
  }
}

// 2. Server Proxy Edge Provider (For secure server-side execution without client key leak)
export class ServerProxyProvider implements AIProvider {
  public name = 'MindTrace Secure Server Proxy';
  private proxyUrl: string;

  constructor(proxyUrl: string = '/api/diagnose') {
    this.proxyUrl = proxyUrl;
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<AIProviderResponse> {
    const response = await fetch(this.proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        model: 'gemini-3.6-flash',
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Proxy error ${response.status}: ${errText || response.statusText}`);
    }

    const data = await response.json();
    if (!data.success || !data.text) {
      throw new Error(data.error || 'Server proxy returned empty response.');
    }

    return {
      rawText: data.text,
      isFallback: false,
      providerName: this.name,
    };
  }
}

// 3. Generic Structural Fallback Provider (Zero external dependencies)
export class GenericFallbackProvider implements AIProvider {
  public name = 'Generic Structural Fallback Engine';

  public isAvailable(): boolean {
    return true;
  }

  public async generateText(_prompt: string): Promise<AIProviderResponse> {
    return {
      rawText: '',
      isFallback: true,
      providerName: this.name,
    };
  }
}

// Unified Factory & Execution Pipeline
export function getActiveAIProvider(customApiKey?: string): AIProvider {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const keyToUse = customApiKey || envKey;

  // If key is configured in env or explicitly passed, use direct GeminiLiveProvider
  if (keyToUse && keyToUse.trim().length > 5 && keyToUse !== 'your_gemini_api_key_here') {
    return new GeminiLiveProvider({ apiKey: keyToUse });
  }

  // Fallback to Server Edge Proxy
  if (typeof window !== 'undefined') {
    return new ServerProxyProvider();
  }

  return new GenericFallbackProvider();
}

export async function executeAIProviderQuery(
  prompt: string,
  systemInstruction?: string,
  customApiKey?: string
): Promise<AIProviderResponse> {
  const primaryProvider = getActiveAIProvider(customApiKey);

  try {
    if (primaryProvider.isAvailable()) {
      return await primaryProvider.generateText(prompt, systemInstruction);
    }
  } catch (primaryErr) {
    console.warn(`[AI Provider] ${primaryProvider.name} failed:`, primaryErr);
    
    // If proxy failed but client has API key, attempt direct fallback
    if (customApiKey && primaryProvider.name !== 'Google Gemini 3.6 Engine') {
      try {
        const directProvider = new GeminiLiveProvider({ apiKey: customApiKey });
        if (directProvider.isAvailable()) {
          return await directProvider.generateText(prompt, systemInstruction);
        }
      } catch (fallbackErr) {
        console.warn('[AI Provider] Direct Gemini fallback failed:', fallbackErr);
      }
    }
  }

  const fallbackProvider = new GenericFallbackProvider();
  return await fallbackProvider.generateText(prompt);
}
