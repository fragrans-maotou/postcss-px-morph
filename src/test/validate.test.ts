import { describe, it, expect } from 'vitest';
import { validateOptions, defaultOptions } from '../utils/validate';

describe('validateOptions', () => {
  it('should return default options for empty input', () => {
    const options = validateOptions({} as any);
    expect(options).toEqual(defaultOptions);
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
});
