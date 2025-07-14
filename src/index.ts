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

const pxRegex = /"([^"]+)"|'([^']+)'|url\([^)]+\)|(\d*\.?\d+)px/g

const isPropMatch = (prop: string, properties: string[]) => {
  return properties.some(propertie => {
    // 处理不同的通配符模式
    if (propertie === '*') {
      // 完全通配，匹配所有属性
      return true;
    } else if (propertie.startsWith('*')) {
      // 后缀匹配：*-size 匹配 font-size, grid-size 等
      const suffix = propertie.slice(1);
      return prop.endsWith(suffix);
    } else if (propertie.endsWith('*')) {
      // 前缀匹配：font* 匹配 font, font-size, font-weight 等
      const prefix = propertie.slice(0, -1);
      return prop.startsWith(prefix);
    } else if (propertie.includes('*')) {
      // 中间匹配：margin-*-size 匹配 margin-top-size, margin-bottom-size 等
      const [prefix, ...rest] = propertie.split('*');
      const suffix = rest.join('*');
      return prop.startsWith(prefix) && prop.endsWith(suffix);
    } else {
      // 精确匹配：完全相等
      return prop === propertie;
    }
  });
}


const isPxIgnore = (decl: any) =>{
  const comment = decl.next()
  if(comment?.type === 'comment'){
    return comment.text?.includes('px-ignore')
  }
  return false
}

// ----------------------Post CSS Plugin ----------------------

const Plugin = (options: PxMorphOptions = { mode: 'rem' }): Plugin => {

  const opts = { ...defaultOptions, ...options }

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

        const newValue = decl.value.replace(pxRegex, (match, str1, str2, px) => {
          // 如果匹配到的是引号中的内容、url() 或 px 值为空，则忽略
          if (str1 || str2 || !px) return match;

          const pxValue = parseFloat(px);

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

          if (unit === 'rem') {
            return pxToRem(pxValue, opts.rootValue, opts.unitPrecision);
          } else { // vw
            return pxToVw(pxValue, opts.viewportWidth, opts.unitPrecision);
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

