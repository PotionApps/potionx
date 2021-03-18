import crypto from 'crypto'
import { snakeCaseToModuleCase } from '../../../lib/common.mjs';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import path from 'path'
import { spawnSync } from 'child_process'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const callback = async (context, prompt, values) => {
  fixConfigPaths(context, values)
  if (values.installDeps === undefined) {
    const { installDeps } = await prompt(
      {
        initial: true,
        name: 'installDeps',
        message: "Install dependencies?",
        type: "confirm"
      }
    )
    values.installDeps = installDeps
    
  }

  if (values.installDeps) {
    const depsRes = spawnSync('mix', ['deps.get'], { cwd: path.join(context.destination, values.appName), encoding: 'utf-8', shell: true })
    console.log("Installing Deps...")
    if (depsRes.status !== 0) {
      console.log("Elixir dependency fetching failed. Log:")
      console.log(depsRes.stdout)
    }
    const jsRes = spawnSync('npm', ['install'], { cwd: path.join(context.destination, values.appName, "frontend", "admin"), shell: true, encoding: 'utf-8'})
    if (jsRes.status !== 0) {
      console.log("JS deps fetching failed. Log:")
      console.log(migrationRes.stdout)
    }
  }
  if (values.runMigrations === undefined) {
    const { migration } = await prompt(
      {
        initial: true,
        name: 'migration',
        message: "Run database preparation?",
        type: "confirm"
      }
    )
    values.runMigrations = migration
  }
  if (values.runMigrations) {
    console.log("Running database set up... (this may be long due to compilation)")
    const migrationRes = spawnSync('mix', ['ecto.setup'], { cwd: path.join(context.destination, values.appName), shell: true, encoding: 'utf-8' })
    if (migrationRes.status !== 0) {
      console.log("Database set up failed. Log:")
      console.log(migrationRes.stdout)
    }
  }
}

export const components = async () => {
  return {
    components: fs.readJSONSync(path.resolve(__dirname, './frontend/admin/config.json')),
    path: "./frontend/admin/src"
  }
}

const dateToTimestamp = (date) => {
  return date.toISOString().replace(/T|:|-/g, '').split('.')[0]
}

export const getValues = async (context, prompt, initialValues) => {
  let appName = initialValues.appName
  let appNameModuleCase
  if (!appName) {
    const appNameResponse = await prompt({
        type: 'input',
        name: 'appName',
        message: 'What directory name should your app have? (snake_case)'
      })
    appName = appNameResponse.appName
  }
  appNameModuleCase = snakeCaseToModuleCase(appName)  
  const toCollect = [] 

  if (!initialValues.email) {
    toCollect.push({
      type: 'input',
      name: 'email',
      message: 'What email to you want to log in with?',
      validate: (s) => {
        return (s || '').split('@').length === 2 ? true : "Should be an email"
      }
    })
  }
  if (!initialValues.localDbUser) {
    toCollect.push(
      {
        type: 'input',
        name: 'localDbUser',
        message: 'What is your local PostgreSQL username?'
      }
    )
  }
  if (initialValues.localDbPassword === undefined) {
    toCollect.push(
      {
        type: 'input',
        name: 'localDbPassword',
        message: 'What is your local PostgreSQL password?'
      }
    )
  }

  const collected = await prompt(toCollect);
  const potionx_version = "0.3.0";


  const timestamp = new Date()
  const timestamp2 = new Date(timestamp.getTime() + 1000)
  const timestamp3 = new Date(timestamp2.getTime() + 1000)
  return {
    potionxDep: `"~> ${potionx_version}"`,
    ...initialValues,
    ...collected,
    adapterApp: "postgrex",
    appModule: appNameModuleCase,
    appName,
    endpointModule: appNameModuleCase + "Web.Endpoint",
    graphqlNamespace: appNameModuleCase + "GraphQl",
    libWebName: appName + "_web",
    lvSigningSalt: crypto.randomBytes(8).toString('hex'),
    secretKeyBase: crypto.randomBytes(64).toString('hex'),
    signingSalt: crypto.randomBytes(8).toString('hex'),
    timestamp: dateToTimestamp(timestamp),
    timestamp2: dateToTimestamp(timestamp2),
    timestamp3: dateToTimestamp(timestamp3),
    webAppName: appName,
    webNamespace: appNameModuleCase + "Web"
  }
}

const fixConfigPaths = (context, values) => {
  const tsConfigPath = 
    path.join(context.destination, values.appName, "frontend", "admin", "tsconfig.json")
  const tsConfig = fs.readFileSync(tsConfigPath, {encoding: 'utf-8'})
  fs.writeFileSync(
    tsConfigPath,
    tsConfig.replace(
      `"components/*": ["../../../../component/*"]`,
      `"components/*": ["./src/components/*"]`,
    )
    .replace(
      `"hooks/*": ["../../../../hook/*"]`,
      `"hooks/*": ["./src/hooks/*"]`,
    )
  )
}

