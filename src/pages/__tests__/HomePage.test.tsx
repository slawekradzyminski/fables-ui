import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../HomePage';
import * as api from '../../api/fablesApi';

// Mock the child components
vi.mock('../../components/FableForm', () => ({
  default: ({ onFableGenerated, onError }: any) => (
    <div data-testid="mock-fable-form">
      <button 
        onClick={() => onFableGenerated('Generated fable text', ['image1.jpg'])}
        data-testid="trigger-success"
      >
        Success
      </button>
      <button 
        onClick={() => onError('Error message')}
        data-testid="trigger-error"
      >
        Error
      </button>
    </div>
  )
}));

vi.mock('../../components/FableResult', () => ({
  default: ({ fableText, images }: any) => (
    <div data-testid="mock-fable-result">
      <div data-testid="fable-text">{fableText}</div>
      <div data-testid="images-count">{images.length}</div>
    </div>
  )
}));

describe('HomePage', () => {
  it('renders FableForm and empty FableResult initially', () => {
    // given
    render(<HomePage />);
    
    // then
    expect(screen.getByTestId('mock-fable-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fable-result')).toBeInTheDocument();
    expect(screen.getByTestId('fable-text').textContent).toBe('');
    expect(screen.getByTestId('images-count').textContent).toBe('0');
  });

  it('updates FableResult when fable is generated', async () => {
    // given
    render(<HomePage />);
    
    // when
    fireEvent.click(screen.getByTestId('trigger-success'));
    
    // then
    expect(screen.getByTestId('fable-text').textContent).toBe('Generated fable text');
    expect(screen.getByTestId('images-count').textContent).toBe('1');
  });

  it('shows error alert when error occurs', async () => {
    // given
    render(<HomePage />);
    
    // when
    fireEvent.click(screen.getByTestId('trigger-error'));
    
    // then
    expect(screen.getByText('Error message')).toBeInTheDocument();
    
    // when - close the alert
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // then
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
  });
}); 