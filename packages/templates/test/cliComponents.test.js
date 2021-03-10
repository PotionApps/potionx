const fs = require('fs-extra')
const { spawnSync } = require('child_process')

afterEach(() => {
  fs.removeSync('./test/tmp')
});

test('Copies a component to the target directory', () => {
  fs.removeSync('./test/tmp')
  fs.mkdirSync('./test/tmp/components', {recursive: true})
  spawnSync('node', ['./cli/cli.mjs', 'component', 'Btn', '--destination=./test/tmp/components'], {
    encoding: "utf-8"
  })
  expect(fs.existsSync('./test/tmp/components/Btn/Btn.tsx')).toEqual(true)
});