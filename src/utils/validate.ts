import { PxMorphOptions } from '../types'

export const defaultOptions: Required<PxMorphOptions> = {
  mode: 'rem',
  rootValue: 16,
  viewportWidth: 375,
  unitPrecision: 5,
  minPixelValue: 1,
  hybridOptions: {
    defaultMode: 'rem',
    remProperties: [],
    vwProperties: [],
  },
  convertNegative: true,
  minusPxToMinusMode: true,
  include: ['**/*.css', '**/*.scss', '**/*.less', '**/*.styl', '**/*.stylus', '**/*.sass', '**/*.vue'],
  // 1.0.4：仅保留样式相关噪音 + node_modules（PostCSS 碰不到的 *.min.js/ts/env 等已移除）
  exclude: [
    '**/*.min.css',
    '**/*.min.scss',
    '**/*.min.less',
    '**/*.min.styl',
    '**/*.min.stylus',
    '**/*.min.sass',
    '**/*.min.vue',
    'node_modules/**/*',
  ],
  selectorBlackList: [],
  mediaQuery: false,
  enabled: true,
}

export const validateOptions = (options: PxMorphOptions): Required<PxMorphOptions> => {
  const opts = { ...defaultOptions, ...options };

  // 验证数值参数 - 使用默认值或修正值
  if (!Number.isFinite(opts.rootValue) || opts.rootValue! <= 0) {
    opts.rootValue = 16; // 使用默认值
  }
  if (!Number.isFinite(opts.viewportWidth) || opts.viewportWidth! <= 0) {
    opts.viewportWidth = 375; // 使用默认值
  }
  if (!Number.isFinite(opts.unitPrecision) || opts.unitPrecision! < 0 || opts.unitPrecision! > 20) {
    opts.unitPrecision = Math.max(0, Math.min(20, Math.round(opts.unitPrecision || 5)));
  }
  if (!Number.isFinite(opts.minPixelValue) || opts.minPixelValue! < 0) {
    opts.minPixelValue = 1; // 使用默认值
  }

  // 验证mode - 使用默认值
  if (!['rem', 'vw', 'hybrid'].includes(opts.mode)) {
    opts.mode = 'rem';
  }

  // convertNegative 优先；兼容旧名 minusPxToMinusMode
  const hasConvertNegative = Object.prototype.hasOwnProperty.call(options, 'convertNegative');
  const hasMinusPxToMinusMode = Object.prototype.hasOwnProperty.call(options, 'minusPxToMinusMode');

  if (
    hasConvertNegative &&
    hasMinusPxToMinusMode &&
    options.convertNegative !== options.minusPxToMinusMode
  ) {
    console.warn(
      '[postcss-px-morph] Both convertNegative and minusPxToMinusMode were set and differ; convertNegative takes precedence.'
    );
  }

  const effectiveConvertNegative = hasConvertNegative
    ? Boolean(options.convertNegative)
    : hasMinusPxToMinusMode
      ? Boolean(options.minusPxToMinusMode)
      : true;

  opts.convertNegative = effectiveConvertNegative;
  opts.minusPxToMinusMode = effectiveConvertNegative;

  // 验证hybridOptions - 清理无效值
  if (opts.hybridOptions) {
    if (opts.hybridOptions.defaultMode && !['rem', 'vw'].includes(opts.hybridOptions.defaultMode)) {
      opts.hybridOptions.defaultMode = 'rem';
    }

    // 清理属性数组
    const sanitizePropertyArray = (arr: string[] | undefined): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr.filter(item => typeof item === 'string' && item.length > 0).slice(0, 100); // 限制数组大小
    };

    opts.hybridOptions.remProperties = sanitizePropertyArray(opts.hybridOptions.remProperties);
    opts.hybridOptions.vwProperties = sanitizePropertyArray(opts.hybridOptions.vwProperties);
  } else {
    opts.hybridOptions = defaultOptions.hybridOptions;
  }

  // 清理include/exclude数组
  const sanitizePatternArray = (arr: string[] | undefined): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => typeof item === 'string' && item.length > 0).slice(0, 100); // 限制数组大小
  };

  opts.include = sanitizePatternArray(opts.include);
  opts.exclude = sanitizePatternArray(opts.exclude);

  // 验证 selectorBlackList
  if (!Array.isArray(opts.selectorBlackList)) {
    opts.selectorBlackList = [];
  }

  // 验证 mediaQuery
  if (typeof opts.mediaQuery !== 'boolean') {
    opts.mediaQuery = false;
  }

  // 验证 enabled
  if (typeof opts.enabled !== 'boolean') {
    opts.enabled = true;
  }

  return opts as Required<PxMorphOptions>;
};
