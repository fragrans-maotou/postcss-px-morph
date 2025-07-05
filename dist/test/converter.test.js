"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/converter.test.ts
const vitest_1 = require("vitest");
const converter_1 = require("../converter");
(0, vitest_1.describe)('pxToRem', () => {
    (0, vitest_1.it)('应该正确转换正整数', () => {
        (0, vitest_1.expect)((0, converter_1.pxToRem)(16, 16, 5)).toBe('1rem');
    });
    (0, vitest_1.it)('应该正确处理小数值和精度', () => {
        (0, vitest_1.expect)((0, converter_1.pxToRem)(24, 16, 5)).toBe('1.5rem');
        (0, vitest_1.expect)((0, converter_1.pxToRem)(19, 16, 5)).toBe('1.1875rem');
    });
    (0, vitest_1.it)('应该正确处理0值', () => {
        (0, vitest_1.expect)((0, converter_1.pxToRem)(0, 16, 5)).toBe('0');
    });
});
(0, vitest_1.describe)('pxToVw', () => {
    (0, vitest_1.it)('应该正确转换正整数', () => {
        (0, vitest_1.expect)((0, converter_1.pxToVw)(375, 375, 5)).toBe('100vw');
    });
    (0, vitest_1.it)('应该正确处理小数值和精度', () => {
        (0, vitest_1.expect)((0, converter_1.pxToVw)(37.5, 375, 5)).toBe('10vw');
        (0, vitest_1.expect)((0, converter_1.pxToVw)(16, 375, 5)).toBe('4.26667vw');
    });
    (0, vitest_1.it)('应该正确处理0值', () => {
        (0, vitest_1.expect)((0, converter_1.pxToVw)(0, 375, 5)).toBe('0');
    });
});
