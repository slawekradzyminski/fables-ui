import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FableResult from '../FableResult';
import { IllustrationResponse } from '../../api/fablesApi';

describe('FableResult', () => {
  it('renders nothing when no fable text is provided', () => {
    // given
    render(<FableResult fableText="" moral="" illustrations={[]} />);
    
    // then
    expect(screen.queryByText('Your Magical Fable')).not.toBeInTheDocument();
  });

  it('renders fable text, interleaved images, and moral when provided', () => {
    // given
    const fableText = 'Paragraph one.\n\nParagraph two.';
    const moral = 'The moral is to be kind.';
    const illustrations: IllustrationResponse[] = [
      { prompt: 'A kind fox', image: 'base64_fox_image' },
      { prompt: 'A sharing bear', image: 'base64_bear_image' },
    ];
    
    // when
    render(<FableResult fableText={fableText} moral={moral} illustrations={illustrations} />);
    
    // then
    expect(screen.getByText('Your Magical Fable')).toBeInTheDocument();
    expect(screen.getByText('Moral of the Story')).toBeInTheDocument();
    expect(screen.getByText(moral)).toBeInTheDocument();

    expect(screen.getByText('Paragraph one.')).toBeInTheDocument();
    expect(screen.getByText('Paragraph two.')).toBeInTheDocument();
    
    const imageElements = screen.getAllByRole('img');
    expect(imageElements).toHaveLength(illustrations.length);
    expect(screen.getByAltText('A kind fox')).toBeInTheDocument();
    expect(screen.getByAltText('A sharing bear')).toBeInTheDocument();

    expect(screen.getByAltText('A kind fox')).toHaveAttribute('src', `data:image/png;base64,${illustrations[0].image}`);
    expect(screen.getByAltText('A sharing bear')).toHaveAttribute('src', `data:image/png;base64,${illustrations[1].image}`);

    expect(screen.queryByText('Illustration 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Story Illustrations')).not.toBeInTheDocument();
  });

  it('renders correctly when no illustrations are provided', () => {
    // given
    const fableText = 'Just a story, no pictures.';
    const moral = 'Pictures are not required.';
    const illustrations: IllustrationResponse[] = [];
    
    // when
    render(<FableResult fableText={fableText} moral={moral} illustrations={illustrations} />);
    
    // then
    expect(screen.getByText('Your Magical Fable')).toBeInTheDocument();
    expect(screen.getByText(fableText)).toBeInTheDocument();
    expect(screen.getByText('Moral of the Story')).toBeInTheDocument();
    expect(screen.getByText(moral)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders correctly when no moral is provided', () => {
    // given
    const fableText = 'A story without a moral.';
    const moral = '';
    const illustrations: IllustrationResponse[] = [
      { prompt: 'A questioning cat', image: 'base64_cat_image' }
    ];
    
    // when
    render(<FableResult fableText={fableText} moral={moral} illustrations={illustrations} />);
    
    // then
    expect(screen.getByText('Your Magical Fable')).toBeInTheDocument();
    expect(screen.getByText(fableText)).toBeInTheDocument();
    expect(screen.queryByText('Moral of the Story')).not.toBeInTheDocument();
    expect(screen.getByAltText('A questioning cat')).toBeInTheDocument();
  });
}); 