import { Declaration } from 'postcss';
export declare const pxRegex: RegExp;
/**
 * 限制属性名长度，防止 ReDoS；属性名不允许通配符
 */
export declare const sanitizeProperty: (prop: string) => string;
/**
 * 清理通配符模式：保留 *，去掉其它非法字符
 */
export declare const sanitizePattern: (pattern: string) => string;
/**
 * 检查属性是否匹配给定的模式列表
 */
export declare const isPropMatch: (prop: string, properties: string[]) => boolean;
/**
 * 检查是否包含 px-ignore 注释
 */
export declare const isPxIgnore: (decl: Declaration) => boolean;
/**
 * 检查是否是负值 px
 */
export declare const isMinusPx: (decl: Declaration) => boolean;
/**
 * 检查选择器是否在黑名单中
 */
export declare const checkSelectorBlackList: (selector: string, blacklist: (string | RegExp)[]) => boolean;
