"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSelectorBlackList = exports.isMinusPx = exports.isPxIgnore = exports.isPropMatch = exports.sanitizeProperty = exports.pxRegex = void 0;
// 正则表达式用于匹配 px 值
exports.pxRegex = /"([^"\n]*)"|'([^'\n]*)'|url\([^)\n]*\)|(\d*\.?\d+)px/g;
/**
 * 限制属性名长度，防止ReDoS
 */
const sanitizeProperty = (prop) => {
    const MAX_LENGTH = 100;
    if (prop.length > MAX_LENGTH) {
        return prop.substring(0, MAX_LENGTH);
    }
    // 只允许字母、数字、连字符和下划线
    return prop.replace(/[^a-zA-Z0-9-_]/g, '');
};
exports.sanitizeProperty = sanitizeProperty;
/**
 * 检查属性是否匹配给定的模式列表
 */
const isPropMatch = (prop, properties) => {
    if (!prop || typeof prop !== 'string')
        return false;
    const sanitizedProp = (0, exports.sanitizeProperty)(prop.toLowerCase());
    if (!sanitizedProp)
        return false;
    return properties.some(pattern => {
        if (!pattern || typeof pattern !== 'string')
            return false;
        const sanitizedPattern = (0, exports.sanitizeProperty)(pattern.toLowerCase());
        if (!sanitizedPattern)
            return false;
        if (sanitizedPattern === '*') {
            return true;
        }
        // 限制通配符使用，防止复杂模式
        const wildcardCount = (sanitizedPattern.match(/\*/g) || []).length;
        if (wildcardCount > 2)
            return false; // 最多允许2个通配符
        if (sanitizedPattern.startsWith('*') && sanitizedPattern.endsWith('*')) {
            // *middle* 模式
            const middle = sanitizedPattern.slice(1, -1);
            return sanitizedProp.includes(middle);
        }
        else if (sanitizedPattern.startsWith('*')) {
            // *suffix 模式
            const suffix = sanitizedPattern.slice(1);
            return sanitizedProp.endsWith(suffix);
        }
        else if (sanitizedPattern.endsWith('*')) {
            // prefix* 模式
            const prefix = sanitizedPattern.slice(0, -1);
            return sanitizedProp.startsWith(prefix);
        }
        else if (sanitizedPattern.includes('*')) {
            // prefix*suffix 模式
            const parts = sanitizedPattern.split('*');
            if (parts.length === 2) {
                const [prefix, suffix] = parts;
                return sanitizedProp.startsWith(prefix) && sanitizedProp.endsWith(suffix);
            }
        }
        // 精确匹配
        return sanitizedProp === sanitizedPattern;
    });
};
exports.isPropMatch = isPropMatch;
/**
 * 检查是否包含 px-ignore 注释
 */
const isPxIgnore = (decl) => {
    var _a;
    const comment = decl.next();
    if ((comment === null || comment === void 0 ? void 0 : comment.type) === 'comment') {
        return (_a = comment.text) === null || _a === void 0 ? void 0 : _a.includes('px-ignore');
    }
    return false;
};
exports.isPxIgnore = isPxIgnore;
/**
 * 检查是否是负值 px
 */
const isMinusPx = (decl) => {
    // 1. 如果整个值就是一个负长度，例如 "-16px"
    // 2. 如果里面出现了独立的负长度，例如 "-16px 0 0 -8px"
    // 3. 但放过 calc(...) 里的减号
    const hasNegativeToken = /(^|[^\w.)])-\d+(?:\.\d+)?px($|[^\w(])/i.test(decl.value);
    if (hasNegativeToken) {
        return true;
    }
    return false;
};
exports.isMinusPx = isMinusPx;
/**
 * 检查选择器是否在黑名单中
 */
const checkSelectorBlackList = (selector, blacklist) => {
    if (!selector || !blacklist || blacklist.length === 0)
        return false;
    return blacklist.some(rule => {
        if (typeof rule === 'string') {
            return selector.includes(rule);
        }
        else if (rule instanceof RegExp) {
            return rule.test(selector);
        }
        return false;
    });
};
exports.checkSelectorBlackList = checkSelectorBlackList;
