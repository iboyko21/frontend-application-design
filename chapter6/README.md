# Building Views with Material UI 

## Pre-Reading
* [Material UI](https://mui.com/material-ui/getting-started/overview/)
* [IconButton](https://mui.com/material-ui/react-button/#icon-button)


## Instructions

### Install Material UI

For this project we will utilize Material UI.  This is a library of React components that have a polished 
look and feel.  

```
npm install @mui/material  @mui/icons-material @emotion/styled
```

Start the development server and leave it running as you update the components.

### Update the Header

The header uses the following Material componnets

* [AppBar](https://mui.com/material-ui/react-app-bar/)
* [Toolbar](https://mui.com/material-ui/api/toolbar/)
* [Typography](https://mui.com/material-ui/react-typography/)

Modify `Header.jsx` to return the following fragment. 

```js
  return (           
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My ToDo App
          </Typography>
        </Toolbar>    
    </AppBar>
  );
```

Most Material components support the `sx` property which is used to provide styling overrides.  

The `Typography` component provides a consistent text representation throughout the application.  The advantage of using 
a `Typography` component over native HTML tags is the `Typography` component supports the standard
material UI system properties. 


Remove `place-items: center;` from the `body` section of `index.css`

and add `width: 100%;` to TodoApp.css (Add to chapter6 branch )

### Update Footer

Update `Footer.jsx` to return a `Typography` with absolute positioning at the bottom of the screen.

```js
return (
  <Typography variant="caption" component="div" sx={{ position: 'absolute', bottom: 0, margin: 1 }}>
        Frontend Application Design 2023
  </Typography>
);
```

### Update TodoList 

Material UI includes a component called [Paper](https://mui.com/material-ui/react-paper/) that has a built in drop shadow 
configured with the `elevation` property.  Update the outermost element of the `TodoList` to use a `Paper` component with an 
`elevation={2}` to make the list appear to hover over the page.    

Use the `sx` property to add a large margin an set a minimum height and width. 

```js
  <Paper sx={{marginX: 25, marginY: 5, minWidth: 500, minHeight: 500}} elevation={2}>
```

### Create a styled element for the List Title

Material provides a [`styled`](https://mui.com/system/styled/) function that can be used to create a pre-styled version of an element 

Create a [styled](https://mui.com/system/styled/) component for the list name that uses a larger and fancier font with padding. 

Add the following to `TodoListView.jsx` 
```js
    const ListName = styled('div')({
        fontSize: 'x-large',
        fontFamily: 'fantasy, cursive', 
        padding: 15,
        margin: 0
    })
```

And replace the current tag used for the list name, an `<h2>`, with  `<ListName>`.


### Create an input component for adding new items

The Material [Textfield](https://mui.com/material-ui/react-text-field/) component has built in support 
for required hints, helper text, error text, and labels. 

Add a `TextField` for adding new items.  Use the `outlined`, `filled`, or `standard` variant based on your preference.

Include an `autofocus` property so that the component takes the focus when the List renders. 

```js
<TextField
    id="outlined-basic" 
    label="Add an item to the list" 
    variant="outlined" 
    sx={{width: '95%', marginTop: '8px', padding: '4px 4px 4px 4px'}} 
    autoFocus />
```

### Create a TodoListItem component

The application will use a [List](https://mui.com/material-ui/react-list/) to represent the items. 

A `List` contains `ListItem`.  Create `TodoListItem.jsx` that takes a `TodoItem` as an argument.

The `TodoListItem` returns a `ListItem` that contains a `ListItemButton`, a `ListItemIcon`, and
`ListItemText`.  Use the `TodoItem` properites `complete` to render an icon, and `text` to render
the `ListItemText`. 

Select different [icons](https://mui.com/material-ui/material-icons/) to suit your preference, or 
create your own [SvgIcon](https://mui.com/material-ui/icons/#svgicon)

```js
import React from 'react';
import {ListItem, ListItemButton, ListItemText, ListItemIcon} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const TodoListItem = ({item}) => {

    return (
    <ListItem divider>
        <ListItemButton>
            <ListItemIcon>
                {item.complete ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />}
            </ListItemIcon>
            <ListItemText primary={item.text} />        
        </ListItemButton>    
    </ListItem>);
}

export default TodoItemView;
```

### Add the list of items

Within `TodoList.jsx` , map `list.items` into an array of `<TodoListItem>` components.  

`map` returns an array, and JSX requires that each element in an array contain a unique `key` prop.  
The `key` prop is used by the React Fabric to compute when and how to render the DOM.  In this situation, 
create a key by concatenating the string 'listitem-' with the id of the item.  

```js
  {/* List of Items */ }
  <List spacing={1}>
      {list.items?.map((i) => <TodoListItem key={`listitem-${i.id}} item={i}  />)}
  </List>
```

Arrays of items in JSX require a `key` property

### Connect TodoApp to the backend.  

The 