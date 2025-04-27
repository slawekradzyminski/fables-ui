export interface FableRequest {
  world_description: string;
  main_character: string;
  age: number;
  num_images?: number;
}

// New types
export interface IllustrationResponse {
  prompt: string;
  image: string;
}

// Updated FableResponse
export interface FableResponse {
  title: string;
  fable: string;
  moral: string;
  illustrations: IllustrationResponse[];
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
    // Use optional chaining and nullish coalescing for safer error message access
    throw new Error(error?.detail ?? 'Failed to generate fable');
  }

  // Cast the response promise
  return response.json() as Promise<FableResponse>;
}

/**
 * Simple health check call
 */
export async function checkHealth(): Promise<boolean> {
  try { // Added try-catch for robustness
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return false;
    const { status } = await response.json(); // Destructure status
    return status === 'healthy'; // Check status value
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
} 