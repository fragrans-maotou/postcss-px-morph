import type { Plugin } from 'postcss';
export type PxMorphMode = 'rem' | 'vw' | 'hybrid';
export type PxMorphHybridMode = 'rem' | 'vw';
export interface PxMorphOptions {
    /** 转换模式： 'rem' | 'vw' | 'hybrid' */
    mode: PxMorphMode;
    /** 根元素的字体大小 (设计稿基准值) */
    rootValue?: number;
    /** 视口宽度 (设计稿宽度) */
    viewportWidth?: number;
    /** 转换后的小数精度 */
    unitPrecision?: number;
    /**触发转换的最小像素值 */
    minPixelValue?: number;
    /** 是否开启负值的转化 */
    minusPxToMinusMode?: boolean;
    /**
     * 'hybrid' 模式下，指定哪些属性转换为rem，哪些转换为vw
     * 支持通配符 '*', 例如 'font-*' 会匹配 'font-size', 'font-weight' 等
     *  默认情况，或者没有书写的属性，支持用户自定义
     */
    hybridOptions?: {
        /** 默认转换模式 , 混合模式下，指定哪些属性转换为rem，哪些转换为vw,剩下的属性配置转换模式 */
        defaultMode?: PxMorphHybridMode;
        /** 转换为rem的属性 */
        remProperties?: string[];
        /** 转换为vw的属性 */
        vwProperties?: string[];
    };
    /** 需要包含的文件，支持正则表达式 */
    include?: string[];
    /** 需要排除的文件，支持正则表达式 */
    exclude?: string[];
    /** 是否启用转换 */
    enabled?: boolean;
}
export declare const defaultOptions: Required<PxMorphOptions>;
declare const Plugin: (options?: PxMorphOptions) => Plugin;
export default Plugin;
