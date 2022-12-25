# Create The Data Model


This project will utilize a Model-View design pattern.  The *Models* are containers for data 
and have no dependencies on the DOM or any visual representation.  Separating the code 
that is concerned with visual representation from the code that is concerned with data 
management makes the application simpler to read and more adaptable to change.

We will use Typscript for the data models because it is critically important to make 
sure each element of data is precisely what we expect it to be.  Unexpected `undefined` 
values or `nulls`, or using a `string` instead of `Date` can have a disastrous impact
on the application.

Create two files `src/models/TodoList.ts` and `src/models/TodoItem.ts`

## Pre-Reading
* [IconButton](https://mui.com/material-ui/react-button/#icon-button)

## Instructions 

### Install typescript

```
npm install -D typescript ts-loader
```

Add `.ts` to list of extensions webpack will resolve

```
    resolve: {
      extensions: ['*', '.js', '.jsx', 'ts'],
    },
```

Add rule to webpack.config.js to use ts-loader

```
    module: {
      rules: [
        ...
        {
          test: /\.(ts)$/,
          exclue: /node_modules/,
          use: ['ts-loader']
        },
        ...
```

### Create the Directory Structure


### Create the Layout

For this project we will utilize Material-UI.

```
npm install @mui/material  @mui/icons-material
```

## Summary

## References