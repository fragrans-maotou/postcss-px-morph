[English](./README.en-US.md) | 简体中文

<div align="center">

  <h1>postcss-px-morph</h1>
  <p>优雅地将 <code>px</code> 一键转换为 <code>rem</code>、<code>vw</code> 或智能 <code>hybrid</code> 模式。</p>

  [![npm version](https://img.shields.io/npm/v/postcss-px-morph.svg?style=flat-square)](https://npmjs.com/package/postcss-px-morph)
  [![license](https://img.shields.io/npm/l/postcss-px-morph.svg?style=flat-square)](./LICENSE)
  ![typescript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)

</div>


## ✨ 特性一览

| 特性 | 说明 |
| --- | --- |
| 🧩 一体化 | 支持 `rem`、`vw` 及独创的 `hybrid` 混合模式 |
| 🧠 智能混合 | 布局用 `vw`，排版用 `rem`，兼顾缩放与用户字体偏好 |
| ⚙️ 高度可配置 | 基准值、精度、属性黑白名单随心定义 |
| 🚀 零配置可用 | 无需任何配置即可开箱即用 |
| 🔷 TypeScript | 源码与类型提示全量 TS 化 |

---

## 📦 安装

```bash
npm i -D postcss postcss-px-morph
```

---

## 🛠️ 快速开始

### ① rem / vw 模式

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-morph')({
      mode: 'rem',      // 或 'vw'
      rootValue: 16,
      viewportWidth: 375,
      unitPrecision: 5,
      minPixelValue: 1,
      include: ['**/*.vue']
    })
  ]
}
```

### ② hybrid（混合）模式 —— **强烈推荐**

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-morph')({
      mode: 'hybrid',
      rootValue: 16,
      viewportWidth: 375,
      unitPrecision: 5,
      minPixelValue: 1,
      hybridOptions: {
        defaultMode: 'rem',
        remProperties: ['font*', 'line-height'],
        vwProperties: ['width', 'height', 'margin-*', 'padding-*']
      },
      include: ['**/*.vue']
    })
  ]
}
```

---

### ⚙️ 配置项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'rem' \| 'vw' \| 'hybrid'` | `'rem'` | 转换模式 |
| `rootValue` | `number` | `16` | 根字体大小（`rem` 计算基准） |
| `viewportWidth` | `number` | `375` | 设计稿视口宽度（`vw` 计算基准） |
| `unitPrecision` | `number` | `5` | 保留小数位 |
| `minPixelValue` | `number` | `1` | 小于该值的 `px` 将忽略 |
| `minusPxToMinusMode` | `boolean` | `true` | 是否转换负值（如 `-16px` → `-1rem`） |
| `hybridOptions` | `object` | 见下文 | `hybrid` 模式下专用 |
| `include / exclude` | `string[]` | `[]` | 文件包含/排除规则 |
| `enabled` | `boolean` | `true` | 是否启用插件 |

#### hybridOptions

| 子项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultMode` | `'rem' \| 'vw'` | `'rem'` | 未命中列表时的兜底模式 |
| `remProperties` | `string[]` | `[]` | 命中列表的属性转 `rem`（支持 `*` 通配符） |
| `vwProperties` | `string[]` | `[]` | 命中列表的属性转 `vw`（支持 `*` 通配符） |

---

### 📝 使用技巧（增强功能）

#### 行内忽略

在代码行尾添加 `/* px-ignore */`，即可跳过该行转换：

```css
.card {
  border: 1px solid #000; /* px-ignore */
  margin: 16px;           /* → 会被转换 */
}
```

---

### 📄 License

[MIT](./LICENSE)
