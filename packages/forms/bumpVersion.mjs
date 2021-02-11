import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

['admin'].forEach(
  theme => {
    const src = JSON.parse(
      fs.readFileSync(`../ui/src/templates/themes/${theme}/package.json`)
    )
    src.dependencies["@potionapps/forms"] = packageJson.version
    fs.writeFileSync(`../ui/src/templates/themes/${theme}/package.json`, JSON.stringify(src, null, 2))
  })