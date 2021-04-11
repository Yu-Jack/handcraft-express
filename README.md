# handcraft-express

This repository will implement the minimum function of express to practic how to do DDD.  
Including the following features of express.   

[ ] GET, POST  
[ ] middleware function which could go next router  

Here, we'll use supertest to test our handcraft-express.  
But, supertest accept the function as parameter, so our handcraft-epress must be return the type of function.  

Then use typescript reflect-metadata to build the next.js.  

## TODO

[ ] Implement not found handler  
[ ] Enhance the router mapping performance  
[ ] Make some public method into private.  

## Testing

You could run `npm run test` to do test for this library.

## Some tips

You could use `keybindings.json` in vscode to run test with hotkey.  
This is my `keybindings.json` setting.
```
{
    "key": "cmd+shift+r",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "npm run test\r"
    }
}
```