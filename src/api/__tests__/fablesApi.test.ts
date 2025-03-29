import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateFable, checkHealth } from '../fablesApi';

describe('fablesApi', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('generateFable', () => {
    it('returns fable data on successful API call', async () => {
      // given
      const mockResponse = {
        fable_text: 'Once upon a time...',
        images: ['image1.jpg', 'image2.jpg'],
        prompts: ['prompt1', 'prompt2']
      };
      
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      const requestData = {
        world_description: 'A magical forest',
        main_character: 'Wise Owl',
        age: 7,
        num_images: 2
      };
      
      // when
      const result = await generateFable(requestData);
      
      // then
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/generate_fable'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(requestData)
        })
      );
      
      expect(result).toEqual(mockResponse);
    });
    
    it('throws error when API call fails', async () => {
      // given
      const errorDetail = 'Invalid request';
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ detail: errorDetail })
      });
      
      const requestData = {
        world_description: 'A magical forest',
        main_character: 'Wise Owl',
        age: 7
      };
      
      // when/then
      await expect(generateFable(requestData)).rejects.toThrow(errorDetail);
    });
  });
  
  describe('checkHealth', () => {
    it('returns true when API is healthy and OpenAI key is configured', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ openai_key_configured: true })
      });
      
      // when
      const result = await checkHealth();
      
      // then
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/health'));
      expect(result).toBe(true);
    });
    
    it('returns false when API health check fails', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: false
      });
      
      // when
      const result = await checkHealth();
      
      // then
      expect(result).toBe(false);
    });
    
    it('returns false when OpenAI key is not configured', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ openai_key_configured: false })
      });
      
      // when
      const result = await checkHealth();
      
      // then
      expect(result).toBe(false);
    });
  });
}); 