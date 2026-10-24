import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateOptions, defaultOptions } from '../utils/validate';

describe('validateOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return default options for empty input', () => {
    const options = validateOptions({} as any);
    expect(options).toEqual(defaultOptions);
  });

  it('should keep tightened exclude defaults (1.0.4)', () => {
    expect(defaultOptions.exclude).toEqual([
      '**/*.min.css',
      '**/*.min.scss',
      '**/*.min.less',
      '**/*.min.styl',
      '**/*.min.stylus',
      '**/*.min.sass',
      '**/*.min.vue',
      'node_modules/**/*',
    ]);
    expect(defaultOptions.exclude.some((p) => p.includes('.min.js'))).toBe(false);
  });

  it('should correct invalid numeric values', () => {
    const options = validateOptions({
      mode: 'rem',
      rootValue: -10,
      viewportWidth: 0,
      unitPrecision: 100,
      minPixelValue: -5
    });

    expect(options.rootValue).toBe(16);
    expect(options.viewportWidth).toBe(375);
    expect(options.unitPrecision).toBe(20);
    expect(options.minPixelValue).toBe(1);
  });

  it('should validate hybrid options', () => {
    const options = validateOptions({
      mode: 'hybrid',
      hybridOptions: {
        defaultMode: 'invalid' as any,
        remProperties: ['font-size', 123 as any],
        vwProperties: undefined
      }
    });

    expect(options.hybridOptions.defaultMode).toBe('rem');
    expect(options.hybridOptions.remProperties).toEqual(['font-size']);
    expect(options.hybridOptions.vwProperties).toEqual([]);
  });

  it('should prefer convertNegative over minusPxToMinusMode', () => {
    const options = validateOptions({
      mode: 'rem',
      convertNegative: false,
    } as any);
    expect(options.convertNegative).toBe(false);
    expect(options.minusPxToMinusMode).toBe(false);
  });

  it('should fall back to minusPxToMinusMode when convertNegative omitted', () => {
    const options = validateOptions({
      mode: 'rem',
      minusPxToMinusMode: false,
    } as any);
    expect(options.convertNegative).toBe(false);
    expect(options.minusPxToMinusMode).toBe(false);
  });

  it('should warn once when both aliases conflict', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const options = validateOptions({
      mode: 'rem',
      convertNegative: false,
      minusPxToMinusMode: true,
    } as any);
    expect(options.convertNegative).toBe(false);
    expect(options.minusPxToMinusMode).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
