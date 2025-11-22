import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import pxMorphPlugin from '../index';

async function run(input: string, opts: any) {
  const { css } = await postcss([pxMorphPlugin(opts)]).process(input, { from: 'test.css' });
  return css;
}

describe('Selector Blacklist', () => {
  it('should ignore selectors in blacklist (string match)', async () => {
    const input = '.ignore-me { font-size: 16px; } .convert-me { font-size: 16px; }';
    const expected = '.ignore-me { font-size: 16px; } .convert-me { font-size: 1rem; }';
    const result = await run(input, {
      mode: 'rem',
      rootValue: 16,
      selectorBlackList: ['.ignore-me']
    });
    expect(result).toBe(expected);
  });

  it('should ignore selectors in blacklist (regex match)', async () => {
    const input = '.ignore-1 { width: 100px; } .ignore-2 { width: 100px; } .convert { width: 100px; }';
    const expected = '.ignore-1 { width: 100px; } .ignore-2 { width: 100px; } .convert { width: 6.25rem; }';
    const result = await run(input, {
      mode: 'rem',
      rootValue: 16,
      selectorBlackList: [/^.ignore/]
    });
    expect(result).toBe(expected);
  });

  it('should work with partial string match', async () => {
    const input = '.wrapper .ignore-inner { font-size: 16px; }';
    const expected = '.wrapper .ignore-inner { font-size: 16px; }';
    const result = await run(input, {
      mode: 'rem',
      selectorBlackList: ['ignore']
    });
    expect(result).toBe(expected);
  });
});
