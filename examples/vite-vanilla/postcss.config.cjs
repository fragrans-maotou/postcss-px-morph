module.exports = {
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
}
