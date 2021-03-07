import { fileURLToPath } from 'url';
import ejs from 'ejs'
import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const checkDirectoryExists = (folder, errorMsg) => {
  try {
    return fs.lstatSync(folder).isDirectory()
  } catch (e) {
    throw Error(errorMsg)
  }
}

export const copyToDestination = (context) => {
  fs.copySync(
    context.source,
      path.join(context.destination, context.componentName),
    {
      filter: (src, dest) => {
        if (
          src.includes('.stories.') ||
          src.includes(path.sep + 'config.json') ||
          src.includes('index.html') ||
          src.includes([context.componentName, 'node_modules'].join(path.sep)) ||
          src.includes('.dev.') ||
          src.includes('__') ||
          src.includes('package-lock')
        ) return false
        return true
      }
    }
  )
}

export const getSourcePath = ({componentName, componentType}) => {
  return path.resolve(__dirname, '../src/', componentType, componentName)
}

export const interpolateFile = async(filePath, values) => {
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8'})
  if (fileContent.includes('<%')) {
    try {
      fs.writeFileSync(
        filePath,
        ejs.render(fileContent, values),
      )
    } catch (e) {
      console.log(e)
      console.log(`Problem with: ${filePath}`)
    }
  }
}

export const interpolateFilesAndPaths = async (context, values) => {
  const items = [] // files, directories, symlinks, etc
  await klaw(path.join(context.destination, context.componentName))
    .on('data', item => {
      items.push(item.path)
    })
    .on('end', () => {
      items.sort((a, b) => {
        return b.length - a.length;
      })
      items.forEach(itemPath => {
        const parts = itemPath.split(path.sep)
        const lastPart = parts.pop()
        if (fs.lstatSync(itemPath).isFile()) {
          interpolateFile(itemPath, values)
        }
        if (lastPart.includes('{{')) {
          const match = lastPart.match(/\{\{\s?([^\s\}]+)\s?\}\}/)
          if (match && match[1] && values[match[1]]) {
            const pattern = new RegExp(`{{(.*)}}`, "g")
            fs.renameSync(
              itemPath,
              parts.concat(
                [lastPart.replace(pattern, values[match[1]])]
              ).join(path.sep)
            )
          }
        }
      })
    })
}

export const snakeCaseToModuleCase = (snake_case) => {
  return snake_case.split('_').map(k =>{
    return k.slice(0, 1).toUpperCase() + k.slice(1)
  }).join('');
}