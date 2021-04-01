const fs = require('fs-extra')
const { spawnSync } = require('child_process')

afterEach(() => {
  fs.removeSync('./test/tmpRoutes')
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

  spawnSync('node', ['./cli/cli.mjs', 'model', 'Records', 'Record', '--destination=./test/tmpRoutes'], {
    encoding: "utf-8"
  })
  ;[
    'RouteRecordEdit',
    'RouteRecordList'
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
          label: "Records",
          to: {
            name: routeNames.recordList
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
        component: {
          render: () => h(resolveComponent('RouterView'))
        },
        path: '/record-list',
        children: [
          {
            name: routeNames.recordList,
            path: '',
            component: RouteRecordList
          },
          {
            name: routeNames.recordEdit,
            path: ':id',
            component: RouteRecordEdit
          }
        ]
      }
    )
    `,
    `
    import RouteRecordList from './RouteRecordList/RouteRecordList'
    import RouteRecordEdit from './RouteRecordEdit/RouteRecordEdit'
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
      recordList = "recordList",
      recordEdit = "recordEdit"
      `.replace(/\s|\r|\n/g, '')
    )
  ).toEqual(true)
});