import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import pxMorphPlugin from '../index';

async function run(input: string, opts: any) {
  const { css } = await postcss([pxMorphPlugin(opts)]).process(input, { from: 'test.css' });
  return css;
}

describe('Media Query Support', () => {
  it('should not convert inside media queries by default', async () => {
    const input = '@media (max-width: 600px) { .test { font-size: 16px; } } .test { font-size: 16px; }';
    const expected = '@media (max-width: 600px) { .test { font-size: 16px; } } .test { font-size: 1rem; }';
    const result = await run(input, { mode: 'rem', rootValue: 16 });
    expect(result).toBe(expected);
  });

  it('should convert inside media queries when enabled', async () => {
    const input = '@media (max-width: 600px) { .test { font-size: 16px; } }';
    const expected = '@media (max-width: 600px) { .test { font-size: 1rem; } }';
    const result = await run(input, {
      mode: 'rem',
      rootValue: 16,
      mediaQuery: true
    });
    expect(result).toBe(expected);
  });
});
