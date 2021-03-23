# UI Generators

## Generating UI components

The following command can be used to copy over a UI component to your project:
```bash
npx @potionapps/templates component <some-component-name> --destination=<some-destination>
```

Example usage: 
```
npx @potionapps/templates component Btn --destination=./frontend/admin/src/components
```
This would move the ```Btn``` component to your project.

> **Warning:** Running this command for a component that is already in your project will overwrite your current file.

