import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('centers content horizontally', () => {
    // given
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    // when
    const centeredContainer = screen.getByTestId('centered-container');
    
    // then
    const containerStyles = window.getComputedStyle(centeredContainer);
    expect(containerStyles.display).toBe('flex');
    expect(containerStyles.flexDirection).toBe('column');
    expect(containerStyles.alignItems).toBe('center');
  });
}); 