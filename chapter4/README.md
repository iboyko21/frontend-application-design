# Chapter 4 : React

In this chapter, you will scaffold a React/Typescript application using the *Vite* toolchain, and add a simple unit test.  

Part 1 of this course introduced webpack, functional components, 
and the virtual DOM.  The concepts presented were important 
because they illustrate at a very basic level what more 
sophisticated frameworks are doing.  As you start to build 
applications with more sophisticated frameworks, you will quickly 
encounter unexpected behaviors.  When this happens fallback on 
your understanding of what the framework is doing under the hood 
to help think through and resolve the issues.

React includes a very sophisticated layer called the Fabric that
is responsible for determing what parts of the DOM to render and
when.  The Fabric is tightily integrated with several `hooks`, and together these give
the developer fine grained control over what triggers a re-render of
the application.  

Now the course shifts gears to building an application in React.  The following chapters present
useful patterns and guidelines for how to structure an application.  
From here on we will use all the modern conveniences.  Specifically
we will utilize a toolchain called **Vite** to scaffold our application, and a component 
library called Material UI.


## Pre-reading

* [Vite | Next Generation Frontend Tooling](https://vitejs.dev/)
* [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
* [JSX](https://reactjs.org/docs/introducing-jsx.html)
* [react-testing-library cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)

## Instructions 

### Scaffold a new Vite application

Scaffold a new application using **Vite** and the `react-ts` template.  

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
* `dev` will run the development server which will refresh as you edit files
* `build` will build the production code
* `preview` will preview the output of build in the local browser.   

There is also an `index.html` with the following fragment:

```html
...
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
...
```

  It is defining a root element and loading `/src/main.tsx`, which is also 
  quite familiar.  Within `main.tsx` you will find:

  ```js
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
You can use JSX now that React is part of the infrastructure.

```js
import React from 'react';

const TodoApp = () => {

    return (<>
        My Todo App
    </>)
}

export default TodoApp;
```

Now rename `main.tsx` to `main.jsx` and modify it to use the new `TodoApp` component instead of `App`.  Don't forget to update the script tag in `index.html` with the new name for `main.jsx`.

```js
...

import TodoApp from './TodoApp';

...

ReactDOM.createRoot(document.getElementById('root') /* as HTMLElement */).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>,

...
```

We renamed main to `.jsx` because we are not quite ready to introduce Typescript yet.  

If `npm run dev` is not already running, go ahead and run it now.  The browser tab displaying
the application will now show our very simple message.  

Now that you've proven to yourself you can bootstrap a react app with Vite, it is time to dig in to the 
application architecture.

### Layout the Application Directory Structure

There is no standard directory structure for an application, and each project will 
adopt a slightly different approach.  The strategy presented here is a safe starting 
point that reflects a Model-View pattern and anticipates a common layout and an interface
to an external API.  

Create four new directories within the `src` directory as below.
 
```
- react-todo
  ...
  +- src
     +- api
     +- layout
     +- models
     +- views
      - main.jsx
      - TodoApp.jsx
```

Within the `src` directory there are four new folders.  
 * `api` will house the code that interfaces with the backend
 * `layout` will include the elements that provide a consistent layout for the application.  
 * `models` will include code for managing data 
 * `views` will include the code for rendering data in the DOM

### Create the Application Layout

Inside the `layout` directory create three new files: `Header.jsx`, `Footer.jsx`, and `MainLayout.jsx`.  

Inside `MainLayout.jsx` add the following code that will be the primary layout for the application. 

```js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = (props) => {

    return (
        <>
            <Header />
            <main>
                {props.children}
            </main>
            <Footer />
        </>
    )

}

export default MainLayout;
```

This layout renders a `Header` and a `Footer`, and in between in creates an html5 `<main>` element and populates it 
with the contents of `props.children`.  `children` is a special property that is present on all React nodes. It contains whatever content is present between the start and end tags of the calling component.  

Now populate `Header.jsx` with a brightly colored `Div` element so that it is very obvious as you debug the layout.  You can change the styling later, but it is helpful to make new elements stand out when they are first introduced
into the DOM.  

```js
import React from 'react';

const Header = () => {

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100px',
            backgroundColor: 'aqua',
             border: '1px solid black'
            }}>
            <h1>Header</h1> 
        </div>
    )
}

export default Header;
```

Likewise, populate `Footer.jsx` with this code:

```js
import React from 'react';


const Footer = () => {

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '100px',
            backgroundColor: 'aqua',
            border: '1px solid black'}}>
            <h1>Footer</h1> 
        </div>
    )
}

export default Footer;
```

Finally, modify `TodoApp` to import the MainLayout and return the following: 
```js
    <MainLayout>
        <h1>My Todo App</h1>
    </MainLayout>
