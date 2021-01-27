const images = require('@rollup/plugin-image');

const globals = {
  vue: 'Vue',
}

module.exports = {
  rollup(config) {
    for (let key in globals) config.output.globals[key] = globals[key]
    config.plugins = [
      images({ incude: ['**/*.png', '**/*.jpg', '**/*.svg'] }),
      ...config.plugins,
    ]
    return config
  },
}