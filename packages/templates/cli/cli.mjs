#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const scriptName = "templates"
import { fileURLToPath } from 'url';
import { checkDirectoryExists, getSourcePath } from '../lib/common.mjs'
import projectMjs from '../lib/project.mjs'
import modelMjs from '../lib/model.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  const yargsInitial =
    yargs(hideBin(process.argv))
    .scriptName(scriptName)
    .command('project', 'Initialize a base project')
    .command('component', 'Copy a component to a destination of your choice')
    .command('theme', 'Copy a theme to a destination of your choice')
    .usage(`Usage: $0 <command> [options]`)
  
  if (yargsInitial.argv._[0] === "project") {
    projectMjs(yargsInitial)
  } else if (yargsInitial.argv._[0] === "model") {
    modelMjs(yargsInitial)
  }
}
run()
