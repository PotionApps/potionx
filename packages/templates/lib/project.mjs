import { checkDirectoryExists, getSourcePath, interpolateFilesAndPaths } from './common.mjs'
import path from 'path'
import enquirer from 'enquirer'
const potionx_version = "0.2.17"

export default async (yargs) => {
  const argv = yargs.argv
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
  const config = await import(path.join(context.source, 'template.config.mjs'))
  try {
    const values = await config.getValues(context, enquirer.prompt, argv)
    console.log(values)
  } catch (e) {
    console.log(e)
  }
  // copyToDestination(context)
  // interpolateFilesAndPaths(
  //   context,
  //   {
  //     app_module: "Theta",
  //     app_name: "theta"
  //   }
  // )
}