const cssnano = require('cssnano');
const images = require('@rollup/plugin-image');
const postcss = require('rollup-plugin-postcss');

const globals = {
  'vue-router': "VueRouter",
  '@fortawesome/free-regular-svg-icons': "FontAwesomeFreeRegular",
  '@fortawesome/vue-fontawesome': "VueFontAwesome",
  vue: 'Vue'
}

module.exports = {
  rollup(config, options) {
    for (let key in globals) config.output.globals[key] = globals[key]
    config.plugins = [
      images({ include: ['**/*.png', '**/*.jpg', '**/*.svg'] }),
      postcss({
        plugins: [
          // cssnano({
          //   preset: 'default',
          // }),
        ],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      }),
      ...config.plugins
    ]
    return config
  },
}