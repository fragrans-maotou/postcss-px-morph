# postcss-px-morph

[English](./README.md) | 简体中文

[![NPM Version](https://img.shields.io/npm/v/postcss-px-morph.svg)](https://www.npmjs.com/package/postcss-px-morph)
[![License](https://img.shields.io/npm/l/postcss-px-morph.svg)](https://github.com/fragrans-maotou/postcss-px-morph/blob/main/LICENSE)

一款灵活的 PostCSS 插件，可将 `px` 单位转换为 `rem`、`vw` 或智能混合（`hybrid`）模式。

`postcss-px-morph` 通过将固定像素单位转换为响应式单位，帮助您轻松创建自适应布局，提供强大且直观的配置选项。

## 为什么选择 postcss-px-morph?

* **一体化解决方案**：支持 `rem`、`vw` 和独特的 **`hybrid`** 混合模式
* **智能混合模式**：在同一个项目中自动将布局属性转为 `vw`，字体相关属性转为 `rem`，兼得两者优势
* **高度可配置**：可精细调整转换的每个细节，从基准值到属性列表
* **零配置友好**：开箱即用，提供合理的默认配置
* **TypeScript 支持**：使用 TypeScript 编写，提供完整的类型定义

## 安装

```bash
npm install --save-dev postcss postcss-px-morph
```

## 使用方式

将 `postcss-px-morph` 添加到 `postcss.config.js` 的插件配置中。

### 示例：混合模式（推荐）

这是最强大的模式。它使用 `rem` 处理排版以尊重用户的浏览器字体设置，同时使用 `vw` 处理布局以确保完美缩放。

```javascript
// postcss.config.js
const { defineConfig } = require('@vue/cli-service')
// 引入我们的插件
const pxMorphPlugin = require('postcss-px-morph');

module.exports = defineConfig({
  transpileDependencies: true,

  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            pxMorphPlugin({
              mode: 'rem',
              rootValue: 16,
              viewportWidth: 375,
              unitPrecision: 5,
              minPixelValue: 1,
              include: ['**/*.vue'],
              enabled: true
            })
          ]
        }
      }
    }
  }
})

```

## 配置选项

| 选项              | 类型                       | 默认值                                             | 描述                                                                                                                             |
| ----------------- | -------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `mode`            | `'rem'`, `'vw'`, `'hybrid'` | `'rem'`                                            | 转换模式                                                                                                                         |
| `rootValue`       | `number`                   | `16`                                               | `rem` 转换的基准字体大小                                                                                                         |
| `viewportWidth`   | `number`                   | `375`                                              | `vw` 转换的视口宽度，通常为设计稿宽度                                                                                            |
| `unitPrecision`   | `number`                   | `5`                                                | 转换后值的小数位数                                                                                                               |
| `minPixelValue`   | `number`                   | `1`                                                | 小于此值的像素单位不会被转换                                                                                                     |
| `hybridOptions`   | `object`                   | `{ defaultMode: 'rem', remProperties: [], vwProperties: [] }` | 在 `hybrid` 模式下，此列表中的属性（支持 `*` 通配符）将被转换为 `rem`，其他属性转换为 `vw`                                           |
| `include`         | `string[]`                 | `[]`                                               | 包含需要处理的文件的正则表达式                                                                                                   |
| `exclude`         | `string[]`                 | `[]`                                               | 排除不需要处理的文件的正则表达式                                                                                                 |
| `enabled`         | `boolean`                  | `true`                                             | 是否启用插件                                                                                                                     |

### hybridOptions

| 选项               | 类型             | 默认值    | 描述                                                                         |
| ------------------ | ---------------- | --------- | ---------------------------------------------------------------------------- |
| `defaultMode`      | `'rem'`, `'vw'`  | `'rem'`   | 默认转换模式                                                                 |
| `remProperties`    | `string[]`       | `[]`      | 此列表中的属性（支持 `*` 通配符,例如 `font-*` 会匹配 `font-size`, `font-weight` 等）将被转换为 `rem`                              |
| `vwProperties`     | `string[]`       | `[]`      | 此列表中的属性（支持 `*` 通配符,例如 `font-*` 会匹配 `font-size`, `font-weight` 等）将被转换为 `vw`                               |

## 开源协议

[MIT](./LICENSE)