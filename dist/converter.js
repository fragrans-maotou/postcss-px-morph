"use strict";
// src/converter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.pxToRem = pxToRem;
exports.pxToVw = pxToVw;
/**
 * 将 px 值转换为 rem 值
 * @param pxValue - 需要转换的 px 值 (纯数字)
 * @param rootValue - 根元素的字体大小 (设计稿基准值)
 * @param unitPrecision - 转换后的小数精度
 * @returns 转换后的 rem 字符串，例如 "1.5rem"
 */
function pxToRem(pxValue, rootValue, unitPrecision) {
    if (!Number.isFinite(pxValue) || !Number.isFinite(rootValue) || !Number.isFinite(unitPrecision)) {
        return '0';
    }
    if (rootValue <= 0) {
        rootValue = 16; // 使用安全默认值
    }
    if (unitPrecision < 0 || unitPrecision > 20) {
        unitPrecision = 5; // 使用安全默认值
        throw new Error('Invalid unitPrecision: must be between 0 and 20');
    }
    if (pxValue === 0)
        return '0';
    const remValue = parseFloat((pxValue / rootValue).toFixed(unitPrecision));
    if (!Number.isFinite(remValue)) {
        throw new Error('Invalid conversion result: overflow or underflow detected');
    }
    return `${remValue}rem`;
}
/**
 * 将 px 值转换为 vw 值
 * @param pxValue - 需要转换的 px 值 (纯数字)
 * @param viewportWidth - 视口宽度 (设计稿宽度)
 * @param unitPrecision - 转换后的小数精度
 * @returns 转换后的 vw 字符串，例如 "10.66667vw"
 */
function pxToVw(pxValue, viewportWidth, unitPrecision) {
    if (!Number.isFinite(pxValue) || !Number.isFinite(viewportWidth) || !Number.isFinite(unitPrecision)) {
        return '0';
    }
    if (viewportWidth <= 0) {
        return '0';
    }
    if (unitPrecision < 0 || unitPrecision > 20) {
        throw new Error('Invalid unitPrecision: must be between 0 and 20');
    }
    if (pxValue === 0)
        return '0';
    const vwValue = parseFloat(((pxValue / viewportWidth) * 100).toFixed(unitPrecision));
    if (!Number.isFinite(vwValue)) {
        throw new Error('Invalid conversion result: overflow or underflow detected');
    }
    return `${vwValue}vw`;
}
