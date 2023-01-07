# Chapter 3: How Hooks Work

In Chapter 2 we saw how a Virtual DOM works to render components into the DOM. 
However, the responsibility for triggering a refresh remained inside the `addItem()`
and `updateItem()` callback functions.  As applications become more complex, leaving
the responsibility for triggering refreshes to the application becomes problematic. 
Multiple components may be trying to update and refresh the DOM simultaneously, and 
this will impact the performance and user experience.  

It is much more sensible to allocate the responsibility for managing the DOM refresh to 
the Virtual DOM.  In this way the Virtual DOM can track all of the requests for refresh, 
and schedule and execute the rerendering of the DOM in the most optimal fashion.  But in
order for the Virtual DOM to do this, it must provide functions - or *hooks* - to the 
application that allow the application to communicate to the Virtual DOM that changes to 
specific values require a refresh.  

In this chapter, we will create a basic implementation of the `useState` hook. 

## Pre-reading

* [Hooks Overview](https://reactjs.org/docs/hooks-overview.html)
* [The Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
* [Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
* [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

## Instructions 

Run `git checkout chapter3` and lets get started... 

### Add a `myUseState()` function to the Virtual DOM

The current implementation works because the `addItem()` and `updateItem()` callbacks explicitly
invoke `VDOM.refresh()` after updating the `todoItems` array.  

The new goal is to build a mechanism whereby any component in the hierarchy can modify information
and trigger a refresh to the DOM.  This is where the concept of *hooks* comes in.

A hook is a *function* provided by the Virtual DOM keep track of any changes that require a re-render.
Currently we declare the variable `todoItems` in `TodoApp.js` and manually trigger `VDOM.refresh()` when  `todoItems` changes.  Now the Virtual DOM will store variables such as `todoItems` 
and provide them to components via a hook.  When the variables are modified the VDOM will intercept
the request and schedule a refresh.

To do this we will add a function to the Virtual DOM called `myUseState()`.  This function
will return a variable and a function to set that variable.  We can use the variable
in our components, and we can change the variable using the provided function.  

Add the following code to `VirtualDom.js`

```javascript
// Cache state pairs in this array
const hooks = [];

// Reset this to zero at the end of a rendering cycle
// Increment it during each invocation of myUseState
let hookIndex = 0;

/**
 * Return a two element array.  
 * First element is the current value 
 * Second element is a function that sets the value.
 * 
 * @param initial  The initial value
 */
export function myUseState(initial) { 
  
  // Return the cached pair if it exists
  let pair = hooks[hookIndex];
  if (pair) {
      hookIndex++;
      return pair;
  }

  // No cached pair found. Initialize a new one.
  pair = [initial, (v) => { pair[0] = v; VDOM.refresh(); }];

  // Cache the pair.
  hooks[hookIndex++] = pair;
  
  return pair;

}
```
First, look at what the `myUseState` function returns.  It returns something called `pair`.  
The `pair` that it is returning is a two element array.  The first element of the array
is a value, and the second element of the array is a function that modifies the first 
element and calls `VDOM.refresh()`.  

When `myUseState` is called, it checks to see if a previously cached **pair** exists.  If it does, then it 
returns this pair.  If not then it initializes a pair and adds it to the cache... which is just an array 
named `hooks`.

In this implementation, the cache is just an array that is indexed by an integer.  It 
assumes that `myUseState` will be called during rendering the same number of times and in the
same order every time.  While it is possible to write a more complex and robust version of
this cache, frameworks such as React also have [rules](https://reactjs.org/docs/hooks-rules.html) about where the `useState()`
hook can be invoked.  This is because it must be invoked in a deterministic fashion to reliably
deliver the correct values to each component.

Our `myUseState()` function takes advantage of the Javascript concept of a *closure*.  A closure is a way 
to save a function along with independent copies of the variables that are within scope when the function 
is defined.  This is a tough concept for new developers, so don't feel bad if it doesn't sink in right 
now.  Let it rattle around in the back of your head as you read this section, and over time it will 
start to make sense. 

Each time a new `pair` is created and cached, the second element is actually a 
closure that includes a unique copy of the variable `pair`.  So each pair in 
the `hooks` array is independent, and is only capable of modifying itself.   

### Reset the `hookIndex` after each rendering cycle

The state pairs are cached in an array within the module scope of the Virtual DOM.  Every time `myUseState()` is invoked it increments an index used to lookup the next hook *pair* that is cached in the array.  When the rendering cycle is complete, it is necessary to reset the index back to 0.  

Add the following function to `VirtualDom.js`

```js
/**
 * Reset indicies for all hooks cached in the VDOM
 */
function resetHookIndicies() {
    hookIndex = 0;
}
```

And invoke the `resetHookIndicies()` function at the bottom of the `refresh()` function.

### Utilize the Hook

With this new capability `TodoApp` no longer needs to call `VDOM.refresh()`.  Within `TodoApp` replace the import of `VDOM` with an import of `myUseState`.  Initialize the `[todoItems, setTodoItems]` pair with a call to `myUseState` passing an empty array as the initial value, and move the `addItem` and `updateItem` functions into the body of the `TodoAp` function.

Finally, replace the calls to `VDOM.refresh()` with calls to `setTodoItems(todoItems)`.  

The code should look as below:

```javascript
import { TodoList } from './TodoList';
import { ToDoListItemCreator } from './TodoListItemCreator';
import { myUseState } from './VirtualDom';

export function TodoApp() {
    
    const [todoItems, setTodoItems] = myUseState([]);
        
    const addItem = (text) => {
        const item = {complete: false, text}
        todoItems.push(item)
        setTodoItems(todoItems);
    }

    const updateItem = (i, item) => {
        todoItems[i] = item;
        setTodoItems(todoItems);
    }

    const div = document.createElement('div')
    div.appendChild(ToDoListItemCreator(addItem));
    div.appendChild(TodoList(todoItems, updateItem));
    return div;
}
```

Spend a moment and think through what happens when `myUseState([])` and `setTodoItems(items)`
are invoked.  Recall that `myUseState([])` will return a *pair*.  The first item of that pair 
is the value currently cached in the `VDOM`'s `hooks` array.  The second item, `setTodoItems()` 
is a function that replaces the first item in the cash and then calls `VDOM.refresh()`.  


Commit your code, run the application, and verify that everything works.  

### What about useEffect

React provides many other hooks besides `useState()`.  The other common hook is called
`useEffect`.  This hook gets its name from the idea that it performs a *side effect* after rendering is complete.  The `useEffect` hook is intended to replace code that was previously invoked in `componentDidMount`.  
Examples of side effects are:

* fetching data from a server
* moving the focus to an input element
* Updating the document title 

The `useEffect` hook takes a function and an optional dependency as an argument.  The Virtual DOM will add the effect function to a queue of functions to call, and then call them successively after the DOM is finished rendering.  

Managing the execution of effect functions without triggering an infinite loop is non-trivial.   Rather than leading the student through the construction of this hook in a step by step manner, the student is
encouraged to study the implementation in the `chapter3-solution` branch. 


## Summary 

This chapter extended the simple Virtual DOM to include *hooks*.  Hooks are functions provided by the Virtual DOM that permit components to modify information and execute functions that will then trigger a refresh of the DOM.  

There are rules to how hooks can be untilized to ensure that the DOM rendering is deterministic and does not result
in infinite loops.  

With this foundational understanding, it is now time to start Part 2 of this course, and build an application using 
all of the modern convenicnes of the React Framework. 

## References

* [https://reactjs.org/docs/faq-internals.html](https://reactjs.org/docs/faq-internals.html)
* [https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)

