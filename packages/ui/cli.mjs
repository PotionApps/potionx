#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const scriptName = "potionapps-ui"

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
        return true
      }
    }
  )
}

const toPath = ({componentName, componentType}) => {
  return path.join('./templates', componentType + "s", componentName)
}

run()