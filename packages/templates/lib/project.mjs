import { checkDirectoryExists, copyToDestination, getSourcePath, interpolateFilesAndPaths } from './common.mjs'
import { fileURLToPath } from 'url';
import fs from 'fs-extra'
import path from 'path'
import enquirer from 'enquirer'
const potionx_version = "0.2.17"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (yargs) => {
  const argv = yargs.argv
  const context = {
    componentName: argv._[1] || "potionx",
    componentType: argv._[0],
    destination: argv.destination,
    source: null
  }
  context.source = getSourcePath(context)

  checkDirectoryExists(
    context.source,
    `component or theme doesn't exist: ${context.componentName}`
  )
  const config = await import("file://" + path.join(context.source, 'template.config.mjs'))

  try {
    const values = await config.getValues(context, enquirer.prompt, argv)
    context.destination = context.destination || path.join(process.cwd())
    if (fs.existsSync(path.join(context.destination, values.appName))) {
      throw new Error(`directory ${values.appName} already exists in destination`)
    } else {
      copyToDestination(context, values.appName)
      interpolateFilesAndPaths(
        context,
        values.appName,
        values
      )

      const componentsConfig = await config.components()
      Object.keys(componentsConfig.components)
      .forEach(componentType => {
        componentsConfig.components[componentType].forEach(componentName => {
          fs.copySync(
            path.resolve(__dirname, '../src', componentType, componentName),
            path.join(context.destination, values.appName, componentsConfig.path, componentType + "s", componentName)
          )
        })
      })
      await config.callback(context, enquirer.prompt, values)
    }
  } catch (e) {
    console.log(e)
  }
}