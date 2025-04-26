import { IllustrationResponse } from '../api/fablesApi';

/** Split text into paragraphs by two consecutive newlines. */
function splitText(text: string) {
  return text.trim().split(/\n{2,}/);
}

/**
 * Arrange content such that the first image appears at the beginning,
 * the text (split into paragraphs) in the middle, and any remaining images at the end.
 */
export function interleave(
  text: string,
  illustrations: IllustrationResponse[]
) {
  const paragraphs = splitText(text);
  const result: ({ type: 'text'; value: string } | { type: 'img'; value: IllustrationResponse })[] = [];

  // If there is at least one illustration, put the first one at the beginning
  if (illustrations.length > 0) {
    result.push({ type: 'img', value: illustrations[0] });
  }

  // Append all text paragraphs in order
  paragraphs.forEach(p => {
    result.push({ type: 'text', value: p });
  });

  // Append the remaining illustrations (if any) at the end
  for (let i = 1; i < illustrations.length; i++) {
    result.push({ type: 'img', value: illustrations[i] });
  }

  return result;
} 