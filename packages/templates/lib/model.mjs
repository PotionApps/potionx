import { checkDirectoryExists, copyToDestination, interpolateFilesAndPaths } from './common.mjs'
import { fileURLToPath } from 'url';
import fs from 'fs-extra'
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const addToRoutes = (context) => {
  const pathToRoutes = path.join(context.destination, "src", "routes", "index.ts")
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
          `nav.value.push(`,
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

export default async (yargs) => {
  yargs = yargs
    .demandCommand(3)
    .demandOption("destination", "Please add path to theme")

  const argv = yargs.argv
  const model = argv._[2]
  const context = {
    context: argv._[1],
    model,
    modelGraphqlCase: model.slice(0, 1).toLowerCase() + model.slice(1),
    destination: argv.destination,
    source: null
  }
  const routeEdit = replaceTempVars(fs.readFileSync(getSourcePath('RouteEdit'), { encoding: 'utf-8'}), context)
  const routeList = replaceTempVars(fs.readFileSync(getSourcePath('RouteList'), { encoding: 'utf-8'}), context)
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

const getSourcePath = (routeName) => {
  return path.resolve(__dirname, `../src/route/${routeName}.tsx`)
}

const replaceTempVars = (text, ctx) => {
  return text
    .replace(/__model_graphql_case__/g, ctx.modelGraphqlCase)
    .replace(/__model__/g, ctx.model)
    .replace(/__context__/g, ctx.context)
}

