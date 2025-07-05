// src/index.test.ts
import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import pxMorphPlugin from '../index.js'; // 我们的插件

async function run(input: string, opts: any) {
  const { css } = await postcss([pxMorphPlugin(opts)]).process(input, { from: 'test.css' });
  return css;
}

describe('PostCSS PxMorph Plugin', () => {
  it('应该在 "rem" 模式下正确工作', async () => {
    const input = '.test { font-size: 16px; margin: 32px; }';
    const expected = '.test { font-size: 1rem; margin: 2rem; }';
    const result = await run(input, { mode: 'rem', rootValue: 16 });
    expect(result).toBe(expected);
  });

  it('应该在 "vw" 模式下正确工作', async () => {
    const input = '.test { width: 375px; padding: 37.5px; }';
    const expected = '.test { width: 100vw; padding: 10vw; }';
    const result = await run(input, { mode: 'vw', viewportWidth: 375 });
    expect(result).toBe(expected);
  });

  it('应该在 "hybrid" 模式下正确工作', async () => {
    const input = '.test { font-size: 16px; width: 37.5px; border-width: 4px; }';
    const expected = '.test { font-size: 1rem; width: 10vw; border-width: 1vw; }';
    const result = await run(input, {
      mode: 'hybrid',
      rootValue: 16,
      viewportWidth: 375,
      unitPrecision: 0,
      hybridOptions: {
        defaultMode: 'vw',
        remProperties: ['font-size'],
      }
    });
    expect(result).toBe(expected);
  });

  it('应该忽略小于 minPixelValue 的值', async () => {
    const input = '.test { border: 1px solid black; padding: 2px; }';
    const expected = '.test { border: 1px solid black; padding: 0.125rem; }';
    const result = await run(input, { mode: 'rem', rootValue: 16, minPixelValue: 2 });
    expect(result).toBe(expected);
  });
});