// const precss = require('precss');
// const autoprefixer = require('autoprefixer');

module.exports = (ctx) => {
  return {
    plugins: {
      // require('postcss-smart-import')({}),
      precss: {},
      autoprefixer: {
        browsers: ['>0.01%']
      }
    }
  };
};
