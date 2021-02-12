import fs from 'fs'

const mix = fs.readFileSync(`./mix.exs`, { encoding: 'utf-8' })
const [_, version] = mix.match(/version: "([^,]+)"/)
if (!version) throw new Error('missing Potionx version')
const project = fs.readFileSync('./installer/lib/potionx_new/project.ex', { encoding: 'utf-8' })

fs.writeFileSync(
  `./installer/lib/potionx_new/project.ex`,
  project.replace(/potionx_version: "(.*)",/, `potionx_version: "${version}",`)
)
