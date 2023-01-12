# Building Views with Material UI 

This module focuses on building sophisticated interactive views with React and 
the Material UI component library.  

The strategy for building views here has three principal components. 

1. Passing data models down the component hierarchy 
2. Passing callback functions that modify data models down the component hierarchy. 
2. Storing state specifically related to the rendering of the view within the view.

The use of a component library is optional, but adds a polished user experience that would 
otherwise be very time consuming to replicate.

In addition to our previous requirements to enable adding and toggling the complete status 
of items on a todo list, there are new requirements:

* As a user I want to add a new list so that I can have different lists for different types of items. 
* As a user I want to select a list to add items to

To satisfy these requirements, the application will additionally support a new view to display the
available lists and either select a list or add a new list.  

## Pre-Reading
* [Material UI](https://mui.com/material-ui/getting-started/overview/)

## Instructions

Checkout the `chapter6` git branch now.  

### Install Material UI

For this project we will utilize Material UI.  This is a library of React components that have a polished 
look and feel.  

```sh
> cd react-todo
> npm add @mui/material  @mui/icons-material @emotion/styled
> npm install
```
### Start the Dev Server and Backend Server 

This branch includes a small server that will act as the backend. Open a second terminal and start the development server in one terminal, and the backend in the other terminal.  Leave these servers running as you follow the instructions below.

```sh
# Start The Development Server
> cd react-todo
> npm run dev
```

```sh
# Start the backend server
> cd todo-server
_ npm run start
```

### Update the Header

Replace the application header with an component that can host a menu, a brand, and an avatar.  In Material UI, this is called an `AppBar`.  Additionally, the header will make use of a `Toolbar` component and a `Typography` component.  Review the documentation for these components at the links below.

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

Most Material components support the `sx` property which is used to provide styling overrides.  In this 
case, the `flexGrow` property ensures that the `Typography` element expands to fill the entire flex box. 

The `Typography` component provides a consistent text representation throughout the application.  The advantage of using 
a `Typography` component over native HTML tags is the `Typography` component supports the standard
material UI system properties such as `sx`


### Update Footer

Update `Footer.jsx` to return a `Typography` with absolute positioning at the bottom of the screen.

```js
return (
  <Typography variant="caption" component="div" sx={{ position: 'absolute', bottom: 0, margin: 1 }}>
        Frontend Application Design 2023
  </Typography>
);
```

### Update TodoListView Visual Style

Material UI includes a component called [Paper](https://mui.com/material-ui/react-paper/) that has a built in drop shadow 
configured with the `elevation` property.  Update the outermost element of the `TodoListView` to use a `Paper` component with an 
`elevation={2}` so that list appears to hover over the page.    

Use the `sx` property to add a large margin an set a minimum height and width. 

```js
  <Paper sx={{marginX: 15, marginY: 5, minWidth: 250}} elevation={2}>
```


### Create a styled element for the List Title

Material provides a [`styled`](https://mui.com/system/styled/) function that can be used to create a pre-styled version of an element 

Create a new file named `src/views/ListTitle.jsx` that exports a  [styled](https://mui.com/system/styled/) component for the list name that uses a larger and fancier font with padding. 

Add the following to `ListTitle.jsx` 
```js
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

const ListTitle = styled(Typography)({
    fontSize: 'x-large',
    fontFamily: 'fantasy, cursive',
    padding: 15,
    margin: 0, 
    textAlign: 'center'
})

export default ListTitle;
```

Within `TodoListView` wrap both the list name and the "No List Selected" text in a  `<ListTitle>` tag.



### Modify `TodoListView` to Take a `listId` Property and Fetch the List From the Backend

At the end of Chapter 4 the `TodoApp` component passed the object `{name: "Grocery List"}` to the `TodoListView`.  In Chapter 5, we introduced the data models and the API layer so now we can fetch data from the server and pass validated data to the component views.  

When building a frontend application there is always a decision about where to manage data within the component hierarchy.  Generally wherever the data are stored, is where the functions to modify them also live.  (We will see an alternative approach in Chapter 8).  If the data are managed too high in the hierarchy, then it is cumbersome to pass both the data and the callbacks to modify the data down through multiple layers of components.  If the data are managed too low in the hierarchy, then there is share the data across related components.  

In this application, the `TodoListView` will accept the `id` of the list to display as a property, and then assume responsibility for fetching and storing the actual list.  

Modify `TodoApp` to manage a `listId` variable using the `useState` hook, and pass that variable to `TodoListView` as below:

```js
const TodoApp = () => {

    ...

    const [listId, setListId ] = useState(null);

    ...
    
    return (
        <MainLayout>
            {listId != null &&  <TodoListView listId={listId}  /> }
        </MainLayout>
    )
```

> For testing purposes, it will be useful to temporarily initialize `listId` to 0.

Modify `TodoListView` to accept a `listId` argument, and then add a `useState` hook that manages a `list` variable.   

```js
const TodoListView = ({listId}) => {

    const [list, setList] = useState(null);

    ...
```

Now introduce a `useEffect` hook that will call an asynchronous function `refreshList()` that will fetch the list with `TodoApi.getList()` and call `setList()` with the result.  

The `useEffect` takes two arguments, a function to execute, and a list of dependencies.  The function is called if any value in the list of dependencies changes.  

In this situation, the dependency is `listId`.

The following hook will update `list` whenever `listId` changes. 

```js
    const refreshList = async () => {
        setList(await TodoApi.getList(listId));
    }

    useEffect(() => {
        refreshList()
    }, [listId]);
```

The Application should now display the title for "Grocery List" which is one of the two lists already stored in the backend.  Check the http://localhost:3000/lists endpoint to confirm this, and change the default `listId` to 1 in `TodoApp` to confirm. 


### Create a TodoListItemView component

The application will use a Material UI [List](https://mui.com/material-ui/react-list/) to represent the items in the list. 

Create `TodoListItemView.jsx` that takes a `TodoItem` as an argument.

The `TodoListItemView` returns a Material UI `ListItem` that contains a `ListItemButton`, a `ListItemIcon`, and
`ListItemText`. 

You can use the icons selected in the code below, select different [icons](https://mui.com/material-ui/material-icons/) to suit your preference, or 
create your own [SvgIcon](https://mui.com/material-ui/icons/#svgicon)

```js
import React from 'react';
import {ListItem} from '@mui/material';
import {ListItemButton} from '@mui/material';
import {ListItemText}  from '@mui/material';
import {ListItemIcon} from '@mui/material';

// icons
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const TodoListItemView = ({item}) => {

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

export default TodoListItemView;
```

### Add the list of items to `TodoListView`

At the end of the `TodoListView` return statement use `map` to convert `list.items` into an array of `<TodoListItemView>` components.  Make sure to check that `list` is truthy prior to accessing its properties.

The `map` function returns an array, and JSX requires that each element in an array contain a unique `key` prop.  
The `key` prop is used by the React Fabric to compute when and how to render the DOM.  In this situation, 
create a key by concatenating the string 'listitem-' with the id of the item.  

```js
  {/* List of Items */ }
  <List spacing={1}>
      {list && list.items?.map((i) => <TodoListItemView key={`listitem-${i.id}`} item={i}  />)}
  </List>
```
### Create an input component for adding new items

The Material [TextField](https://mui.com/material-ui/react-text-field/) component is a handy extension to an html `<Input>` with built in support 
for helper text, error text, and labels. 

We can additionally wrap the `TextField` in a Material [Tooltip](https://mui.com/material-ui/react-tooltip/) for extra polish.

Add a `Tooltip` with a `TextField` in `TodoListView` below the list name.  Use the `outlined`, `filled`, or `standard` variant based on your preference.

Include an `autoFocus` property so that the component takes the focus when the List renders. 

```js
<Tooltip title="Type and press `Enter` to add a new item" arrow>
  <TextField
      id="outlined-basic" 
      label="Add an item to the list" 
      variant="outlined" 
      onKeyUp={addItemOnEnter}
      sx={{width: '95%', marginTop: '8px', padding: '4px 4px 4px 4px'}} 
      autoFocus />
</Tooltip>
```

Whenever the `TextField` generates a `keyup` event it will call a function that tests whether the key code is `'Enter'`, and if so it calls `TodoApi.addItem()` with the `TextField`'s value and then refreshes the list.

```js
const addItemOnEnter = async (ev) => {
    if (ev.code == 'Enter') {
        await TodoApi.addItem(listId, ev.target.value);
        refreshList();
    }
}
```
For extra polish, set the `<TextField>` value to an empty string after adding the item.

At this point, `TodoListView` appears as follows:

```js


const TodoListView = ({listId, cancel}) => {

    // The list that is being rendered.
    const [list, setList] = useState(null);

    // Fetches the list from the backend
    const refreshList = async () => {
        setList(await TodoApi.getList(listId))
    }

    // Refresh the list on listId change 
    useEffect(() => {
        refreshList();
    }, [listId])

    // Submit the new item to the backend and refresh
    const addItemOnEnter = async (ev) => {
        if (ev.code == 'Enter') {
            await TodoApi.addItem(listId, ev.target.value);
            refreshList();
            ev.target.value = "";
        }
    }

    return (
        ...
     )

}
```

### Pass a `toggleItemComplete` Function Down to `<TodoListItem>`

Create a new function in `TodoListView` called `toggleItemComplete` that toggles the completion status of the item, and then invokes `TodoApi.updateItem`.  After the `updateItem` promise resolves, make sure to call `refreshList()`.

```js
const toggleItemComplete = async (item) => {
    item.toggleComplete();
    await TodoApi.updateItem(listId, item);
    refreshList();
}
```
Pass this function down to each `TodoListItemView`, but wrap it in a closure that includes the current item. 

```js
{list?.items.map((i) => <TodoItemView key={`listitem-${i.id}`} item={i} toggleItemComplete={() => toggleItemComplete(i)} />)}

```

Finally, inside `TodoListItemView` add the function as a click handler on the `ListItemButton`.

```js
const TodoItemView = ({item, toggleItemComplete}) => {

    return (
    <ListItem key={item.text} divider>
        <ListItemButton onClick={toggleItemComplete}>
            <ListItemIcon>

    ...
}
```

At this point the application has the ability to view, add, and modify items on a single list, but not the ability to select a list, or add new lists.  


### Add a view to select a list

Create a new file `src/views/TodoListSelectionView.jsx` that defines a `TodoListSelectionView` component.  This component will 
accept a function named `selectList` as a property that accepts a `TodoList`. When called, it notifies the parent component, `<TodoApp>`, that a list was selected so that the list can be displayed.

```js
const TodoListSelectionView = ({selectList}) => {
    return ();
}
```

### Fetch the `lists` with `useEffect`

Inside the `ListSelectionView` we will use an effect hook to fetch all the lists and store them in a state variable named `lists`.

Add a state variable that contains the TodoLists to display with the `useState` hook.  Default it to an empty array. 

```js
const [lists, setLists] = useState([]);
```

When `TodoListSelectionView` loads, it must fetch the lists from the backend so that the user can choose a list.  

Create a new function `refreshLists()` that calls `TodoApi.allLists()` and passes the return value to `setLists()`.  Then add a `useEffect` hook that calls the`refreshLists` function  Pass an empty array as the dependency. This is a pattern used in React to ensure the effect is called one time after the component is first rendered   

```js
const refreshLists = async () => {
    setLists(TodoApi.allLists())
}

useEffect(() => {refreshlists()}, []);
```

### Render Each List as a Button in a Grid 

At this point, we have fetched the lists from the backend, so now we need a way to display them.  For this we will use a [Grid](https://mui.com/material-ui/react-grid2/) to render a 
button for each list using the `ListTitle`.  Import `Grid` from `@mui/material/Unstable_Grid2` and display a button for each list if `lists` is defined or a message if `lists` is undefined.

```js
return (
    <Grid spacing={3} sx={{margin: 7}} container>
    {lists && lists.map(l => 
        <Grid key={l.id} xs={12} sm={6} md={4}>
            <Button variant="contained" sx={{width: "100%"}} onClick={() => selectList(l)}>
                <ListTitle>{l.name}</ListTitle>
            </Button>
        </Grid>    
    )}

    {!lists && 
        <Grid xs={12}>
            <Typography variant="h2">No Lists Found</Typography>
        </Grid>
    }
    </Grid>
);
```

The outer most `<Grid>` element, which includes a `container` property, defines the existence of the grid.  Within that grid 
container are grid cells.  the `lists` array is mapped into a button for each grid cell, and the contents of the button is the `ListTitle`.  A button click invokes a closure that calls  `selectList()` with the current list.

Grid rows are divided into 12 units, and 
each cell can occupy from 1 to 12 units.  Furthermore, it is possible 
to specify a different number of units for different screen sizes.  In the example above, for an extra small (`xs`) screen the grid cell will occupy the entire row - all 12 units.  A small (`sm`) screen will contain two grid cells of 6 units each, and a medium (`md`) screen or larger will contain three grid cells of 4 units each. 

### Add Logic to `TodoApp` to render either `TodoListSelectionView or `TodoListView`

`TodoApp` must now either render the `TodoListSelectionView`, if no list is selected, or the `TodoListView`, if a list is selected. 

Modify the returned JSX of `TodoApp` to render the correct component based on whether or not `listId` is `null`.  If `listId` equals `null`, then render the `TodoListSelectionView`, otherwise render the `TodoListView`.   

Wrap `setListId` in a function and pass it to `TodoListSelectionView` as the `selectList` property so that a button click will render the TodoList.

```js
{listId == null && <TodoListSelectionView  selectList={(list) => setListId(list.id))} /> }
{listId != null &&  <TodoListView listId={listId}  /> }
```
At this point the application will display a list when it is selected.  However, there is no mechanism to return to the `ListSelectionView` once a list is selected.

### Add a "Back" button to `TodoListView`

One technique we can use to create this interaction is to create a "Back" button in `TodoListView`.  The back button informs the calling component that the user is done editing and it should return to it's previous state. 

Add a new value named `back` to the `TodoListView` props object.  

Assume the designer has specified that the 'back' button be placed to the left of the list name, which remains centered.  Use a `Grid` to keep the list name centered at the top of the list.  The back button occupies the first 2 grid units, the list name occupies 8 grid units, and add an empty grid cell occupies the last 2 grid units.  Use the `xs` break point for the grid so that the grid units apply regardless of screen size.

Use an `<ArrowBackIosIcon />` wrapped in an `IconButton`, and place it within the grid cell to the left of the list name.  Call the `back` function when the button is clicked.

```js
...
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Unstable_Grid2';

const TodoListView = ({listId, back}) => {

    ...

    return (
        <Paper sx={{marginX: 25, marginY: 5, minWidth: 500, minHeight: 500}} elevation={2}>

            <Grid container>
                <Grid xs={2}>
                    <IconButton sx={{padding: 2}} onClick={back}>
                        <ArrowBackIosIcon />
                    </IconButton>
                </Grid>
                <Grid xs={8} >
                    <ListTitle>
                        {!list && "No List Selected"}
                        {list && list.name}
                    </ListTitle>
                </Grid>
                <Grid xs={2}>
                    {/* Empty - But exists to center list title*/}
                </Grid>
            </Grid>

            ...
    )
}
```

Within `TodoApp` pass a function to `TodoListView` for the `back` property that calls `setListId(null)`.  When `listId` is `null` the application will render the `TodoListSelectionView`.  

### Adding New Lists

The final task for the chapter is to create a capability for adding a new list.  

The application will present an 'Add List' button that turns into a TextField when clicked.  The user will enter the name of the new list, and then type 'Enter' to create the list.  If the user types 'Escape' the entry will cancel and the TextField will convert back to a button. 

Add a new state variable to `TodoListSelectionView` called `addingList`.  This state variable will determine whether the button or the TextField is rendered.  

Add a new Grid Cell at the bottom of the `TodoListSelectionView` Grid.  Within this grid cell render a TextField if `addingList` is *truthy* or a Button if `addingList` is *falsy*.  

When the 'Add List' Button is clicked, set `addingList` to `true`. 

Create a `handleKeyUp` function that checks the event `code` and either calls `setAddingList(false)` if the user typed `'Escape'` or `TodoApi.addList(ev.target.value)` if the user typed `'Enter'`.  Do not forget to call `setAddingList(false)` and `refreshLists()` after adding the list.  

The code below sets the grid cell to consume 12 grid units so that the button and text field always appear below the grid items.  It also uses a [Floating Action Button](https://mui.com/material-ui/react-floating-action-button/) with an `<AddIcon />` and a `<Tooltip>` for a nicer UX.  


```js
const TodoListSelectionView = ({listSelected}) => {

    ...

    const handleKeyup = async (ev) => {
        if (ev.code == 'Enter') {
            await TodoApi.addList(ev.target.value);
            ev.target.value = ""; // Clear Text Field
            setAddingList(false);
            refresh();
        }

        if (ev.code == "Escape") {
            setAddingList(false);
        }
    }

    ...

    return(
        ...
        {/* Last Grid Row is reserved for adding a new list */}
        <Grid xs={12} marginY="auto">
            {/* If Adding List show Text Field */}
            {addingList && 
                <Tooltip title="'Enter' to create list. 'Esc' to cancel." arrow>
                    <TextField sx={{width: '100%'}} label="New List Name" autoFocus onKeyUp={handleKeyup}/>
                </Tooltip>
            }
            
            {/* If not adding list show button to add list */}
            {!addingList && 
                <Fab variant="extended" onClick={() => setAddingList(true)} >
                    <AddIcon />Add List
                </Fab>
            }
        </Grid>
        ...
    )
```

Commit your code to the branch. 

## Summary 

This focus of this chapter was building a fully interactive web application using react hooks and Material UI.  Important architectural elements were introduced. 

* Interfacing with the backend at the same level in the hierarchy where data models are stored ins tate
* Passing callback functions down the hierarchy 
* View state

This chapter did not provide any instruction on updating unit tests.  Unit tests should not be overlooked when developing production code.  The `chapter6-solution` branch has updated unit tests for each view.  Study the unit tests and ensure you understand them.  