/**
 * 将 px 值转换为 rem 值
 * @param pxValue - 需要转换的 px 值 (纯数字)
 * @param rootValue - 根元素的字体大小 (设计稿基准值)
 * @param unitPrecision - 转换后的小数精度
 * @returns 转换后的 rem 字符串，例如 "1.5rem"
 */
export declare function pxToRem(pxValue: number, rootValue: number, unitPrecision: number): string;
/**
 * 将 px 值转换为 vw 值
 * @param pxValue - 需要转换的 px 值 (纯数字)
 * @param viewportWidth - 视口宽度 (设计稿宽度)
 * @param unitPrecision - 转换后的小数精度
 * @returns 转换后的 vw 字符串，例如 "10.66667vw"
 */
export declare function pxToVw(pxValue: number, viewportWidth: number, unitPrecision: number): string;