``` 

Here `MainLayout` will be called and `props.children` will be automatically assigned to the `<h1>` tag. 

Start the development server (if it isn't already running) and confirm the layout is working as desired.


### Create a View for the TodoList

Our application will be much more interesting if it actually manages a todo list.  Create a new file in
the `src/views` directory named `TodoListView.jsx` that imports `React` and exports a default functional component named 
`TodoListView`.  Use [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 
to allow the component to accept single `prop` named `list`.  

```js
import React from 'react';

const TodoListView = ({list}) => {
    return (<></>);
}

export default TodoListView;
```

React components should never assume that the values passed in as props are defined.  For this reason, 
there is a common syntax in JSX to render when a `prop` is defined, and render something else if it is not.
The syntax makes use of the logical AND operator `&&`.  In javascript the following values are considered *falsy*: `""`, `undefined`, `null`, 
`0`, and `false`.  The logical AND operator will evaluate each argument from left to right
for *truthiness*.  As soon as it encounters something not truthy, it will stop evaluating and return the falsy value, and JSX will not render falsy values. If 
all the arguments are truthy, it will return whatever the last argument evaluated to.  

In the JSX expression below, if `list` is undefined, then `!list` evaluates to `true` and the javascript interpreter evaluates the next argument and returns the truthy value `"No List Selected"`. The expression below it, however, immediately evaluates to `false` so nothing is rendered. The opposite occurs if `list` is defined. 
 
```jsx
{/* List is not defined */}
{!list && "No List Selected"}

{/* List is defined */}
{list && list.name}
```

Wrap the above code in an `<h2>` element and return it from `TodoListView`.  

Now hop back over to `TodoApp.jsx`, import the `TodoListView`, and replace `<h1>My Todo App</h1>` 
with `<TodoListView />`

Confirm that **No List Selected** appears in the application preview.  

Pass an object into `TodoListView` as a prop named `list`.  The object must have a `name`, for example
`<TodoListView list={{name: "Grocery List"}} />`.  

Confirm that the list name appears in the application preview.

### Install a Unit Testing Framework

Unit Testing is a fundamental aspect of modern software development.  This course would be 
lacking if it bypassed such an important aspect of software development, so let's set up a 
unit testing framework right away. 

We will use `vitest`, which is a unit test runner that works natively with *Vite*.

``` 
npm add -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

Now add the following directive to the `scripts` section of `package.json`
```json
  "scripts": {
    ...
    "test": "vitest"
  }
```

Vitest requires some configuration files to properly operate.  Add a file in the application root directory named `vitest.config.ts` with the following contents: 

```js
import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: 'vitest.setup.js'
    }
});
```

This configuration will permit vitest to render components into an offscreen DOM so that the unit tests can assert that components are rendering as desired. 

Now add the file `vitest.setup.js` with the following contents:

```js
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
```

This setup adds specialized matchers to the assertion functions that will enable the ability to search and test the rendered DOM.

### Add a Unit Test

Writing unit tests
can often feel overwhelming.  One strategy for writing unit tests is to begin writing 
very easy tests that exercise obvious and simple behaviors.  Then, as the application develops and
grows in complexity, there will undoubedtly be situations where the application is not behaving 
as intended.  Attempt to narrow the problematic behavior down to a specific function, and write a unit test
that exercises the intended behavior of that function in that specific scenario.  If that unit
test passes, then the unit test suite is more comprehensive.  If the unit test doesn't pass, then 
you have uncovered the source of the issue and can investigate a fix. 

The first unit tests for the application will assert that the `TodoListView` renders either the list name or the fallback message.


Unit tests are added in the same directory as the the file they are testing.  Add a file along side `TodoListView.jsx` named `TodoListView.test.jsx` with the following content:

```js
import React from 'react';
import {render, screen} from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TodoListView from './TodoListView';

describe("TodoListView", () => {

    it("should display 'No List Selected' if a list is not provided'", () => {
        render(<TodoListView />);
        expect(screen.getByText("No List Selected")).toBeTruthy();
    })

```

The test above reads 
> TodoListView should display 'No List Selected' if a list is not provided.

And within the test it reads, 
> expect `screen.getByText("No List Selected")` to be truthy.  

This `describe ... it ...` and `expect ... to ... ` syntax is common in behavior driven development.  


Run `npm run test` and the vitest runner will launch and should pass.  

Try changing the assertion to `toBeFalsy()` and watch the test fail.  

Add one more test that asserts the `TodoListView` correctly renders the list name.  The test will be: 

```js
describe("TodoListView", () => {

    ...
    
    it("should display the list name if a list is provided", () => {
        const list = {name: "Grocery List"};
        render(<TodoListView list={list}/>);
        expect(screen.getByText(list.name)).toBeTruthy();
    })
    
    ...

})
```

If you keep the unit tests short and simple, it will be easy to build a habit of writing unit tests as your application grows. 


## Summary 

Commit your code, and either checkout or diff your branch with the `chapter4-solution` branch.  

This chapter introduced:

* The Vite frontend toolchain and React
* A general purpose application folder structure
* A common JSX syntax that uses the `&&` operator
* A mechanism for embedding an application in a layout using `props.children`
* Basic Unit Testing 

