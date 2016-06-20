# piezo

Charge up your React app with minimal configuration.

## What is it?

Piezo simplifies your workflow by wrapping react, react-router, webpack@2.1, css-modules (postcss and/or sass) into a simple cli tool.

Setting up a new project from scratch takes time. Boilerplates are hard to update as best practices change. Webpack is an incredibly powerful library, but can be overwhelming to a new user.

In development mode, piezo starts up a server with an optimized webpack workflow and hot reloading of your entire application. It can also auto-generate react-router routes based on a folder structure.

In production mode, piezo compiles and minifies all your javascript, extracts your styles, and manages best practices liked hashed ids for long term caching and code splitting for faster load times. Piezo can also pre-render an entire static website and so the initial page load is plain html and subsequent navigation is powered by react.

## How do I use it?

mkdir my-app
cd my-app
npm init
npm install --save piezo react react-dom react-router
piezo server
???
piezo build


## Project Status

Piezo is already being used for customer-facing sites and applications. However, peizo is still in an alpha stage and relies on some libraries in beta (including webpack 2.0).

## Contributing

Feedback and PRs welcome!
