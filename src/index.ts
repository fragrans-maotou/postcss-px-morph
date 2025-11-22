import type { Plugin, Rule, AtRule } from 'postcss'
import { minimatch } from 'minimatch'
import { pxToRem, pxToVw } from './converter'
import { PxMorphOptions, PxMorphHybridMode } from './types'
import { validateOptions, defaultOptions } from './utils/validate'
import { pxRegex, isPropMatch, isPxIgnore, isMinusPx, checkSelectorBlackList } from './utils/helpers'

// Re-export types for user convenience
export * from './types'
export { defaultOptions }

const Plugin = (options: PxMorphOptions = { mode: 'rem' }): Plugin => {
  const opts = validateOptions(options);

  return {
    postcssPlugin: 'px-morph',

    Once(root) {
      // 获取文件路径
      const filePath = root.source?.input?.file

      // 如果有文件路径，检查包含/排除规则
      if (filePath) {
        // 不在包含中与在排除中，则都不转换
        if (opts.include && opts.include.length > 0 && !opts.include.some(pattern => minimatch(filePath, pattern))) return
        if (opts.exclude && opts.exclude.length > 0 && opts.exclude.some(pattern => minimatch(filePath, pattern))) return
      }

      let isEnabled = true;

      root.walk(node => {
        // 处理块级注释控制
        if (node.type === 'comment') {
          const text = node.text.trim();
          if (text === 'px-morph-disable') {
            isEnabled = false;
          } else if (text === 'px-morph-enable') {
            isEnabled = true;
          }
          return;
        }

        if (!isEnabled) return;

        if (node.type === 'decl') {
          const decl = node;

          // 判断是否包含px
          if (!decl.value.includes('px')) return

          // 1. px-ignore 行内注释检查
          if (isPxIgnore(decl)) return

          // 2. 负值检查
          if (!opts.minusPxToMinusMode && isMinusPx(decl)) return

          // 3. 选择器黑名单检查
          if (decl.parent?.type === 'rule') {
            const rule = decl.parent as Rule;
            if (checkSelectorBlackList(rule.selector, opts.selectorBlackList || [])) return;
          }

          // 4. 媒体查询检查
          if (!opts.mediaQuery) {
            let parent = decl.parent;
            let insideMedia = false;
            while (parent) {
              if (parent.type === 'atrule' && (parent as AtRule).name === 'media') {
                insideMedia = true;
                break;
              }
              parent = parent.parent as any;
            }
            if (insideMedia) return;
          }

          // 替换掉px，转换为rem或vw
          const newValue = decl.value.replace(pxRegex, (match, str1, str2, px) => {
            // 如果匹配到的是引号中的内容、url() 或 px 值为空，则忽略
            if (str1 || str2 || !px) return match;

            // 严格验证px值，防止注入
            const pxValue = parseFloat(px);
            if (!Number.isFinite(pxValue)) return match;

            // 绝对值小于最小值的忽略 (注意：如果是负值，比较绝对值是否小于最小值？通常 minPixelValue 是正数，比较绝对值更合理，或者只比较正值？
            // 原逻辑：if (pxValue < opts.minPixelValue) return match; 
            // 如果 pxValue 是 -0.5, minPixelValue 是 1. -0.5 < 1, 会被忽略。这似乎符合预期？
            // 但是如果 pxValue 是 -10, minPixelValue 是 1. -10 < 1, 会被忽略？不对。
            // 应该是比较绝对值。
            if (Math.abs(pxValue) < opts.minPixelValue!) return match;

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
                return pxToRem(pxValue, opts.rootValue!, opts.unitPrecision!);
              } else { // vw
                return pxToVw(pxValue, opts.viewportWidth!, opts.unitPrecision!);
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
        }
      })
    }
  }
}

export default Plugin;

// 兼容让插件在 require('postcss-px-morph') 中使用
try {
  module.exports = Plugin;
  module.exports.default = Plugin;
} catch (e) {
  // Ignore error in environments where module.exports is immutable
}


