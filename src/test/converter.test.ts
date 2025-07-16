// src/converter.test.ts
import { describe, it, expect } from 'vitest';
import { pxToRem, pxToVw } from '../converter.js';

describe('pxToRem', () => {
  it('应该正确转换正整数', () => {
    expect(pxToRem(16, 16, 5)).toBe('1rem');
  });

  it('应该正确处理小数值和精度', () => {
    expect(pxToRem(24, 16, 5)).toBe('1.5rem');
    expect(pxToRem(19, 16, 5)).toBe('1.1875rem');
  });

  it('应该正确处理0值', () => {
    expect(pxToRem(0, 16, 5)).toBe('0');
  });

  it('应该处理负值px', () => {
    expect(pxToRem(-16, 16, 5)).toBe('-1rem');
  });

  it('应该处理无效输入', () => {
    expect(pxToRem(NaN, 16, 5)).toBe('0');
    expect(pxToRem(16, 0, 5)).toBe('1rem');
    expect(() => pxToRem(16, 16, -1)).toThrow('Invalid unitPrecision: must be between 0 and 20');
    expect(() => pxToRem(16, 16, 21)).toThrow('Invalid unitPrecision: must be between 0 and 20');
  });
});

describe('pxToVw', () => {
  it('应该正确转换正整数', () => {
    expect(pxToVw(375, 375, 5)).toBe('100vw');
  });

  it('应该正确处理小数值和精度', () => {
    expect(pxToVw(37.5, 375, 5)).toBe('10vw');
    expect(pxToVw(16, 375, 5)).toBe('4.26667vw');
  });

  it('应该正确处理0值', () => {
    expect(pxToVw(0, 375, 5)).toBe('0');
  });

  it('应该处理负值px', () => {
    expect(pxToVw(-37.5, 375, 5)).toBe('-10vw');
  });

  it('应该处理无效输入', () => {
    expect(pxToVw(NaN, 375, 5)).toBe('0');
    expect(pxToVw(375, 0, 5)).toBe('0');
    expect(() => pxToVw(375, 375, -1)).toThrow('Invalid unitPrecision');
    expect(() => pxToVw(375, 375, 21)).toThrow('Invalid unitPrecision');
  });
});