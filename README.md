# postcss-px-morph

<div align="center">

![postcss-px-morph](https://img.shields.io/npm/v/postcss-px-morph.svg?style=flat-square)
![CI](https://github.com/fragrans-maotou/postcss-px-morph/actions/workflows/ci.yml/badge.svg)
![license](https://img.shields.io/npm/l/postcss-px-morph.svg?style=flat-square)
![downloads](https://img.shields.io/npm/dt/postcss-px-morph.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)

**一个插件覆盖 rem / vw / hybrid：布局跟屏宽 (vw)，字号跟根字体 (rem)，不用叠两个插件。**

[English](./README.en-US.md) | [简体中文](./README.md) · [CHANGELOG](./CHANGELOG.md) · [示例](./examples/vite-vanilla)

</div>

---

## 为什么选 postcss-px-morph？

| 插件 | 能力 |
| --- | --- |
| postcss-pxtorem | 只 rem |
| postcss-px-to-viewport | 只 vw |
| **postcss-px-morph** | **rem \| vw \| hybrid（属性级分流）** |

Hybrid = 布局跟屏宽（vw），字号跟根字体（rem），一次配置搞定，不必再叠两个插件。

### Hybrid Before / After（375 设计稿）

推荐 `hybridOptions`（见下方「上手」）时：

```css
/* Before */
.card {
  width: 100px;
  padding: 16px;
  font-size: 16px;
}

/* After */
.card {
  width: 26.66667vw;
  padding: 4.26667vw;
  font-size: 1rem;
}
```

> 同时命中 `vwProperties` 与 `remProperties` 时，以 **remProperties** 为准。

## 安装

```bash
npm install -D postcss postcss-px-morph
# or yarn / pnpm
```

## 上手（推荐）

主示例：`postcss.config.js`。**Vite 用它即可**，无需再改 `vite.config`。

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-morph')({
      mode: 'hybrid', // 'rem' | 'vw' | 'hybrid'
      rootValue: 16,
      viewportWidth: 375,
      // 推荐起步配置（代码默认值本版未改，请显式写出）
      hybridOptions: {
        defaultMode: 'rem',
        vwProperties: ['width', 'height', 'margin*', 'padding*', 'top', 'right', 'bottom', 'left'],
        remProperties: ['font*'],
      },
    }),
  ],
}
```

最小可运行 Demo：[`examples/vite-vanilla`](./examples/vite-vanilla)（`npm i && npm run dev`）。

### 附录 · 老项目（Vue CLI / vue.config.js）

```javascript
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-morph')({
            mode: 'hybrid',
            rootValue: 16,
            viewportWidth: 375,
            hybridOptions: {
              defaultMode: 'rem',
              vwProperties: ['width', 'height', 'margin*', 'padding*', 'top', 'right', 'bottom', 'left'],
              remProperties: ['font*'],
            },
          }),
        ],
      },
    },
  },
}
```

## 配置项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'rem' \| 'vw' \| 'hybrid'` | `'rem'` | 转换模式 |
| `rootValue` | `number` | `16` | rem 根字体基准 |
| `viewportWidth` | `number` | `375` | vw 视口宽度基准 |
| `unitPrecision` | `number` | `5` | 小数精度 |
| `minPixelValue` | `number` | `1` | 小于该值的 px 不转换 |
| `convertNegative` | `boolean` | `true` | 是否转换负值 px（推荐） |
| `minusPxToMinusMode` | `boolean` | `true` | **deprecated**，`convertNegative` 的旧别名 |
| `selectorBlackList` | `(string \| RegExp)[]` | `[]` | 选择器黑名单 |
| `mediaQuery` | `boolean` | `false` | 是否在媒体查询内转换 |
| `hybridOptions` | `object` | 见下 | 混合模式配置 |
| `include` | `string[]` | `['**/*.css','**/*.scss','**/*.less','**/*.styl','**/*.stylus','**/*.sass','**/*.vue']` | 包含文件 |
| `exclude` | `string[]` | `['**/*.min.css','**/*.min.scss','**/*.min.less','**/*.min.styl','**/*.min.stylus','**/*.min.sass','**/*.min.vue','node_modules/**/*']` | 排除文件（1.0.4 已收紧） |
| `enabled` | `boolean` | `true` | 是否启用转换 |

### hybridOptions

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultMode` | `'rem' \| 'vw'` | `'rem'` | 未命中列表时的默认模式 |
| `vwProperties` | `string[]` | `[]` | 转为 vw 的属性（支持 `*`） |
| `remProperties` | `string[]` | `[]` | 转为 rem 的属性（支持 `*`）；与 vw 同时命中时 **rem 优先** |

## 忽略与控制

- **行级**：`/* px-ignore */`
- **块级**：`/* px-morph-disable */` … `/* px-morph-enable */`
- **选择器**：`selectorBlackList`

```css
.box {
  width: 100px; /* px-ignore */
  height: 100px;
}

/* px-morph-disable */
.legacy { width: 200px; }
/* px-morph-enable */
```

## FAQ

**1. 何时用 rem / vw / hybrid？**  
- rem：排版/字号跟随根字体，适合可访问性缩放。  
- vw：布局随屏宽等比缩放。  
- hybrid：布局用 vw、字号用 rem（推荐大多数 H5）。

**2. hybrid 冲突优先级？**  
先看 `vwProperties`，再看 `remProperties`（后者覆盖前者），都未命中则用 `defaultMode`。

**3. 负值与 `convertNegative`？**  
默认 `true` 会转换 `-16px`。设为 `false` 则保留负值 px。旧名 `minusPxToMinusMode` 仍可用，但已 deprecated；两者都显式传入且不一致时以 `convertNegative` 为准并 warning。

**4. 为何 `mediaQuery` 默认 false？**  
媒体查询里的 px 往往是断点意图，默认不转换更安全；需要等比缩放断点时再显式打开。

**5. 如何 ignore？**  
行级 `px-ignore`、块级 `disable/enable`、以及 `selectorBlackList`。

**6. 与 postcss-pxtorem？**  
用本插件**替换** pxtorem，不要长期并存，避免同一声明被转换两次。

## 贡献

见 [CONTRIBUTING.md](./CONTRIBUTING.md)。变更记录见 [CHANGELOG.md](./CHANGELOG.md)。

## 许可证

MIT
