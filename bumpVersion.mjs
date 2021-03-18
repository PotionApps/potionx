import fs from 'fs'

const mix = fs.readFileSync(`./mix.exs`, { encoding: 'utf-8' })
const [_, version] = mix.match(/version: "([^,]+)"/)
if (!version) throw new Error('missing Potionx version')
const project = fs.readFileSync('./packages/templates/src/project/potionx/template.config.mjs', { encoding: 'utf-8' })

fs.writeFileSync(
  './packages/templates/src/project/potionx/template.config.mjs',
  project.replace(/potionx_version = "(.*)"/, `potionx_version = "${version}"`)
)
