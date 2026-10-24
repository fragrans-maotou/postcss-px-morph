# postcss-px-morph

<div align="center">

![postcss-px-morph](https://img.shields.io/npm/v/postcss-px-morph.svg?style=flat-square)
![CI](https://github.com/fragrans-maotou/postcss-px-morph/actions/workflows/ci.yml/badge.svg)
![license](https://img.shields.io/npm/l/postcss-px-morph.svg?style=flat-square)
![downloads](https://img.shields.io/npm/dt/postcss-px-morph.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square)

**One plugin for rem / vw / hybrid: layout follows viewport (vw), type follows root font (rem)—no stacking two plugins.**

[English](./README.en-US.md) | [简体中文](./README.md) · [CHANGELOG](./CHANGELOG.md) · [Examples](./examples/vite-vanilla)

</div>

---

## Why postcss-px-morph?

| Plugin | Capability |
| --- | --- |
| postcss-pxtorem | rem only |
| postcss-px-to-viewport | vw only |
| **postcss-px-morph** | **rem \| vw \| hybrid (per-property routing)** |

Hybrid = layout scales with the viewport (vw), typography follows the root font (rem). One config, no dual plugins.

### Hybrid Before / After (375 design width)

With the recommended `hybridOptions` below:

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

> When a property matches both `vwProperties` and `remProperties`, **remProperties** wins.

## Install

```bash
npm install -D postcss postcss-px-morph
# or yarn / pnpm
```

## Quick start (recommended)

Primary example: `postcss.config.js`. **Vite just works with this file**—no extra Vite config needed.

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-morph')({
      mode: 'hybrid', // 'rem' | 'vw' | 'hybrid'
      rootValue: 16,
      viewportWidth: 375,
      // Recommended starter options (code defaults unchanged in this release—set them explicitly)
      hybridOptions: {
        defaultMode: 'rem',
        vwProperties: ['width', 'height', 'margin*', 'padding*', 'top', 'right', 'bottom', 'left'],
        remProperties: ['font*'],
      },
    }),
  ],
}
```

Minimal runnable demo: [`examples/vite-vanilla`](./examples/vite-vanilla) (`npm i && npm run dev`).

### Appendix · legacy (Vue CLI / vue.config.js)

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

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'rem' \| 'vw' \| 'hybrid'` | `'rem'` | Conversion mode |
| `rootValue` | `number` | `16` | Root font size for rem |
| `viewportWidth` | `number` | `375` | Design viewport width for vw |
| `unitPrecision` | `number` | `5` | Decimal precision |
| `minPixelValue` | `number` | `1` | Skip px below this value |
| `convertNegative` | `boolean` | `true` | Convert negative px (preferred) |
| `minusPxToMinusMode` | `boolean` | `true` | **deprecated** alias of `convertNegative` |
| `selectorBlackList` | `(string \| RegExp)[]` | `[]` | Selector blacklist |
| `mediaQuery` | `boolean` | `false` | Convert inside media queries |
| `hybridOptions` | `object` | see below | Hybrid-mode config |
| `include` | `string[]` | `['**/*.css','**/*.scss','**/*.less','**/*.styl','**/*.stylus','**/*.sass','**/*.vue']` | Include globs |
| `exclude` | `string[]` | `['**/*.min.css','**/*.min.scss','**/*.min.less','**/*.min.styl','**/*.min.stylus','**/*.min.sass','**/*.min.vue','node_modules/**/*']` | Exclude globs (tightened in 1.0.4) |
| `enabled` | `boolean` | `true` | Enable conversion |

### hybridOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultMode` | `'rem' \| 'vw'` | `'rem'` | Fallback when no list matches |
| `vwProperties` | `string[]` | `[]` | Properties → vw (supports `*`) |
| `remProperties` | `string[]` | `[]` | Properties → rem (supports `*`); wins over vw on overlap |

## Ignore & control

- **Line**: `/* px-ignore */`
- **Block**: `/* px-morph-disable */` … `/* px-morph-enable */`
- **Selector**: `selectorBlackList`

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

**1. When rem / vw / hybrid?**  
- rem: typography follows root font (a11y zoom).  
- vw: layout scales with viewport width.  
- hybrid: layout → vw, type → rem (recommended for most H5).

**2. Hybrid conflict priority?**  
Match `vwProperties` first, then `remProperties` (overrides), else `defaultMode`.

**3. Negatives & `convertNegative`?**  
Default `true` converts `-16px`. Set `false` to keep negative px. Legacy alias `minusPxToMinusMode` still works but is deprecated; if both are set and disagree, `convertNegative` wins (with a warning).

**4. Why is `mediaQuery` default false?**  
px inside media queries often encodes breakpoints; leaving them alone is safer. Opt in when you want scaled breakpoints.

**5. How to ignore?**  
Line `px-ignore`, block `disable/enable`, and `selectorBlackList`.

**6. vs postcss-pxtorem?**  
**Replace** pxtorem with this plugin—do not run both long-term, or declarations get double-converted.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). History: [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
