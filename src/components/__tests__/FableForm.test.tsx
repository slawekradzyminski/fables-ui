import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FableForm from '../FableForm';
import * as api from '../../api/fablesApi';
// Import the necessary types
import { FableResponse, IllustrationResponse } from '../../api/fablesApi';

describe('FableForm', () => {
  it('submits form data and calls onFableGenerated and onLoadingChange on success', async () => {
    // given
    const mockOnFableGenerated = vi.fn();
    const mockOnError = vi.fn();
    const mockOnLoadingChange = vi.fn(); // Mock for loading state change
    
    // Define mock illustrations
    const mockIllustrations: IllustrationResponse[] = [
      { prompt: 'prompt1', image: 'img1' },
      { prompt: 'prompt2', image: 'img2' }
    ];
    // Define mock response with new structure
    const mockFableResponse: FableResponse = {
      fable: 'Mock fable text',
      moral: 'Mock moral',
      illustrations: mockIllustrations
    };
    
    const generateFableSpy = vi.spyOn(api, 'generateFable').mockResolvedValue(mockFableResponse);
    
    render(
      <FableForm 
        onFableGenerated={mockOnFableGenerated} 
        onError={mockOnError} 
        onLoadingChange={mockOnLoadingChange} // Pass the mock function
      />
    );
    
    // when - Fill form
    fireEvent.change(screen.getByLabelText(/Describe the magical world/i), { target: { value: 'A magical forest' } });
    fireEvent.change(screen.getByLabelText(/Who is your main character/i), { target: { value: 'Wise Owl' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /Target Age/i }), { target: { value: '7' } });
    // Assuming default number of images is 2, or selecting it explicitly if needed
    // fireEvent.change(screen.getByLabelText(/Number of Images/i), { target: { value: '2' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Magical Story/i }));
    
    // then
    // Check loading state changes
    expect(mockOnLoadingChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Creating your story...')).toBeInTheDocument(); // Button text changes
    
    await waitFor(() => {
      // Check API call arguments
      expect(generateFableSpy).toHaveBeenCalledWith({
        world_description: 'A magical forest',
        main_character: 'Wise Owl',
        age: 7,
        num_images: 2 // Ensure default or selected value is tested
      });
      
      // Check that onFableGenerated was called with the full response object
      expect(mockOnFableGenerated).toHaveBeenCalledWith(mockFableResponse);
      // Check loading state change after completion
      expect(mockOnLoadingChange).toHaveBeenCalledWith(false);
    });

    // Ensure button is re-enabled and text reverts
    expect(screen.getByRole('button', { name: /Generate Magical Story/i })).not.toBeDisabled();
  });

  it('calls onError and onLoadingChange when API call fails', async () => {
    // given
    const mockOnFableGenerated = vi.fn();
    const mockOnError = vi.fn();
    const mockOnLoadingChange = vi.fn(); // Mock for loading state change
    
    const errorMessage = 'API error occurred';
    vi.spyOn(api, 'generateFable').mockRejectedValue(new Error(errorMessage));
    
    render(
      <FableForm 
        onFableGenerated={mockOnFableGenerated} 
        onError={mockOnError} 
        onLoadingChange={mockOnLoadingChange} // Pass the mock function
      />
    );
    
    // when - Fill minimum required fields
    fireEvent.change(screen.getByLabelText(/Describe the magical world/i), { target: { value: 'A magical forest' } });
    fireEvent.change(screen.getByLabelText(/Who is your main character/i), { target: { value: 'Wise Owl' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Magical Story/i }));
    
    // then
    // Check loading state changes
    expect(mockOnLoadingChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Creating your story...')).toBeInTheDocument();

    await waitFor(() => {
      // Check error handler was called
      expect(mockOnError).toHaveBeenCalledWith(errorMessage);
      // Check success handler was not called
      expect(mockOnFableGenerated).not.toHaveBeenCalled();
      // Check loading state change after error
      expect(mockOnLoadingChange).toHaveBeenCalledWith(false);
    });

    // Ensure button is re-enabled and text reverts
    expect(screen.getByRole('button', { name: /Generate Magical Story/i })).not.toBeDisabled();
  });
}); 