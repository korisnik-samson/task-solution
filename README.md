# Files API

This project implements an API endpoint `/api/files` that fetches data from an external endpoint, transforms the data into a specified format, and serves it to the end user with minimal delay. The implementation includes caching to ensure quick response times and background updates to keep the data fresh.

## Task Description

The task is to create an Express.js endpoint that fetches a large dataset from an external API, transforms the data, and returns it to the user. The transformation involves restructuring the data into a nested format based on the URL paths. Given the large dataset and the delay from the external API, the solution must ensure that the user receives a response as quickly as possible.

## Solution Overview

- **Data Transformation**: The data from the external API is transformed into a nested format based on URL paths.
- **Caching**: The transformed data is cached to provide quick responses.
- **Background Updates**: The cache is updated in the background periodically to keep the data fresh.
- **Initial Cache Load**: The cache is pre-populated when the server starts to avoid delays on the first request.
