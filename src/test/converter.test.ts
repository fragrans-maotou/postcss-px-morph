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
});