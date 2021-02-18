#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const scriptName = "potionapps-ui"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv =
  yargs(hideBin(process.argv))
  .scriptName(scriptName)
  .command('component', 'Copy a component to a destination of your choice')
  .command('theme', 'Copy a theme to a destination of your choice')
  .demandCommand(2)
  .demandOption("destination", "Please add destination path")
  .usage(`Usage: $0 <command> <component-name> [options]`)
  .argv

const checkDirectoryExists = (folder, errorMsg) => {
  try {
    return fs.lstatSync(folder).isDirectory()
  } catch (e) {
    throw Error(errorMsg)
  }
}

const fixConfigPaths = (context) => {
  const viteConfigPath = 
    path.join(context.destination, context.componentName, "vite.config.ts")
  const viteConfig = fs.readFileSync(viteConfigPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    viteConfigPath,
    viteConfig
    .replace(`resolve(__dirname, '../..')`, `resolve(__dirname, './src')`)
    .replace(`'../../components',`, '')
  )
  const tsConfigPath = 
    path.join(context.destination, context.componentName, "tsconfig.json")
  const tsConfig = fs.readFileSync(tsConfigPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    tsConfigPath,
    tsConfig.replace(
      `"root/*": ["../../*"]`,
      `"root/*": ["./src/*"]`
    )
  )
}

const run = () => {
  const context = {
    componentName: argv._[1],
    componentType: argv._[0],
    destination: argv.destination,
    source: null
  }
  context.source = toPath(context)

  checkDirectoryExists(
    context.source,
    `component or theme doesn't exist: ${context.componentName}`
  )
  
  // copy over to destination
  fs.copySync(
    context.source,
    path.join(context.destination, context.componentName),
    {
      filter: (src, dest) => {
        if (
          src.includes('.stories.') ||
          src.includes('/config.json') ||
          src.includes('index.html') ||
          src.includes('node_modules')
        ) return false
        return true
      }
    }
  )
  
  // copy required components
  if (context.componentType === "theme") {
    fixConfigPaths(context);
    (fs.readJSONSync(path.join(context.source, 'config.json')).components || [])
      .forEach(comp => {
        fs.copySync(
          toPath({componentName: comp, componentType: 'component'}),
          path.join(context.destination , context.componentName, 'src', 'components', comp)
        )
      })
  }
}

const toPath = ({componentName, componentType}) => {
  return path.resolve(__dirname, '../src/templates', componentType + "s", componentName)
}

run()