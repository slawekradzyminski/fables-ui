import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FableResult from '../FableResult';

describe('FableResult', () => {
  it('renders nothing when no fable text is provided', () => {
    // given
    render(<FableResult fableText="" images={[]} />);
    
    // then
    expect(screen.queryByText('Your Magical Fable')).not.toBeInTheDocument();
  });

  it('renders fable text and images when provided', () => {
    // given
    const fableText = 'Once upon a time in a magical forest...';
    const images = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
    
    // when
    render(<FableResult fableText={fableText} images={images} />);
    
    // then
    expect(screen.getByText('Your Magical Fable')).toBeInTheDocument();
    expect(screen.getByText(fableText)).toBeInTheDocument();
    
    const imageElements = screen.getAllByRole('img');
    expect(imageElements).toHaveLength(2);
    expect(imageElements[0]).toHaveAttribute('src', images[0]);
    expect(imageElements[1]).toHaveAttribute('src', images[1]);
    
    expect(screen.getByText('Illustration 1')).toBeInTheDocument();
    expect(screen.getByText('Illustration 2')).toBeInTheDocument();
  });
}); 