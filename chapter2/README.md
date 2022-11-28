# Chapter 2: Components and the Virtual DOM

Modern front-end frameworks are powerful because they manage the rendering of the application in the browser as data become.  All frameworks achieve this by adding a layer of abstraction between the application and the document object model (DOM).  This layer of abstraction is typically called the Virtual DOM.  

In this chapter we will build a very simple Virtual DOM, and use it to render components.  

To illustrate the Virtual DOM, this chapter will guide you through the creation of a to-do list application.  The application has the following user stories:

1. As a user, I want to add an item to my todo list.
    * Type up to 50 characters in a single line text input.
    * Pressing the "Enter" key adds the item to the bottom of the list
    * After adding the item, the text input clears
2. As a user, I want to indicate that an item in my list is complete.
    * Click on a check box adjacent to an incomplete item to mark it completed
    * font color for completed items turns light grey
    * checkbox toggles to checked
3. As a user I want to incdicate that an item in my list is incomplete
    * Click on a check box adjacent to a completed item to mark it incomplete
    * font color for incomplete item turns black
    * check box toggles to unchecked

## Pre-reading

## Instructions

### Setup
Checkout the `chapter-2` branch of this repository. 
```
git checkout chapter-2
```

This 
### Create the Virtual DOM Class 

```
class VirtualDom {
  constructor() {
    this.elements = [];
  }

  addElement(el) {
    this.elements.push(el);
  }
  
  mount(el_id) {
    this.mountpoint = document.getElementById(el_id);
    this.refresh();
  }

  refresh() {
    if (this.mountpoint) {
      const root = document.createElement("div");
      this.elements.forEach((el) => {
        root.appendChild(el.render());
      });  
      this.mountpoint.replaceChildren(root);    
    }
  }
}
```


## Summary

## References