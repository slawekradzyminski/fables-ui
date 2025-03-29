import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FableForm from '../FableForm';
import * as api from '../../api/fablesApi';

describe('FableForm', () => {
  it('submits form data and calls onFableGenerated on success', async () => {
    // given
    const mockOnFableGenerated = vi.fn();
    const mockOnError = vi.fn();
    
    const generateFableSpy = vi.spyOn(api, 'generateFable').mockResolvedValue({
      fable_text: 'Mock fable text',
      images: ['img1', 'img2'],
      prompts: []
    });
    
    render(<FableForm onFableGenerated={mockOnFableGenerated} onError={mockOnError} />);
    
    // when
    fireEvent.change(screen.getByLabelText(/World Description/i), { target: { value: 'A magical forest' } });
    fireEvent.change(screen.getByLabelText(/Main Character/i), { target: { value: 'Wise Owl' } });
    
    // Use a more specific selector for the Age input field
    const ageInput = screen.getByRole('spinbutton', { name: /Target Age/i });
    fireEvent.change(ageInput, { target: { value: '7' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Fable/i }));
    
    // then
    expect(screen.getByText('Creating your story...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(generateFableSpy).toHaveBeenCalledWith({
        world_description: 'A magical forest',
        main_character: 'Wise Owl',
        age: 7,
        num_images: 2
      });
      
      expect(mockOnFableGenerated).toHaveBeenCalledWith('Mock fable text', ['img1', 'img2']);
    });
  });

  it('handles errors correctly', async () => {
    // given
    const mockOnFableGenerated = vi.fn();
    const mockOnError = vi.fn();
    
    const errorMessage = 'API error occurred';
    vi.spyOn(api, 'generateFable').mockRejectedValue(new Error(errorMessage));
    
    render(<FableForm onFableGenerated={mockOnFableGenerated} onError={mockOnError} />);
    
    // when
    fireEvent.change(screen.getByLabelText(/World Description/i), { target: { value: 'A magical forest' } });
    fireEvent.change(screen.getByLabelText(/Main Character/i), { target: { value: 'Wise Owl' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Generate Fable/i }));
    
    // then
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(errorMessage);
      expect(mockOnFableGenerated).not.toHaveBeenCalled();
    });
  });
}); 