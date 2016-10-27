module.exports = (ctx) => {
  return {
    plugins: {
      precss: {},
      autoprefixer: {
        browsers: ['>0.01%']
      }
    }
  };
};
