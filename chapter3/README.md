# React Project

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

## Pre-reading

## Instructions 

### Setup the Project

Run `git checkout chapter3` to create a new directory named `react-todo` with a basic
`package.json` and `webpack.config.js`

#### Create the Project Directory Structure
First create the directory structure that will house the application.  

```
- react-todo
   - package.json
   - webpack.config.js
  +- src
     +- api
     +- layout
     +- models
     +- ui-components
     +- views
      - index.jsx
      - TodoApp.jsx
```

There is no standard directory structure, and each project may 
adopt a slightly different approach, but this is a safe starting 
point.  

This project will utilize a Model-View design pattern.  
The *Models* are containers for data with and have no dependencies
on the DOM or any visual representation.  Separating the code that is concerned with visual representation from the code that is concerned with data management makes the application simpler to read and more adaptable to change.

Within the `src` directory there are four new folders.  
 * `api` will house the code that interfaces with the backend
 * `layout` will include the elements that provide a consistent layout for the application.  
 * `models` will include code for managing data 
 * `ui-component` will include components that get reused in different views.
 * `views` will include the code for rendering data in the DOM

#### Add React and Babel
React requires the installation of additional node modules and some
additional webpack configuration.  Not only does the react library 
itself need to be installed, but webpack must be configured with a loader and rules to transpile the JSX syntax used by React.

Add `react` and `react-dom` to your project

```
npm add react react-dom
```

Now add `babel` to your project as a development dependency.

```
npm add -D @babel/preset-react @babel/preset-env @babel/core
```

Edit `package.json` and include the following babel configuration
```json
  ...
  "babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ]
  },
  ...
```

Edit `webpack.config.js` to include a directive to resolve files with `.jsx` extensions and a rule to load those files with the `babel-loader`.

```javascript
    ...
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    module: {
      rules: [
        ...
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        ...
      ]
    },
```
Add the following code to a file named `src/index.jsx`

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import TodoApp from './TodoApp';

// Create the root element.
const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);

// Render the application in the root element.
root.render(<TodoApp />);
```

Finally create a file named `src/TodoApp.jsx` that returns 
a JSX fragment.

```js
import React from 'react';

export default function TodoApp() {
    return (<h1>My Todo Lists</h1>)
}
```

Run the application by typing `npm run start`.


### Add a Unit Test

Unit Testing is a fundamental aspect of software development.  
Develop a habit of writing unit tests and you will find bugs very 
early in the development cycle.

There are many choices for unit testing frameworks.  This tutorial will use [Jest](https://jestjs.io/)

Install jest 
```
npm add -D jest react-test-renderer
```

Here we will use `react-test-renderer` to render an expectation of 
what we expect a component to produce into a variable named `tree`.  Then we will compare that to what is actually rendered using `expect(tree).toMatchSnapshot()`.  


## References

* https://www.robinwieruch.de/minimal-react-webpack-babel-setup/


