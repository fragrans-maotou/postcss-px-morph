English | [简体中文](./README.md)

<div align="center">

  <h1>postcss-px-morph</h1>
  <p>Elegantly convert <code>px</code> to <code>rem</code>, <code>vw</code>, or intelligent <code>hybrid</code> mode in one go.</p>

  [![npm version](https://img.shields.io/npm/v/postcss-px-morph.svg?style=flat-square)](https://npmjs.com/package/postcss-px-morph)
  [![license](https://img.shields.io/npm/l/postcss-px-morph.svg?style=flat-square)](./LICENSE)
  ![typescript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)

</div>


## ✨ Highlights

| Feature | Description |
| --- | --- |
| 🧩 All-in-One | Support `rem`, `vw`, and the unique `hybrid` mode |
| 🧠 Smart Hybrid | Layout → `vw`, typography → `rem`, best of both worlds |
| ⚙️ Highly Configurable | Fine-tune root, precision, prop white/black-lists |
| 🚀 Zero-Config Friendly | Works out of the box |
| 🔷 TypeScript Ready | Full TS source & type definitions |

---

## 📦 Installation

```bash
npm i -D postcss postcss-px-morph
```

---

## 🛠️ Quick Start

### 1. rem / vw Mode

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-morph')({
      mode: 'rem',      // or 'vw'
      rootValue: 16,
      viewportWidth: 375,
      unitPrecision: 5,
      minPixelValue: 1,
      include: ['**/*.vue']
    })
  ]
}
```

### 2. Hybrid Mode — **Recommended**

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

## ⚙️ Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'rem' \| 'vw' \| 'hybrid'` | `'rem'` | Conversion mode |
| `rootValue` | `number` | `16` | Root font-size for `rem` |
| `viewportWidth` | `number` | `375` | Design viewport width for `vw` |
| `unitPrecision` | `number` | `5` | Decimal places |
| `minPixelValue` | `number` | `1` | Ignore `px` values below this |
| `minusPxToMinusMode` | `boolean` | `true` | Whether to convert negative values (e.g. `-16px` → `-1rem`) |
| `hybridOptions` | `object` | see below | Settings for `hybrid` mode |
| `include / exclude` | `string[]` | `[]` | File include/exclude rules |
| `enabled` | `boolean` | `true` | Enable/disable the plugin |

#### hybridOptions

| Sub-Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultMode` | `'rem' \| 'vw'` | `'rem'` | Fallback for unmatched properties |
| `remProperties` | `string[]` | `[]` | Props converted to `rem` (supports `*` wildcard) |
| `vwProperties` | `string[]` | `[]` | Props converted to `vw` (supports `*` wildcard) |

---

## 📝 Tips

### Inline Ignore

Add `/* px-ignore */` at the end of a line to skip conversion:

```css
.card {
  border: 1px solid #000; /* px-ignore */
  margin: 16px;           /* → will be converted */
}
```

---

### 📄 License

[MIT](./LICENSE)