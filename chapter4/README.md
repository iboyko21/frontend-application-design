# Chapter 3 : React


Part 1 of this course introduced webpack, functional components, 
and the virtual DOM.  The concepts presented were important 
because they illustrate at a very basic level what more 
sophisticated frameworks are doing.  As you start to build 
applications with more sophisticated frameworks, you will quickly 
encounter unexpected behaviors.  When this happens fallback on 
your understanding of what the framework is doing under the hood 
to help think through and resolve the issues.

React includes a very sophisticated layer called the Fabric that
is responsible for determing what parts of the DOM to rerender and
when.  The Fabric is tightily integrated with several `hooks`, and together these give
the developer fine grained control over what triggers a rerender of
the application.  

Part 2 explores building an application in React and presents 
useful patterns and guidelines for how to structure the 
application.  

Moving forward we will use all the modern conveniences.  Specifically
we will utilize a toolchain called **Vite** to scaffold our application, and a component 
library called Material UI.


## Pre-reading

* [Vite | Next Generation Frontend Tooling](https://vitejs.dev/)
* [Typescript](https://www.typescriptlang.org/)
* [Material UI](https://mui.com/material-ui/getting-started/overview/)

## Instructions 

### Scaffold a new Vite application

Scaffold a new application using **vite** and the `react-ts` template.  

```
npm create vite@latest react-todo -- --template react-ts
```

**Vite** is a development dependency.  It is a toolchain that provides a fast development
server and serves javascript modules directly to the browser instead of bundling them
like webpack.  

As part of the scaffolding we requested the `react-ts` template.  This template 
includes the **Typescript** dependencies so that some of our code can be written
in Typescript.  

Typescript is a syntax for declaring the types of the arguments received by and returned
by functions.  This is a powerful feature that will prevent accidently sending the wrong
types of information to functions and help catch bugs early in the development cycle. 

Have a look at the contents of the newly created `react-todo` directory.
The contents are a bit different, but it should feel familiar.  There is a `package.json` 
that declares the project's dependencies.  It also defines the commands we can invoke 
with `npm run`.  In this case **vite** preinstalls commmands for `dev`, `build`, and `preview`.
In this case `dev` will run the development server which will refresh as you edit files, 
`build` will build the production code, and `preview` will build the production code but 
preview it in the local browser.   

There is also an `index.html` with the following contents:

```html
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
  ```

  It is defining a root element and loading `/src/main.tsx`, which is also 
  quite familiar.  

  ```js
  # index.tsx
  ...
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

In this case, the ReactDOM is *mounting* React Fabric onto the element with id `root` and rendering `<App />` into that element.  

To view the scaffold, first install the dependencies by running `npm install`,  and then
run `npm run dev`.  The **Vite** development server will start and provide a url to click
on to view the application.

### Replace the Default Application

The default application is pretty, but it doesn't keep track of todo items. 

Create a new file `src/TodoApp.jsx` that exports a functional component with a simple message.
You can use JSX now that react is part of the infrastructure.

```js
import React from 'react';

const TodoApp = () => {

    return (<>
        My Todo App
    </>)
}

export default TodoApp;
```

Now rename `main.tsx` to `main.jsx` and modify it to use the new `TodoApp` component instead of `App`. 

```js
...

import TodoApp from './TodoApp';

...

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>,

...
```

We renamed main to `.jsx` because we are not quite ready to introduce Typescript yet.  

If `npm run dev` is not already running, go ahead and run it now.  The browser tab displaying
the application will now show our very simple message.  

Now that you've proven to yourself you can bootstrap a react app, it is time to dig in to the 
application architecture.

### Layout the Application Directory Structure

There is no standard directory structure for an application, and each project will 
adopt a slightly different approach.  The strategy presented here is a safe starting 
point that reflects a Model-View pattern and anticipates a common layout and an interface
to an external API.  

Create five new directories within the `src` directory as below.
 
```
- react-todo
   - package.json
  +- src
     +- api
     +- layout
     +- models
     +- ui-components
     +- views
      - main.tsx
      - TodoApp.jsx
```

Within the `src` directory there are four new folders.  
 * `api` will house the code that interfaces with the backend
 * `layout` will include the elements that provide a consistent layout for the application.  
 * `models` will include code for managing data 
 * `ui-component` will include components that get reused in different views.
 * `views` will include the code for rendering data in the DOM

### Install a Unit Testing Framework

Unit Testing is a fundamental aspect of modern software development.  This course would be 
lacking if it bypassed such an important aspect of software development, so let's set up a 
unit testing framework right away. 

We will use `vitest`, which is a turn-key testing plugin that works natively with *Vite*.

``` 
npm add -D vitest
```

Now add the following directive to the `scripts` section of `package.json`
```json
  "scripts": {
    ...
    "test": "vitest"
  }
```

### Add a Unit Test


