# Create The Data Model

The Data are at the heart of your application.  

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