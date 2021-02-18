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
  .demandCommand(2)
  .usage(`Usage: $0 <command> <context> <model> [options]`)
  .argv

const addToRoutes = (context) => {
  const pathToRoutes = path.join(context.destination, "src", "crudRoutes", "index.ts")
  let routes = fs.readFileSync(pathToRoutes, { encoding: 'utf-8' })
  routes = ['Edit', 'List'].reduce((acc, key) => {
    if (!routes.includes(`Route${context.model}${key}`)) {
      acc =
        `import Route${context.model}${key} from './Route${context.model}${key}/Route${context.model}${key}'\r\n`
        + acc
      acc += "\r\n\r\n"
      acc +=
      [
        `routes.push(`,
        `  {`,
        `    name: routeNames.${context.modelGraphqlCase}${key},`,
        `    path: '/${camelToDashCase(context.modelGraphqlCase)}-list${key === "Edit" && '/:id' || ''}',`,
        `    component: Route${context.model}${key}`,
        `  }`,
        `)`
      ].join('\r\n')
    }
    return acc
  }, routes)
  fs.writeFileSync(pathToRoutes, routes)
}

const addToRouteNames = (context) => {
  const pathToRouteNames = path.join(context.destination, "src", "routes", "routeNames.ts")
  let routeNames = fs.readFileSync(pathToRouteNames, { encoding: 'utf-8' })
  routeNames = ['Edit', 'List'].reduce((acc, key) => {
    if (!routeNames.includes(`${context.modelGraphqlCase}${key}`)) {
      return acc.replace(
        "export enum routeNames {",
        [
          `export enum routeNames {`,
          `  ${context.modelGraphqlCase}${key} = "${context.modelGraphqlCase}${key}",`
        ].join('\r\n')
      )
    }
    return acc
  }, routeNames)
  fs.writeFileSync(pathToRouteNames, routeNames)
}

const addToNav = (context) => {
  const pathToNav = path.join(context.destination, "src", "useAdminNavPrimary.ts")
  let nav = fs.readFileSync(pathToNav, { encoding: 'utf-8' })
  nav = ['List'].reduce((acc, key) => {
    if (!nav.includes(`${context.modelGraphqlCase}List`)) {
      acc += [
          ``,
          `nav.push(`,
          `  {`,
          `    label: "${context.model}s",`,
          `    to: {`,
          `      name: routeNames.${context.modelGraphqlCase}List`,
          `    }`,
          `  }`,
        `)`
      ].join('\r\n')
    }
    return acc
  }, nav)
  fs.writeFileSync(pathToNav, nav)
}

const camelToDashCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

const checkFileExists = (f, errorMsg) => {
  try {
    return fs.existsSync(f)
  } catch (e) {
    throw Error(errorMsg)
  }
}

const run = () => {
  const model = argv._[1]
  const context = {
    context: argv._[0],
    model,
    modelGraphqlCase: model.slice(0, 1).toLowerCase() + model.slice(1),
    destination: "./frontend/admin",
    source: null
  }
  context.source = toPath(context)

  checkFileExists(
    context.source,
    `component or theme doesn't exist: ${model}`
  )

  const routeEdit = replaceTempVars(fs.readFileSync(toPath('RouteEdit'), { encoding: 'utf-8'}), context)
  const routeList = replaceTempVars(fs.readFileSync(toPath('RouteList'), { encoding: 'utf-8'}), context)
  
  const pathEdit = path.join(
    context.destination, "src", "routes", `Route${context.model}Edit`
  )
  if (!fs.existsSync(pathEdit)) {
    fs.mkdirSync(pathEdit)
  }
  const pathList = path.join(
    context.destination, "src", "routes", `Route${context.model}List`
  )
  if (!fs.existsSync(pathList)) {
    fs.mkdirSync(pathList)
  }

  fs.writeFileSync(
    path.join(
      context.destination, "src", "routes", `Route${context.model}Edit`, `Route${context.model}Edit.tsx`
    ),
    routeEdit
  )
  fs.writeFileSync(
    path.join(
      context.destination, "src", "routes", `Route${context.model}List`, `Route${context.model}List.tsx`
    ),
    routeList
  )

  addToNav(context)
  addToRoutes(context)
  addToRouteNames(context)
}

const replaceTempVars = (text, ctx) => {
  return text
    .replace(/TEMP_model_graphql_case/g, ctx.modelGraphqlCase)
    .replace(/TEMP_model/g, ctx.model)
    .replace(/TEMP_context/g, ctx.context)
}

const toPath = (routeName) => {
  return path.resolve(__dirname, `../src/templates/routes/${routeName}.tsx`)
}

run()