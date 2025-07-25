// postcss.config.js
const pxMorph = require('./dist/index.js'); // 直接引用我们的本地源文件进行测试

module.exports = {
  plugins: [
    pxMorph({
      mode: 'hybrid',         // 我们来测试最酷的 hybrid 模式！
      viewportWidth: 375,     // 设计稿宽度
      rootValue: 16,          // rem 基准值
      hybridOptions: {
        defaultMode: 'vw',
        remProperties: ['font*', 'line-height'], // 字体相关和行高用rem，其他用vw
        vwProperties: ['width', 'height', 'margin-*'],
      },
      mediaQuery: false,
      minusPxToMinusMode: true
    }),
  ],
};