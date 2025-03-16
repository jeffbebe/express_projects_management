## Description

This application is designed to manage projects, leveraging the power of MongoDB, Express.js, class-validator and class-transformer.

## Prerequisities

Latest Node.js, Docker, npm installed globally

## Project setup

```bash
$ npm install
$ docker-compose up -d
```

Create .env file and set NODE_ENV=test
For development purposes, all other environment variables will be auto filled from the test configuration

## Compile and run the project

```bash

# watch mode with VSC debugger
$ npm run start:dev

```

## Usage

Each server run checks for data sufficiency. If there's at least one collection without any data, it will prefill it with synthetic values

# Projects

- Endpoint: `GET /projects`
- Query params:

  1. `search` - will limit projects to only those containing search string value (case insensitive)
  2. `allStatusesAs` - ("ON_HOLD", "COMPLETED", "IN_PROGRESS"). Will display only projects with all tasks with given status
  3. `groupStatus` - boolean flag, will perform grouping tasks by status in project and count them
  4. `dateFrom` - filtering projects based on createdAt
  5. `dateTo` - filtering projects based on createdAt

# Users

- Endpoint: `patch /users/:userId`
- Body:
  {
  name?: string,
  surname?: string
  }
- Patches existing user by id and updated updatedAt to current date

# Tasks

- Endpoint: `post /tasks`
- Body:
  {
  "users":
  {
  "id": string
  }[],
  "status": ("ON_HOLD", "COMPLETED", "IN_PROGRESS")
  "name": string
  }
- Creates new task. Will try to assign users if exist in the database by ID

## License

[MIT licensed]
