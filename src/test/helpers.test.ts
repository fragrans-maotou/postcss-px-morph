import { describe, it, expect } from 'vitest';
import { isPropMatch } from '../utils/helpers';

describe('isPropMatch', () => {
  it('支持 prefix* 通配符', () => {
    expect(isPropMatch('margin-top', ['margin*'])).toBe(true);
    expect(isPropMatch('padding-left', ['padding*'])).toBe(true);
    expect(isPropMatch('font-size', ['font*'])).toBe(true);
    expect(isPropMatch('border-width', ['margin*'])).toBe(false);
  });

  it('支持 *suffix 与 *middle* 通配符', () => {
    expect(isPropMatch('line-height', ['*-height'])).toBe(true);
    expect(isPropMatch('max-width', ['*width*'])).toBe(true);
  });

  it('精确匹配仍可用', () => {
    expect(isPropMatch('width', ['width'])).toBe(true);
    expect(isPropMatch('width', ['height'])).toBe(false);
  });
});
