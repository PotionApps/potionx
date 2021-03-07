import { copyToDestination, interpolateFilesAndPaths } from './common.mjs'

export default (context) => {
  copyToDestination(context)
  interpolateFilesAndPaths(
    context,
    {
      app_module: "Theta",
      app_name: "theta"
    }
  )
}