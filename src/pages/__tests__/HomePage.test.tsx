import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../HomePage';
import { FableResponse, IllustrationResponse } from '../../api/fablesApi';

// Mock the LoadingOverlay to check its presence
vi.mock('../../components/LoadingOverlay', () => ({
  default: ({ loading }: { loading: boolean }) => (
    loading ? <div data-testid="loading-overlay">Loading...</div> : null
  )
}));

// Define types for mock component props
interface MockFableFormProps {
  onFableGenerated: (response: FableResponse) => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

interface MockFableResultProps {
  title: string;
  fableText: string;
  moral: string;
  illustrations: IllustrationResponse[];
}

// Mock FableForm to simulate interaction and pass new props
vi.mock('../../components/FableForm', () => ({
  // Use defined type for props
  default: ({ onFableGenerated, onError, onLoadingChange }: MockFableFormProps) => {
    // Define mock response data matching the new structure
    const mockIllustrations: IllustrationResponse[] = [
      { prompt: 'p1', image: 'i1' },
      { prompt: 'p2', image: 'i2' }
    ];
    const mockSuccessResponse: FableResponse = {
      title: 'Generated Title', 
      fable: 'Generated fable text',
      moral: 'Generated moral',
      illustrations: mockIllustrations
    };
    
    return (
      <div data-testid="mock-fable-form">
        <button 
          onClick={() => {
            onLoadingChange(true); // Simulate loading start
            // Simulate async operation
            setTimeout(() => { 
              onFableGenerated(mockSuccessResponse);
              onLoadingChange(false); // Simulate loading end
            }, 10);
          }}
          data-testid="trigger-success"
        >
          Success
        </button>
        <button 
          onClick={() => {
            onLoadingChange(true); // Simulate loading start
            setTimeout(() => {
              onError('Error message');
              onLoadingChange(false); // Simulate loading end
            }, 10);
          }}
          data-testid="trigger-error"
        >
          Error
        </button>
      </div>
    );
  }
}));

// Mock FableResult to accept new props including title
vi.mock('../../components/FableResult', () => ({
  // Use defined type for props
  default: ({ title, fableText, moral, illustrations }: MockFableResultProps) => (
    <div data-testid="mock-fable-result">
      {/* Display title if present */}
      {title && <div data-testid="title-text">{title}</div>}
      <div data-testid="fable-text">{fableText}</div>
      {/* Display moral if present */}
      {moral && <div data-testid="moral-text">{moral}</div>}
      {/* Display illustration count */}
      <div data-testid="illustrations-count">{illustrations.length}</div>
    </div>
  )
}));

describe('HomePage', () => {
  beforeEach(() => {
    // Use window.scrollTo
    window.scrollTo = vi.fn(); 
  });

  it('renders FableForm and empty FableResult initially', () => {
    // given
    render(<HomePage />);
    
    // then
    expect(screen.getByTestId('mock-fable-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fable-result')).toBeInTheDocument();
    expect(screen.getByTestId('fable-text').textContent).toBe('');
    expect(screen.queryByTestId('moral-text')).not.toBeInTheDocument(); // Moral not present initially
    expect(screen.getByTestId('illustrations-count').textContent).toBe('0');
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument(); // Loading overlay not present
    expect(screen.queryByTestId('title-text')).not.toBeInTheDocument(); // Title not present initially
  });

  it('shows loading overlay and updates FableResult when fable is generated', async () => {
    // given
    render(<HomePage />);
    
    // when
    fireEvent.click(screen.getByTestId('trigger-success'));
    
    // then - Check for loading overlay immediately
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

    // Wait for async updates
    await waitFor(() => {
      // Check FableResult updated with title
      expect(screen.getByTestId('title-text').textContent).toBe('Generated Title'); 
      expect(screen.getByTestId('fable-text').textContent).toBe('Generated fable text');
      expect(screen.getByTestId('moral-text').textContent).toBe('Generated moral');
      expect(screen.getByTestId('illustrations-count').textContent).toBe('2'); // Based on mock data
      // Verify window.scrollTo was called
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    // Check loading overlay is removed after completion
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
  });

  it('shows loading overlay and then error alert when error occurs', async () => {
    // given
    render(<HomePage />);
    
    // when
    fireEvent.click(screen.getByTestId('trigger-error'));
    
    // then - Check for loading overlay immediately
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

    // Wait for async updates
    await waitFor(() => {
      // Check error message is displayed
      expect(screen.getByText('Error message')).toBeInTheDocument();
      // Ensure window.scrollTo was NOT called on error
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    // Check loading overlay is removed after completion
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    
    // when - close the alert
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // then
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
  });
}); 