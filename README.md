# postcss-px-morph

<div align="center">

![postcss-px-morph](https://img.shields.io/npm/v/postcss-px-morph.svg?style=flat-square)
![license](https://img.shields.io/npm/l/postcss-px-morph.svg?style=flat-square)
![downloads](https://img.shields.io/npm/dt/postcss-px-morph.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)

**一个强大且灵活的 PostCSS 插件，支持将 `px` 转换为 `rem`、`vw` 或智能的 `hybrid` 混合模式。**

[English](./README.en-US.md) | [简体中文](./README.md)

</div>

---

## 🚀 为什么选择 postcss-px-morph?

在现代响应式 Web 开发中，我们经常纠结于单位的选择。`rem` 适合排版（字体），而 `vw` 适合布局缩放。**postcss-px-morph** 通过其独特的 **Hybrid Mode (混合模式)** 让你兼得两者之长。

- **🧩 混合模式 (Hybrid Mode)**: 自动将特定属性转换为 `vw` (如布局相关)，将其他属性转换为 `rem` (如字体相关)。
- **🛡️ 类型安全**: 全量 TypeScript 编写，提供完整的类型定义。
- **⚡️ 高性能**: 优化的正则和 AST 遍历。
- **🎛️ 精细控制**: 支持块级忽略、选择器黑名单和媒体查询控制。

## 📦 安装

```bash
npm install -D postcss postcss-px-morph
# or
yarn add -D postcss postcss-px-morph
# or
pnpm add -D postcss postcss-px-morph
```

## 🛠️ 使用方法

将其添加到你的 `postcss.config.js`:

```javascript
module.exports = {
  plugins: [
    require('postcss-px-morph')({
      mode: 'hybrid', // 'rem' | 'vw' | 'hybrid'
      rootValue: 16,
      viewportWidth: 375,
      hybridOptions: {
        defaultMode: 'rem',
        vwProperties: ['width', 'height', 'margin*', 'padding*'],
        remProperties: ['font*']
      }
    })
  ]
}
```

## ⚙️ 配置项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'rem' \| 'vw' \| 'hybrid'` | `'rem'` | 转换模式。 |
| `rootValue` | `number` | `16` | `rem` 转换的根字体大小基准值。 |
| `viewportWidth` | `number` | `375` | `vw` 转换的视口宽度基准值。 |
| `unitPrecision` | `number` | `5` | 转换后保留的小数位数。 |
| `minPixelValue` | `number` | `1` | 小于该值的 `px` 不进行转换。 |
| `selectorBlackList` | `(string \| RegExp)[]` | `[]` | 要忽略的选择器列表（支持字符串或正则）。 |
| `mediaQuery` | `boolean` | `false` | 是否允许在媒体查询中进行转换。 |
| `hybridOptions` | `object` | `{}` | 混合模式的配置项。 |
| `include` | `string[]` | `['**/*.css', ...]` | 需要包含的文件（支持 glob 模式）。 |
| `exclude` | `string[]` | `['**/*.min.css', ...]` | 需要排除的文件（支持 glob 模式）。 |

### 混合模式配置 (Hybrid Options)

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultMode` | `'rem' \| 'vw'` | `'rem'` | 未匹配到列表时的默认转换模式。 |
| `vwProperties` | `string[]` | `[]` | 转换为 `vw` 的属性列表 (支持 `*` 通配符)。 |
| `remProperties` | `string[]` | `[]` | 转换为 `rem` 的属性列表 (支持 `*` 通配符)。 |

## 📝 忽略与控制

### 行级忽略
在行尾添加 `/* px-ignore */` 即可跳过该行的转换。

```css
.box {
  width: 100px; /* px-ignore */
  height: 100px; /* 将会被转换 */
}
```

### 块级忽略
使用 `/* px-morph-disable */` 和 `/* px-morph-enable */` 注释来忽略整个代码块。

```css
/* px-morph-disable */
.ignored-block {
  width: 200px;
  font-size: 14px;
}
/* px-morph-enable */
```

## 🤝 贡献

欢迎提交 Pull Requests! 详情请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 📄 许可证

MIT
