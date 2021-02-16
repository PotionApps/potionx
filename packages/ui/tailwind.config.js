const config = require('./src/templates/themes/admin/tailwind.config.js')

module.exports = {
    purge: [
        'src/**/*.tsx?',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: config.theme,
    variants: config.variants
}