# postcss-px-morph

<div align="center">

![postcss-px-morph](https://img.shields.io/npm/v/postcss-px-morph.svg?style=flat-square)
![license](https://img.shields.io/npm/l/postcss-px-morph.svg?style=flat-square)
![downloads](https://img.shields.io/npm/dt/postcss-px-morph.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)

**A powerful, flexible PostCSS plugin to transform `px` to `rem`, `vw`, or a smart `hybrid` of both.**

[English](./README.en-US.md) | [简体中文](./README.md)

</div>

---

## 🚀 Why postcss-px-morph?

In modern responsive web design, we often struggle with units. `rem` is great for typography, while `vw` is excellent for layout scaling. **postcss-px-morph** gives you the best of both worlds with its unique **Hybrid Mode**.

- **🧩 Hybrid Mode**: Automatically convert specific properties to `vw` (like layout) and others to `rem` (like fonts).
- **🛡️ Type Safe**: Written in TypeScript with full type definitions.
- **⚡️ High Performance**: Optimized regex and AST traversal.
- **🎛️ Granular Control**: Block-level ignores, selector blacklists, and media query support.

## 📦 Installation

```bash
npm install -D postcss postcss-px-morph
# or
yarn add -D postcss postcss-px-morph
# or
pnpm add -D postcss postcss-px-morph
```

## 🛠️ Usage

### Add to `vue.config.js`:

Simple Usage
```javascript
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-morph')({
            mode: 'rem',
            rootValue: 16,
            viewportWidth: 375,
            unitPrecision: 5,
            minPixelValue: 1,
            include: ['**/*.vue'],
          })
        ]
      }
    }
  }
}
```

Hybrid Usage
```javascript
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
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
    }
  }
}
```

### Add it to your `postcss.config.js`:

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

## ⚙️ Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'rem' \| 'vw' \| 'hybrid'` | `'rem'` | Conversion mode. |
| `rootValue` | `number` | `16` | Root font size for `rem` conversion. |
| `viewportWidth` | `number` | `375` | Viewport width for `vw` conversion. |
| `unitPrecision` | `number` | `5` | Decimal precision for converted units. |
| `minPixelValue` | `number` | `1` | Minimum `px` value to convert. |
| `selectorBlackList` | `(string \| RegExp)[]` | `[]` | Selectors to ignore. |
| `mediaQuery` | `boolean` | `false` | Allow conversion inside media queries. |
| `hybridOptions` | `object` | `{}` | Configuration for hybrid mode. |
| `include` | `string[]` | `['**/*.css', ...]` | Files to include (glob patterns). |
| `exclude` | `string[]` | `['**/*.min.css', ...]` | Files to exclude (glob patterns). |

### Hybrid Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultMode` | `'rem' \| 'vw'` | `'rem'` | Fallback mode if property doesn't match lists. |
| `vwProperties` | `string[]` | `[]` | Properties to convert to `vw` (supports `*` wildcard). |
| `remProperties` | `string[]` | `[]` | Properties to convert to `rem` (supports `*` wildcard). |

## 📝 Ignore & Control

### Line Ignore
Append `/* px-ignore */` to the end of a line to skip conversion.

```css
.box {
  width: 100px; /* px-ignore */
  height: 100px; /* Will be converted */
}
```

### Block Ignore
Use `/* px-morph-disable */` and `/* px-morph-enable */` to ignore blocks of code.

```css
/* px-morph-disable */
.ignored-block {
  width: 200px;
  font-size: 14px;
}
/* px-morph-enable */
```

## 🤝 Contributing

Pull requests are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT