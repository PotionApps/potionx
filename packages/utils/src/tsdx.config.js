const globals = {
  '@fortawesome/vue-fontawesome': "VueFontAwesome",
  vue: 'Vue'
}

module.exports = {
  rollup(config, options) {
    for (let key in globals) config.output.globals[key] = globals[key]
    config.plugins = [
      ...config.plugins
    ]
    return config
  },
}