"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
const converter_1 = require("./converter");
const minimatch_1 = require("minimatch");
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
    include: ['**/*.css', '**/*.scss', '**/*.less', '**/*.styl', '**/*.stylus', '**/*.sass', '**/*.vue'],
    exclude: [
        '**/*.min.css', '**/*.min.scss', '**/*.min.less', '**/*.min.styl', '**/*.min.stylus', '**/*.min.sass',
        '**/*.min.vue', '**/*.min.js', '**/*.min.ts', '**/*.min.tsx', '**/*.min.jsx', '**/*.min.json', '**/*.min.html',
        '**/*.min.md', '**/*.min.txt', '**/*.min.xml', '**/*.min.yaml', '**/*.min.yml', '**/*.min.toml', '**/*.min.ini',
        '**/*.min.conf', '**/*.min.config', '**/*.min.properties', '**/*.min.env', '**/*.min.env.local', '**/*.min.env.development',
        '**/*.min.env.production', '**/*.min.env.test', 'node_modules/**/*'
    ],
    enabled: true,
};
// ----------------------Helper Functions ----------------------
const pxRegex = /"([^"]+)"|'([^']+)'|url\([^)]+\)|(\d*\.?\d+)px/g;
const isPropMatch = (prop, properties) => {
    return properties.some(propertie => {
        // 处理不同的通配符模式
        if (propertie === '*') {
            // 完全通配，匹配所有属性
            return true;
        }
        else if (propertie.startsWith('*')) {
            // 后缀匹配：*-size 匹配 font-size, grid-size 等
            const suffix = propertie.slice(1);
            return prop.endsWith(suffix);
        }
        else if (propertie.endsWith('*')) {
            // 前缀匹配：font* 匹配 font, font-size, font-weight 等
            const prefix = propertie.slice(0, -1);
            return prop.startsWith(prefix);
        }
        else if (propertie.includes('*')) {
            // 中间匹配：margin-*-size 匹配 margin-top-size, margin-bottom-size 等
            const [prefix, ...rest] = propertie.split('*');
            const suffix = rest.join('*');
            return prop.startsWith(prefix) && prop.endsWith(suffix);
        }
        else {
            // 精确匹配：完全相等
            return prop === propertie;
        }
    });
};
// ----------------------Post CSS Plugin ----------------------
const Plugin = (options = { mode: 'rem' }) => {
    const opts = { ...exports.defaultOptions, ...options };
    return {
        postcssPlugin: 'px-morph',
        Once(root, { result }) {
            var _a, _b;
            // 获取文件路径
            const filePath = (_b = (_a = root.source) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.file;
            if (!filePath)
                return;
            // 不在包含中与在排除中，则都不转换
            if (opts.include && !opts.include.some(pattern => (0, minimatch_1.minimatch)(filePath, pattern)))
                return;
            if (opts.exclude && opts.exclude.some(pattern => (0, minimatch_1.minimatch)(filePath, pattern)))
                return;
            // 转换开始了
            root.walkDecls(decl => {
                // 判断是否包含px
                if (!decl.value.includes('px'))
                    return;
                const newValue = decl.value.replace(pxRegex, (match, str1, str2, px) => {
                    // 如果匹配到的是引号中的内容、url() 或 px 值为空，则忽略
                    if (str1 || str2 || !px)
                        return match;
                    const pxValue = parseFloat(px);
                    if (pxValue < opts.minPixelValue)
                        return match;
                    let unit;
                    if (opts.mode === 'hybrid' && opts.hybridOptions) {
                        // 默认情况，或者没有书写的属性，都会转换为rem
                        let unitType = opts.hybridOptions.defaultMode || 'rem';
                        // 如果属性在vwProperties中，则转换为vw
                        if (isPropMatch(decl.prop, opts.hybridOptions.vwProperties || [])) {
                            unitType = 'vw';
                        }
                        // 如果属性在remProperties中，则转换为rem
                        if (isPropMatch(decl.prop, opts.hybridOptions.remProperties || [])) {
                            unitType = 'rem';
                        }
                        unit = unitType;
                    }
                    else {
                        unit = opts.mode;
                    }
                    if (unit === 'rem') {
                        return (0, converter_1.pxToRem)(pxValue, opts.rootValue, opts.unitPrecision);
                    }
                    else { // vw
                        return (0, converter_1.pxToVw)(pxValue, opts.viewportWidth, opts.unitPrecision);
                    }
                });
                // 如果转换后的值与原值不同，则替换
                if (newValue !== decl.value) {
                    decl.value = newValue;
                }
            });
        }
    };
};
exports.default = Plugin;
// 兼容让插件在 require('postcss-postcss-px-morph') 中使用
module.exports = Plugin;
module.exports.default = Plugin;
