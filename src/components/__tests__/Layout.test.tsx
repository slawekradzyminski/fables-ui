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
    const parentContainer = screen.getByTestId('parent-container');
    
    // then
    // Inner container should be centered with maxWidth and auto margins
    const containerStyles = window.getComputedStyle(centeredContainer);
    expect(containerStyles.maxWidth).toBe('600px');
    expect(containerStyles.marginLeft).toBe('auto');
    expect(containerStyles.marginRight).toBe('auto');
    expect(containerStyles.width).toBe('100%');
    
    // MUI Container handles centering automatically when maxWidth is provided
    const parentStyles = window.getComputedStyle(parentContainer);
    expect(parentStyles.width).toBe('100%');
    
    // Check that the parent container has proper padding
    expect(parentStyles.paddingLeft).not.toBe('0px');
    expect(parentStyles.paddingRight).not.toBe('0px');
  });
}); 