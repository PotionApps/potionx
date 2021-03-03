# UI

The UI packages comes with a collection of ready-made components that are automatically copied into your project upon creation. They can be found under `/src/templates/components` and referred to by referencing `root/components`. 

We are actively adding new components to our toolkit, so if you wish to access components that aren't in your current project, you can manually copy them over using the following command:
```bash
potionapps-ui component <some-component-name> --destination=<some-destination>
```

> **Warning:** Running this command for a component that is already in your project will overwrite your current file. 