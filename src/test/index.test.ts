// src/index.test.ts
import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import pxMorphPlugin from '../../dist/index.js';
// import pxMorphPlugin from '../index.js';

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

  it('应该忽略 px-ignore 的值', async ()=>{
    const input  = '.test { font-size: 24px; margin: 32px; /*px-ignore*/ }'
    const expected = '.test { font-size: 1.5rem; margin: 32px; /*px-ignore*/ }'
    const result = await run(input, { mode: 'rem', rootValue: 16 })
    expect(result).toBe(expected)
  })

  it('应该处理无效配置选项', async () => {
    const input = '.test { font-size: 16px; }';
    
    // 测试无效rootValue - 应该使用默认值
    const result1 = await run(input, { mode: 'rem', rootValue: 0 });
    expect(result1).toBe('.test { font-size: 1rem; }');
    
    // 测试无效viewportWidth - 应该使用默认值
    const result2 = await run(input, { mode: 'vw', viewportWidth: -1 });
    expect(result2).toBe('.test { font-size: 4.26667vw; }');
    
    // 测试无效unitPrecision - 应该使用修正值
    const result3 = await run(input, { mode: 'rem', unitPrecision: -1 });
    expect(result3).toBe('.test { font-size: 1rem; }');
    
    // 测试无效mode - 应该使用默认值
    const result4 = await run(input, { mode: 'invalid' as any });
    expect(result4).toBe('.test { font-size: 1rem; }');
  });

  it('应该处理边界情况', async () => {
    const input = '.test { font-size: 16px; }';
    
    // 测试非常大的值
    const result1 = await run(input, { mode: 'rem', rootValue: 16, unitPrecision: 20 });
    expect(result1).toBe('.test { font-size: 1rem; }');
    
    // 测试非常小的值
    const result2 = await run(input, { mode: 'rem', rootValue: 16, minPixelValue: 0.0001 });
    expect(result2).toBe('.test { font-size: 1rem; }');
  });

  // 判断是否开启了负值的转化
  it('应该拒绝负值px', async () => {
    const input = '.test { margin: -16px; }';
    const result = await run(input, { mode: 'rem', rootValue: 16, minusPxToMinusMode: false });
    expect(result).toBe('.test { margin: -16px; }'); // 负值不转换
  });

  it('应该处理负值px', async () => {
    const input = '.test { margin: -16px; }';
    const result = await run(input, { mode: 'rem', rootValue: 16, minusPxToMinusMode: true });
    expect(result).toBe('.test { margin: -1rem; }'); // 负值不转换
  });
});