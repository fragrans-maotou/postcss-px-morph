"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = exports.defaultOptions = void 0;
exports.defaultOptions = {
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
    minusPxToMinusMode: true,
    include: ['**/*.css', '**/*.scss', '**/*.less', '**/*.styl', '**/*.stylus', '**/*.sass', '**/*.vue'],
    exclude: [
        '**/*.min.css', '**/*.min.scss', '**/*.min.less', '**/*.min.styl', '**/*.min.stylus', '**/*.min.sass',
        '**/*.min.vue', '**/*.min.js', '**/*.min.ts', '**/*.min.tsx', '**/*.min.jsx', '**/*.min.json', '**/*.min.html',
        '**/*.min.md', '**/*.min.txt', '**/*.min.xml', '**/*.min.yaml', '**/*.min.yml', '**/*.min.toml', '**/*.min.ini',
        '**/*.min.conf', '**/*.min.config', '**/*.min.properties', '**/*.min.env', '**/*.min.env.local', '**/*.min.env.development',
        '**/*.min.env.production', '**/*.min.env.test', 'node_modules/**/*'
    ],
    selectorBlackList: [],
    mediaQuery: false,
    enabled: true,
};
const validateOptions = (options) => {
    const opts = { ...exports.defaultOptions, ...options };
    // 验证数值参数 - 使用默认值或修正值
    if (!Number.isFinite(opts.rootValue) || opts.rootValue <= 0) {
        opts.rootValue = 16; // 使用默认值
    }
    if (!Number.isFinite(opts.viewportWidth) || opts.viewportWidth <= 0) {
        opts.viewportWidth = 375; // 使用默认值
    }
    if (!Number.isFinite(opts.unitPrecision) || opts.unitPrecision < 0 || opts.unitPrecision > 20) {
        opts.unitPrecision = Math.max(0, Math.min(20, Math.round(opts.unitPrecision || 5)));
    }
    if (!Number.isFinite(opts.minPixelValue) || opts.minPixelValue < 0) {
        opts.minPixelValue = 1; // 使用默认值
    }
    // 验证mode - 使用默认值
    if (!['rem', 'vw', 'hybrid'].includes(opts.mode)) {
        opts.mode = 'rem';
    }
    // 验证hybridOptions - 清理无效值
    if (opts.hybridOptions) {
        if (opts.hybridOptions.defaultMode && !['rem', 'vw'].includes(opts.hybridOptions.defaultMode)) {
            opts.hybridOptions.defaultMode = 'rem';
        }
        // 清理属性数组
        const sanitizePropertyArray = (arr) => {
            if (!Array.isArray(arr))
                return [];
            return arr.filter(item => typeof item === 'string' && item.length > 0).slice(0, 100); // 限制数组大小
        };
        opts.hybridOptions.remProperties = sanitizePropertyArray(opts.hybridOptions.remProperties);
        opts.hybridOptions.vwProperties = sanitizePropertyArray(opts.hybridOptions.vwProperties);
    }
    else {
        opts.hybridOptions = exports.defaultOptions.hybridOptions;
    }
    // 清理include/exclude数组
    const sanitizePatternArray = (arr) => {
        if (!Array.isArray(arr))
            return [];
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
    return opts;
};
exports.validateOptions = validateOptions;
