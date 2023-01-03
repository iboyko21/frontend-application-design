# Chapter 1: Setup

In this chapter we learn how to setup a front end single page using node and webpack.  

==**Pro Tip**:  Don't Copy and Paste code from these instructions.  If you want to learn something, write the code yourself.==

## Pre-reading (Seriously.)
* `npm help init`
* [export documentation](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)
* [createElement documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
* [appendChild documentation](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
* [mini-html-webpack-plugin README](https://www.npmjs.com/package/mini-html-webpack-plugin)
* [webpack-nano README](https://github.com/shellscape/webpack-nano/blob/master/README.md)

## Instructions


### Create The Project

Change to the root directory of this repository and create
a new directory named `todo-list-project`

Change to the `todo-list-project` directory and run `npm init -y`.
This will create a default `package.json` file.

Add webpack as a dependency.  
```
npm add webpack webpack-nano -D
``` 
The `-D` command will add the packages in the `devDependency`
section of `package.json`. Development dependencies are used 
to build the application, but are not deployed with the application.
`webpack-nano` is used here because it is a lightweight version that meets our needs for this tutorial.

### Try to run Webpack (Spoiler... it won't work)

From the `todo-list-project` directory run the command 
```
node_modules/.bin/wp
```

It will show a number of warnings but only one error, which is  
```
ERROR in main
  Module not found: Error: Can't resolve './src' ...
```

Webpack is telling you there is no `src` directory where it expects to find code. Let's fix this.

### Write some code

Create a `src` directory. 

Create a function that returns an HTML Element.  
Our HTML Element will be a `<div>` element that has 
text that greets a superhero.  Create a file `src/HelloSuperhero.js`
with the following contents:

```js
export default function HelloSuperhero(name) {
    const element = document.createElement("div");
    element.innerHTML = `Hello ${name}`;
    return element;
}
```

Now create a file `src/index.js` with the following contents:

```js
import HelloSuperhero from './HelloSuperhero';

document.body.appendChild(HelloSuperhero("Batman"));
```

The `HelloSuperhero.js` file exports a function that returns a `<div>` element greeting a superhero.

The `index.js` file imports that function and adds the HelloSuperhero component to the document body.

Wait... Is this a *Functional Component*? Not as hard as it sounds is it.

Run webpack again (go ahead and look above if you cannot remember how).  This time you will see a warning, but no errors.  And you should now see a new file `./dist/main.js`... have a look.

Seriously. Stop and look at the contents of `./dist/main.js` **now**.  What did webpack do?

### Fix those webpack warnings.

In the previous section, webpack took two javascript files and bundled them into a single condensed javascript file.  

Webpack also supports plugins that can do fancy things like compile css, embed images, and event *generate an index.html* file. Webpack will also bundle the code differently for a *development* mode versus a *production* mode.  In development we typically want to see useful backtraces and error logs in the console, whereas in production we want the code to load and run quickly.  

In order to direct webpack to do these fancy things, we need a `webpack.config.js` file.  Go ahead and create this file in the project root directory (that is `./todo-list-project`) and add the following: 

```js
const { mode } = require("webpack-nano/argv");

module.exports  = {
    mode
}
```

Run webpack again, but this time include the option `--mode production` (The full command line is `./node_modules/.bin/wp --mode production`).  Notice the errors are gone.  

`webpack.config.js` is a node javascript file, so you can use all
of your fancy javascript tricks like requiring modules and declaring variables.  Webpack expects the configuration file to export a Plain-Old-Javascript-Object (POJO) with the configuration information it needs to build
your application.

Webpack was previously complaining because we had not defined the 
mode: production, development, or none. Now we have made webpack happy because we have told it the mode based on the arguments passed in on the command line (you did the **[pre-reading](https://github.com/shellscape/webpack-nano#custom-flags)**... right????).

Try running webpack again, but this time specify `development` mode.  How is `./dist/main.js` different?

### What about that `index.html` file

Let's add a plugin to generate an `index.html` file.  We will use the lightweight [`mini-html-webpack-plugin`](https://www.npmjs.com/package/mini-html-webpack-plugin), but there is also a [full-featured plugin](https://webpack.js.org/plugins/html-webpack-plugin/) for projects that require the additional features. 

Install the plugin as follows:
```
npm add mini-html-webpack-plugin -D
```
Check `package.json` to convince yourself the plugin was installed.

Now update `webpack.config.js` as follows:
```js
const { mode } = require("webpack-nano/argv");
const {
  MiniHtmlWebpackPlugin,
} = require("mini-html-webpack-plugin");

module.exports = {
  mode,
  plugins: [
    new MiniHtmlWebpackPlugin({ context: { title: "Superhero Greeter" } }),
  ],
};
  ```
Notice that the plugin is first required, and then exported in the `plugins` property of the returned object.

Run webpack again.  Notice the `./dist` directory now includes an `index.html` file.  Pretty slick ;-)

Run a local webserver
```
npx serve dist
```
and you :fingers_crossed: will see a webpage that greets your superhero of choice.

To stop the server type `ctrl-c`. 

### Add a build shortcut

It is convenient to run the build from `npm`.  To 
do this add the following to the `scripts` section of `package.json`.

```
    "build": "wp --mode production",
```
This tells **node** which command to run to build the application.  Now `npm run build` will build the distribution of the application.  Go ahead and try it now.

### How to avoid building every time?  The development server.

Build your application and run the webserver.  Now change the name of the superhero you are greeting in `index.js`.  Reload your browser and you will notice that the old superhero name is still showing.  In order to see the changes you just made, you need to shutdown the webserver, rebuild the application, and restart the webserver.  That's a pain.

Eliminate this workflow by installing the development server.  

First add the `webpack-plugin-serve` node module to your todo-list project.
```
npm add webpack-plugin-serve -D
```
Now update `webpack.config.js` to configure the plugin:
1) Require the module
```js
const { WebpackPluginServe } = require("webpack-plugin-serve");
```
2) Add the plugin to the `plugins` array. 
```
    new WebpackPluginServe({
      port: parseInt(process.env.PORT, 10) || 8080,
      static: "./dist",
      liveReload: true,
      waitForBuild: true,
    }),
```

3) Add an `entry` point so webpack knows where to look for source code.
```
  entry: ["./src", "webpack-plugin-serve/client"],
```

4) Instruct webpack to watch for changes in source files when in development mode.
```
  watch: mode === "development",
```

When you are complete, your `webpack.config.js` should look like this:

```json
const { mode } = require("webpack-nano/argv");
const {
    MiniHtmlWebpackPlugin,
} = require("mini-html-webpack-plugin");
const {WebpackPluginServe} = require("webpack-plugin-serve");

module.exports = {
    mode,
    entry: ["./src", "webpack-plugin-serve/client"],
    watch: mode === "development",
    plugins: [
        new MiniHtmlWebpackPlugin({
            context: {
                title: "Superhero Greeter"
            }
        }),
        new WebpackPluginServe({
            port: parseInt(process.env.PORT, 10) || 8080,
            static: "./dist",
            liveReload: true,
            waitForBuild: true,
        }),
    ]
}
```

Finally, add a shortcut to `package.json` so that you can launch the development server with the command `npm run start`.  Add the following to the `scripts` array in `package.json`
```
"start": "wp --mode development"
```

Launch the development server, then edit the superhero name in `index.js` and reload your browser window.  Ta Da!

### Commit your work

Commit your work before moving on.  This way you can return to this point and compare your work with the solutions as you progress.

```
# Assuming you are still in the todo-list-project directory
git add .
git commit -m "Finished Chapter 1"
```

## Summary

In this chapter we initialized a node application and configured
a bare-bones webpack application from scratch. We then configured the webpack development server so that changes to our source code will be immediately rebuilt.  

Run `git checkout chapter1-solution` to see what the solution looks like.   

## References
This tutorial was heavily influenced by the excellent work at https://survivejs.com.  I *strongly* recommend this resource.

* https://survivejs.com/webpack