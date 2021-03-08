import crypto from 'crypto'
import { snakeCaseToModuleCase } from '../../../lib/common.mjs';

export const callback = async (context, prompt, values) => {
  const { installDeps } = await prompt(
    {
      name: 'installDeps',
      message: "Install dependencies?",
      type: "question"
    }
  )
  const { migration } = await prompt(
    {
      name: 'migration',
      message: "Run database preparation?",
      type: "question"
    }
  )
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
  const potionx_version = "0.2.17";


  // confirm directory
  // allow to skip process by passing parsed args into context
  // ask if deps should be installed
  // install deps 
  // ask if migrations should be run
  return {
    ...initialValues,
    ...collected,
    adapterApp: "postgrex",
    appModule: appNameModuleCase,
    endpointModule: appNameModuleCase + "Web.Endpoint",
    graphqlNamespace: appNameModuleCase + "GraphQl",
    libWebName: appName + "_web",
    lvSigningSalt: crypto.randomBytes(8).toString('hex'),
    potionxDep: `"~> ${potionx_version}"`,
    secretKeyBase: crypto.randomBytes(64).toString('hex'),
    signingSalt: crypto.randomBytes(8).toString('hex'),
    webAppName: appName,
    webNamespace: appNameModuleCase + "Web"
  }
}