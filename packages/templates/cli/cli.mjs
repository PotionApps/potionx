#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const scriptName = "potionapps-templates"
import { fileURLToPath } from 'url';
import { checkDirectoryExists, getSourcePath } from '../lib/common.mjs'
import baseMjs from '../lib/base.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// copy over files with fs.copySync
// rename all folders

const argv =
  yargs(hideBin(process.argv))
  .scriptName(scriptName)
  .command('base', 'Copy the Potion base to a destination of your choice')
  .command('component', 'Copy a component to a destination of your choice')
  .command('theme', 'Copy a theme to a destination of your choice')
  .demandCommand(2)
  .demandOption("destination", "Please add destination path")
  .usage(`Usage: $0 <command> <component-name> [options]`)
  .argv

const run = async () => {
  const context = {
    componentName: argv._[1],
    componentType: argv._[0],
    destination: argv.destination,
    source: null
  }
  context.source = getSourcePath(context)

  checkDirectoryExists(
    context.source,
    `component or theme doesn't exist: ${context.componentName}`
  )
  
  if (context.componentType === "base") {
    baseMjs(context)
  }
}

run()