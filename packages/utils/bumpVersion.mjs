import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const themes =
  fs.readdirSync('../ui/src/templates/themes/', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

themes.forEach(
  theme => {
    const src = JSON.parse(
      fs.readFileSync(`../ui/src/templates/themes/${theme}/package.json`)
    )
    src.dependencies["@potionapps/utils"] = packageJson.version
    fs.writeFileSync(`../ui/src/templates/themes/${theme}/package.json`, JSON.stringify(src, null, 2))
  })