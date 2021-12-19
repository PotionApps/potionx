import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const themes =
  fs.readdirSync('../templates/src/project/potionx/frontend/', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

themes.forEach(
  theme => {
    const src = JSON.parse(
      fs.readFileSync(`../templates/src/project/potionx/frontend/${theme}/package.json`)
    )
    src.dependencies["@potionapps/utils"] = packageJson.version
    fs.writeFileSync(`../templates/src/project/potionx/frontend/${theme}/package.json`, JSON.stringify(src, null, 2))
  })