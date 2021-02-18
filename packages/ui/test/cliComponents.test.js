const fs = require('fs-extra')
const { spawnSync } = require('child_process')

afterEach(() => {
  fs.removeSync('./test/tmp')
});

test('Copies a component to the target directory', () => {
  fs.removeSync('./test/tmp')
  fs.mkdirSync('./test/tmp/components', {recursive: true})
  spawnSync('node', ['./cli/cliComponents.mjs', 'component', 'Btn', '--destination=./test/tmp/components'])
  expect(fs.existsSync('./test/tmp/components/Btn/Btn.tsx')).toEqual(true)
  fs.removeSync('./test/tmp')
});

test('Copies the admin theme to the target directory and outputs correct files', () => {
  fs.removeSync('./test/tmp')
  fs.mkdirSync('./test/tmp/themes', {recursive: true})

  const themeConfig = fs.readJSONSync('./src/templates/themes/admin/config.json')
  const dest = './test/tmp/themes/admin'

  spawnSync('node', ['./cli/cliComponents.mjs', 'theme', 'admin', '--destination=./test/tmp/themes'])
  ;[
    'config.json',
    'index.html'
  ].forEach(f => {
    expect(fs.existsSync(`${dest}/${f}`)).toEqual(false)
  })
  expect(
    fs.readFileSync(`${dest}/vite.config.ts`, {encoding: 'utf-8'})
    .includes(
      `'root': resolve(__dirname, './src'),`
    )
  ).toEqual(true)
  expect(
    fs.readFileSync(`${dest}/vite.config.ts`, {encoding: 'utf-8'})
    .includes(
      `../../components`
    )
  ).toEqual(false)
  expect(
    fs.readFileSync(`${dest}/tsconfig.json`, {encoding: 'utf-8'})
    .includes(
      `"root/*": ["./src/*"]`
    )
  ).toEqual(true)

  themeConfig.components.forEach(c => {
    expect(fs.existsSync(`${dest}/src/components/${c}`)).toEqual(true)
  })
});