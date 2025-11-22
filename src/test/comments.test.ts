import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import pxMorphPlugin from '../index';

async function run(input: string, opts: any) {
  const { css } = await postcss([pxMorphPlugin(opts)]).process(input, { from: 'test.css' });
  return css;
}

describe('Comment Control', () => {
  it('should respect block-level ignore comments', async () => {
    const input = `
      .a { font-size: 16px; }
      /* px-morph-disable */
      .b { font-size: 16px; }
      /* px-morph-enable */
      .c { font-size: 16px; }
    `;
    const expected = `
      .a { font-size: 1rem; }
      /* px-morph-disable */
      .b { font-size: 16px; }
      /* px-morph-enable */
      .c { font-size: 1rem; }
    `;
    const result = await run(input, { mode: 'rem', rootValue: 16 });
    expect(result.replace(/\s+/g, '')).toBe(expected.replace(/\s+/g, ''));
  });
});
