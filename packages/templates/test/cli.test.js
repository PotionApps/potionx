const fs = require('fs-extra')
const { spawnSync } = require('child_process')

afterEach(() => {
  // fs.removeSync('./test/tmpRoutes')
});

test('Generates a CRUD Route in the target directory', () => {
  fs.removeSync('./test/tmpRoutes')
  fs.mkdirSync('./test/tmpRoutes/src/routes', {recursive: true})
  const dest = './test/tmpRoutes/src'

  fs.copyFileSync(
    './src/project/potionx/frontend/admin/src/useAdminNavPrimary.ts',
    `${dest}/useAdminNavPrimary.ts`
  ) 
  fs.copyFileSync(
    './src/project/potionx/frontend/admin/src/routes/index.ts',
    `${dest}/routes/index.ts`
  ) 
  fs.copyFileSync(
    './src/project/potionx/frontend/admin/src/routes/routeNames.ts',
    `${dest}/routes/routeNames.ts`
  ) 
  // routes
  // routeNames

  spawnSync('node', ['./cli/cli.mjs', 'model', 'Users', 'User', '--destination=./test/tmpRoutes'], {
    encoding: "utf-8"
  })
  ;[
    'RouteUserEdit',
    'RouteUserList'
  ].forEach(f => {
    expect(fs.existsSync(`${dest}${f}`)).toEqual(false)

    const data = fs.readFileSync(`${dest}/routes/${f}/${f}.tsx`, {encoding: 'utf-8'})

    expect(data.includes('__')).toEqual(false)
  })

  expect(
    fs.readFileSync(`${dest}/useAdminNavPrimary.ts`, {encoding: 'utf-8'})
    .replace(/\s|\r|\n/g, '')
    .includes(
      `
      nav.value.push(
        {
          label: "Users",
          to: {
            name: routeNames.userList
          }
        }
      )
      `.replace(/\s|\r|\n/g, '')
    )
  ).toEqual(true)
  

  const routesIndex =
    fs.readFileSync(`${dest}/routes/index.ts`, {encoding: 'utf-8'})
     .replace(/\s|\r|\n/g, '')
  ;[
    `
    routes.push(
      {
        name: routeNames.userEdit,
        path: '/user-list/:id',
        component: RouteUserEdit
      }
    )
    `,
    `
    routes.push(
      {
        name: routeNames.userList,
        path: '/user-list',
        component: RouteUserList
      }
    )
    `,
    `
    import RouteUserList from './RouteUserList/RouteUserList'
    import RouteUserEdit from './RouteUserEdit/RouteUserEdit'
    `
  ].forEach(excerpt => {
    expect(
      routesIndex.includes(excerpt.replace(/\r|\n|\s/g, ''))
    ).toEqual(true)
  })

  expect(
    fs.readFileSync(`${dest}/routes/routeNames.ts`, {encoding: 'utf-8'})
    .replace(/\s|\r|\n/g, '')
    .includes(
      `
      userList = "userList",
      userEdit = "userEdit"
      `.replace(/\s|\r|\n/g, '')
    )
  ).toEqual(true)
});