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
when.  The Fabric is tightily integrated with several `hooks` give
the developer fine grained control over what triggers a rerender of
the application.  

Part 2 explores building an application in React and presents 
useful patterns and guidelines for how to structure the 
application.  

Moving forward we will use all the modern conveniences.  Specifically
we will utilize a toolchain called **Vite** to scaffold our application. 


## Pre-reading

* [Vite | Next Generation Frontend Tooling](https://vitejs.dev/)
* [Typescript](https://www.typescriptlang.org/)

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
includes the **Typescript** dependencies so that we some modules can be written
in Typescript.  

Typescript is a syntax for declaring the types of the arguments received by and returned
by functions.  This is a powerful feature that will prevent accidently sending the wrong
types of information to functions and help catch bugs early in the development cycle. 

Have a look at the contents of the newly created `react-todo` directory.
The contents are a bit different, but it should feel familiar.  There is a `package.json` 
that declares the project's dependencies.  It also defines the commands we can invoke 
with `npm run`.  In this case **vite** preinstalls commmands for `dev`, `build`, and `preview`.
In this case `dev` will run the development server which will refresh as you edit files, `build` will build the production code, and `preview` will build the production code but 
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

Now modify `main.jsx` to use the new `TodoApp` component instead of `App`. 

```js
...

//@ts-ignore
import TodoApp from './TodoApp';

...

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>,

...
```

The `//@ts-ignore` annotation is included because `main.tsx` is a typescript file, and
therefore expects all imports to be typed, but `TodoApp` is not typed.  We will use typescript
in the project, but not quite yet.  

If `npm run dev` is not already running, go ahead and run it now.  The browser tab displaying
the application will now show our very simple message.  

Now that you've proven to yourself you can bootstrap a react app, it is time to dig in to the 
application architecture.

### Layout the Application Directory Structure

There is no standard directory structure for an application, and each project will 
adopt a slightly different approach.  This strategy presented here is a safe starting 
point.  

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

### Create the Data Models

This project will utilize a Model-View design pattern.  The *Models* are containers for data 
and have no dependencies on the DOM or any visual representation.  Separating the code 
that is concerned with visual representation from the code that is concerned with data 
management makes the application simpler to read and more adaptable to change.

We will use Typscript for the data models because it is critically important to make 
sure each element of data is precisely what we expect it to be.  Unexpected `undefined` 
values or `nulls`, or using a `string` instead of `Date` can have a disastrous impact
on the application.

Create two files `src/models/TodoList.ts` and `src/models/TodoItem.ts`

