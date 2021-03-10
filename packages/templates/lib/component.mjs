#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkDirectoryExists = (folder, errorMsg) => {
  try {
    return fs.lstatSync(folder).isDirectory()
  } catch (e) {
    throw Error(errorMsg)
  }
}

export default async (yargs) => {
  yargs = yargs
    .demandCommand(1)
    .demandOption("destination", "Please add destination path")
    .usage(`Usage: $0 <command> <component-name> [options]`)
  const argv = yargs.argv
  const context = {
    componentName: argv._[1],
    componentType: 'component',
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

const toPath = ({componentName, componentType}) => {
  return path.resolve(__dirname, '../src', componentType, componentName)
}