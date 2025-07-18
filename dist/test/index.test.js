"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.test.ts
const vitest_1 = require("vitest");
const postcss_1 = __importDefault(require("postcss"));
const index_1 = __importDefault(require("../index")); // 我们的插件
async function run(input, opts) {
    const { css } = await (0, postcss_1.default)([(0, index_1.default)(opts)]).process(input, { from: undefined });
    return css;
}
(0, vitest_1.describe)('PostCSS PxMorph Plugin', () => {
    (0, vitest_1.it)('应该在 "rem" 模式下正确工作', async () => {
        const input = '.test { font-size: 16px; margin: 32px; }';
        const expected = '.test { font-size: 1rem; margin: 2rem; }';
        const result = await run(input, { mode: 'rem', rootValue: 16 });
        (0, vitest_1.expect)(result).toBe(expected);
    });
    (0, vitest_1.it)('应该在 "vw" 模式下正确工作', async () => {
        const input = '.test { width: 375px; padding: 37.5px; }';
        const expected = '.test { width: 100vw; padding: 10vw; }';
        const result = await run(input, { mode: 'vw', viewportWidth: 375 });
        (0, vitest_1.expect)(result).toBe(expected);
    });
    (0, vitest_1.it)('应该在 "hybrid" 模式下正确工作', async () => {
        const input = '.test { font-size: 16px; width: 37.5px; border-width: 4px; }';
        const expected = '.test { font-size: 1rem; width: 10vw; border-width: 1vw; }';
        const result = await run(input, {
            mode: 'hybrid',
            rootValue: 16,
            viewportWidth: 375,
            hybridOptions: {
                defaultMode: 'vw',
                remProperties: ['font-size'],
            }
        });
        (0, vitest_1.expect)(result).toBe(expected);
    });
    (0, vitest_1.it)('应该忽略小于 minPixelValue 的值', async () => {
        const input = '.test { border: 1px solid black; padding: 2px; }';
        const expected = '.test { border: 1px solid black; padding: 0.125rem; }';
        const result = await run(input, { mode: 'rem', rootValue: 16, minPixelValue: 2 });
        (0, vitest_1.expect)(result).toBe(expected);
    });
});
