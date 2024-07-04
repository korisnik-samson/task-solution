# Files API

This project implements an API endpoint `/api/files` that fetches data from an external endpoint, transforms the data into a specified format, and serves it to the end user with minimal delay. The implementation includes caching to ensure quick response times and background updates to keep the data fresh.

## Task Description

The task is to create endpoint using Node.js (Typescript) that fetches a large dataset from an external API, transforms the data, and returns it to the user. The transformation involves restructuring the data into a nested format based on the URL paths. Given the large dataset and the delay from the external API, the solution must ensure that the user receives a response as quickly as possible.

## THE IDEA
* I've created a simple Express server that fetches data from an external API, transforms the data into a nested format based on the URL paths,
* and serves it to the end user with minimal delay... How? Caching and Background Updates.


## Solution Summarized

- **Data Transformation**: The data from the external API is transformed into a nested format based on URL paths.
- **Caching**: The transformed data is cached to provide quick responses.
- **Background Updates**: The cache is updated in the background periodically to keep the data fresh.
- **Initial Cache Load**: The cache is pre-populated when the server starts to avoid delays on the first request.
- **Security & Logging**: The endopint can be made secure from SQL Injection, DOS attacks via Express-Rate-Limits. Packages like `Winston` and `Morgan` were also considered as standard ways for logging info and error messages from the server instead of `console.log`

## Utilized Packages

- **express**: Web framework for Node.js.
- **axios**: Promise-based HTTP client for making API requests.
- **nodemon**: Utility for monitoring changes in source files and restarting the server.
- **node-cron**: Task scheduler for running periodic jobs.
- **typescript**: JavaScript superset that adds static types, and for type-saftey.

## Project Structure
- **src/**: Contains the source code.
- **controllers/**: Contains the controller logic.
- **routers/**: Contains the route definitions.
- **utils/**: Contains utility functions.
- **types/**: Contains TypeScript type definitions.
- **app.ts**: Initializes the Express app.
- **server.ts**: Starts the server.
- **cache/**: Contains the cache files.
- **.env**: Environment variables.
- **package.json**: Project metadata and scripts.
- **tsconfig.json**: TypeScript configuration.