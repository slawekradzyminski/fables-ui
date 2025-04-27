import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateFable, checkHealth, FableResponse, IllustrationResponse } from '../fablesApi';

describe('fablesApi', () => {
  // Using any for fetchMock type to avoid persistent TS/linter issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.spyOn(window, 'fetch');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('generateFable', () => {
    it('returns fable data on successful API call', async () => {
      // given
      const mockIllustrations: IllustrationResponse[] = [
        { prompt: 'prompt1', image: 'base64_image_1' },
        { prompt: 'prompt2', image: 'base64_image_2' }
      ];
      const mockResponse: FableResponse = {
        title: 'Fable Title',
        fable: 'Once upon a time...',
        moral: 'The moral is...',
        illustrations: mockIllustrations
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

    it('throws generic error when API call fails without detail', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Some other error' })
      });
      const requestData = { world_description: 'a', main_character: 'b', age: 1 };
      
      // when/then
      await expect(generateFable(requestData)).rejects.toThrow('Failed to generate fable');
    });

    it('throws parsing error message when API call fails and json parsing fails', async () => {
      // given
      const parsingErrorMessage = 'Parsing failed';
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.reject(new Error(parsingErrorMessage)) 
      });
      const requestData = { world_description: 'a', main_character: 'b', age: 1 };
      
      // when/then
      await expect(generateFable(requestData)).rejects.toThrow(parsingErrorMessage);
    });
  });
  
  describe('checkHealth', () => {
    it('returns true when API status is healthy', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'healthy' })
      });
      
      // when
      const result = await checkHealth();
      
      // then
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/health'));
      expect(result).toBe(true);
    });
    
    it('returns false when API health check fails (response not ok)', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: false
      });
      
      // when
      const result = await checkHealth();
      
      // then
      expect(result).toBe(false);
    });
    
    it('returns false when API status is not healthy', async () => {
      // given
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'unhealthy' })
      });
      
      // when
      const result = await checkHealth();
      
      // then
      expect(result).toBe(false);
    });

    it('returns false when API call throws an error', async () => {
      // given
      fetchMock.mockRejectedValueOnce(new Error('Network error'));
      
      // when
      const result = await checkHealth();
      
      // then
      expect(result).toBe(false);
    });
  });
}); 