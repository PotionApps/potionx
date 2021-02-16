const config = require('./src/templates/themes/admin/tailwind.config.js')

module.exports = {
    darkMode: false, // or 'media' or 'class'
    theme: config.theme,
    variants: config.variants
}