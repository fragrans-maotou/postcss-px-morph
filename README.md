# postcss-px-morph

English | [简体中文](./README.zh-CN.md)

[![NPM Version](https://img.shields.io/npm/v/postcss-px-morph.svg)](https://www.npmjs.com/package/postcss-px-morph)
[![License](https://img.shields.io/npm/l/postcss-px-morph.svg)](https://github.com/fragrans-maotou/postcss-px-morph/blob/main/LICENSE)

A flexible PostCSS plugin to transform `px` to `rem`, `vw`, or a smart `hybrid` of both.

`postcss-px-morph` helps you effortlessly create adaptive layouts by converting fixed pixel units into responsive units, with powerful and intuitive configuration.

## Why postcss-px-morph?

* **All-in-One**: Supports `rem`, `vw`, and a unique **`hybrid`** mode.
* **Smart Hybrid Mode**: Convert layout properties to `vw` and font-related properties to `rem` automatically within the same project. Get the best of both worlds!
* **Highly Configurable**: Fine-tune every aspect of the conversion, from base values to property lists.
* **Zero-Config Friendly**: Works out of the box with sensible defaults.
* **TypeScript Ready**: Written in TypeScript with full type definitions.

## Installation

```bash
npm install --save-dev postcss postcss-px-morph
```

## Usage

Add `postcss-px-morph` to your `postcss.config.js` plugins.

### Example: Hybrid Mode (Recommended)

This is the most powerful mode. It uses `rem` for typography to respect user's browser font settings and `vw` for layout to ensure perfect scaling.

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

## Configuration Options

| Option          | Type                      | Default                                             | Description                                                                                                                                                             |
| --------------- | ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`          | `'rem'`, `'vw'`, `'hybrid'` | `'rem'`                                             | The conversion mode.                                                                                                                                                    |
| `rootValue`     | `number`                  | `16`                                                | Base font size for `rem` conversion.                                                                                                                                    |
| `viewportWidth` | `number`                  | `375`                                               | Viewport width for `vw` conversion. Typically your design draft width.                                                                                                  |
| `unitPrecision` | `number`                  | `5`                                                 | The number of decimal places for the converted values.                                                                                                                  |
| `minPixelValue` | `number`                  | `1`                                                 | Pixels values below this will not be converted.                                                                                                                         |
| `hybridOptions`   | `object`                | `{ defaultMode: 'rem', remProperties: [], vwProperties: [] }`                        | In `hybrid` mode, properties in this list (supports `*` wildcard) are converted to `rem`. Others are converted to `vw`.                                                    |
| `include`       | `string[]`                  | `[]`                                              | A regex to include files for processing.                                                                                                                                |
| `exclude`       | `string[]`                  | `[]`                                              | A regex to exclude files from processing.                                                                                                                               |
| `enabled`       | `boolean`                  | `true`                                              | Whether to enable the plugin.                                                                                                                                |

### hybridOptions

| Option          | Type                      | Default                                             | Description                                                                                                                                                             |
| --------------- | ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultMode`   | `'rem'`, `'vw'` | `'rem'`                                             | The default conversion mode.                                                                                                                                                    |
| `remProperties` | `string[]`                  | `[]`                                              | Properties in this list (supports `*` wildcard, for example `font-*` will match `font-size`, `font-weight` etc.) are converted to `rem`.                                                                                                                                |
| `vwProperties`  | `string[]`                  | `[]`                                              | Properties in this list (supports `*` wildcard, for example `width-*` will match `width`, `height` etc.) are converted to `vw`.                                                                                                                               |





## License

[MIT](./LICENSE)