import type { Plugin } from 'postcss'
import { pxToRem, pxToVw } from './converter'
import { minimatch } from 'minimatch'

export type PxMorphMode = 'rem' | 'vw' | 'hybrid'
export type PxMorphHybridMode = 'rem' | 'vw'

export interface PxMorphOptions {
  /** 转换模式： 'rem' | 'vw' | 'hybrid' */
  mode: PxMorphMode
  /** 根元素的字体大小 (设计稿基准值) */
  rootValue?: number
  /** 视口宽度 (设计稿宽度) */
  viewportWidth?: number
  /** 转换后的小数精度 */
  unitPrecision?: number
  /**触发转换的最小像素值 */
  minPixelValue?: number
  /** 是否开启负值的转化 */
  minusPxToMinusMode?: boolean
  /**
   * 'hybrid' 模式下，指定哪些属性转换为rem，哪些转换为vw
   * 支持通配符 '*', 例如 'font-*' 会匹配 'font-size', 'font-weight' 等
   *  默认情况，或者没有书写的属性，支持用户自定义
   */
  hybridOptions?: {
    /** 默认转换模式 , 混合模式下，指定哪些属性转换为rem，哪些转换为vw,剩下的属性配置转换模式 */
    defaultMode?: PxMorphHybridMode
    /** 转换为rem的属性 */
    remProperties?: string[]
    /** 转换为vw的属性 */
    vwProperties?: string[]
  }
  /** 需要包含的文件，支持正则表达式 */
  include?: string[]
  /** 需要排除的文件，支持正则表达式 */
  exclude?: string[]
  /** 是否启用转换 */
  enabled?: boolean
}

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
  minusPxToMinusMode: true,
  include: ['**/*.css', '**/*.scss', '**/*.less', '**/*.styl', '**/*.stylus', '**/*.sass', '**/*.vue'],
  exclude: [
    '**/*.min.css', '**/*.min.scss', '**/*.min.less', '**/*.min.styl', '**/*.min.stylus', '**/*.min.sass',
    '**/*.min.vue', '**/*.min.js', '**/*.min.ts', '**/*.min.tsx', '**/*.min.jsx', '**/*.min.json', '**/*.min.html',
    '**/*.min.md', '**/*.min.txt', '**/*.min.xml', '**/*.min.yaml', '**/*.min.yml', '**/*.min.toml', '**/*.min.ini',
    '**/*.min.conf', '**/*.min.config', '**/*.min.properties', '**/*.min.env', '**/*.min.env.local', '**/*.min.env.development',
    '**/*.min.env.production', '**/*.min.env.test', 'node_modules/**/*'
  ],
  enabled: true,
}

// ----------------------Helper Functions ----------------------

const pxRegex = /"([^"\n]*)"|'([^'\n]*)'|url\([^)\n]*\)|(\d*\.?\d+)px/g

const sanitizeProperty = (prop: string): string => {
  // 限制属性名长度，防止ReDoS
  const MAX_LENGTH = 100;
  if (prop.length > MAX_LENGTH) {
    return prop.substring(0, MAX_LENGTH);
  }
  // 只允许字母、数字、连字符和下划线
  return prop.replace(/[^a-zA-Z0-9-_]/g, '');
};

