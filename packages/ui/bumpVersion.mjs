import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

['admin'].forEach(
  theme => {
    const src = JSON.parse(
      fs.readFileSync(`./src/templates/themes/${theme}/package.json`)
    )
    src.dependencies["@potionapps/ui"] = packageJson.version
    fs.writeFileSync(`./src/templates/themes/${theme}/package.json`, JSON.stringify(src, null, 2))
  })