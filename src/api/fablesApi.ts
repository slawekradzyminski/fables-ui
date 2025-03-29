export interface FableRequest {
  world_description: string;
  main_character: string;
  age: number;
  num_images?: number;
}

export interface FableResponse {
  fable_text: string;
  images: string[];
  prompts: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Generate a fable by POSTing user-provided data to the FastAPI backend.
 */
export async function generateFable(requestData: FableRequest): Promise<FableResponse> {
  const response = await fetch(`${API_BASE_URL}/generate_fable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate fable');
  }

  return response.json();
}

/**
 * Simple health check call
 */
export async function checkHealth(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) return false;
  const data = await response.json();
  return data.openai_key_configured;
} 