const isPropMatch = (prop: string, properties: string[]): boolean => {
  if (!prop || typeof prop !== 'string') return false;
  
  const sanitizedProp = sanitizeProperty(prop.toLowerCase());
  if (!sanitizedProp) return false;
  
  return properties.some(pattern => {
    if (!pattern || typeof pattern !== 'string') return false;
    
    const sanitizedPattern = sanitizeProperty(pattern.toLowerCase());
    if (!sanitizedPattern) return false;
    
    if (sanitizedPattern === '*') {
      return true;
    }
    
    // 限制通配符使用，防止复杂模式
    const wildcardCount = (sanitizedPattern.match(/\*/g) || []).length;
    if (wildcardCount > 2) return false; // 最多允许2个通配符
    
    if (sanitizedPattern.startsWith('*') && sanitizedPattern.endsWith('*')) {
      // *middle* 模式
      const middle = sanitizedPattern.slice(1, -1);
      return sanitizedProp.includes(middle);
    } else if (sanitizedPattern.startsWith('*')) {
      // *suffix 模式
      const suffix = sanitizedPattern.slice(1);
      return sanitizedProp.endsWith(suffix);
    } else if (sanitizedPattern.endsWith('*')) {
      // prefix* 模式
      const prefix = sanitizedPattern.slice(0, -1);
      return sanitizedProp.startsWith(prefix);
    } else if (sanitizedPattern.includes('*')) {
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


const isPxIgnore = (decl: any) =>{
  const comment = decl.next()
  if(comment?.type === 'comment'){
    return comment.text?.includes('px-ignore')
  }
  return false
}

const isMinusPx = (decl: any) => {
  // 1. 如果整个值就是一个负长度，例如 "-16px"
  // 2. 如果里面出现了独立的负长度，例如 "-16px 0 0 -8px"
  // 3. 但放过 calc(...) 里的减号
  const hasNegativeToken = /(^|[^\w.)])-\d+(?:\.\d+)?px($|[^\w(])/i.test(decl.value);

  if (hasNegativeToken) {
    // 不开启负值转化，是负值，不转化
    return true;
  }
  return false;
}


// ----------------------Post CSS Plugin ----------------------

const Plugin = (options: PxMorphOptions = { mode: 'rem' }): Plugin => {

// 输入验证和清理 - 使用默认值替代错误抛出
const validateOptions = (options: PxMorphOptions): Required<PxMorphOptions> => {
  const opts = { ...defaultOptions, ...options };
  
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
    const sanitizePropertyArray = (arr: string[]): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr.filter(item => typeof item === 'string' && item.length > 0).slice(0, 100); // 限制数组大小
    };
    
    opts.hybridOptions.remProperties = sanitizePropertyArray(opts.hybridOptions.remProperties || []);
    opts.hybridOptions.vwProperties = sanitizePropertyArray(opts.hybridOptions.vwProperties || []);
  }
  
  // 清理include/exclude数组
  const sanitizePatternArray = (arr: string[]): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => typeof item === 'string' && item.length > 0).slice(0, 100); // 限制数组大小
  };
  
  opts.include = sanitizePatternArray(opts.include);
  opts.exclude = sanitizePatternArray(opts.exclude);
  
  return opts;
};

const opts = validateOptions(options);

  return {
    postcssPlugin: 'px-morph',

    Once(root, { result }) {
      // 获取文件路径
      const filePath = root.source?.input?.file
      if (!filePath) return


      // 不在包含中与在排除中，则都不转换
      if (opts.include && !opts.include.some(pattern => minimatch(filePath, pattern))) return
      if (opts.exclude && opts.exclude.some(pattern => minimatch(filePath, pattern))) return

      // 转换开始了
      root.walkDecls(decl => {
        // 判断是否包含px
        if (!decl.value.includes('px')) return

        // px-ignore 不转换,value中获取不到注释内容
        if (isPxIgnore(decl)) return
        // 判断是否开启了负值的转化 开启了负值 平且 是负值  负值去转化
        if (!opts.minusPxToMinusMode){
          if (isMinusPx(decl)) return
        }

        // 替换掉px，转换为rem或vw
        const newValue = decl.value.replace(pxRegex, (match, str1, str2, px) => {
          // 如果匹配到的是引号中的内容、url() 或 px 值为空，则忽略
          if (str1 || str2 || !px) return match;
          
          // 严格验证px值，防止注入
          const pxValue = parseFloat(px);
          if (!Number.isFinite(pxValue) || pxValue < 0) return match;

          if (pxValue < opts.minPixelValue) return match;

          let unit: PxMorphHybridMode;

          if (opts.mode === 'hybrid' && opts.hybridOptions) {
            // 默认情况，或者没有书写的属性，都会转换为rem
            let unitType: PxMorphHybridMode = opts.hybridOptions.defaultMode || 'rem';

            // 如果属性在vwProperties中，则转换为vw
            if (isPropMatch(decl.prop, opts.hybridOptions.vwProperties || [])) {
              unitType = 'vw';
            }

            // 如果属性在remProperties中，则转换为rem
            if (isPropMatch(decl.prop, opts.hybridOptions.remProperties || [])) {
              unitType = 'rem';
            }

            unit = unitType;

          } else {
            unit = opts.mode as PxMorphHybridMode;
          }

          try {
            if (unit === 'rem') {
              return pxToRem(pxValue, opts.rootValue, opts.unitPrecision);
            } else { // vw
              return pxToVw(pxValue, opts.viewportWidth, opts.unitPrecision);
            }
          } catch (error) {
            // 转换失败时返回原值
            return match;
          }
        });

        // 如果转换后的值与原值不同，则替换
        if (newValue !== decl.value) {
          decl.value = newValue;
        }
      })
    }
  }
}


export default Plugin;

// 兼容让插件在 require('postcss-px-morph') 中使用
module.exports = Plugin;
module.exports.default = Plugin;

