# Jobly



Check out the deployed app <a href="">here</a>.

## Screenshots

TODO: TBU with application screenshots

**Database**

<img src="/static/images/database-er-diagram.jpg" width="1000" height="250">

- Key relationships:


## Current features
- RESTful routing
- Logged in users can apply for a job

## Upcoming features
- When admins add a user the system makes a random password for the user
- Use enum types in PostgreSQL to change the state column in the applications table to consist of 'interested', 'applied', 'accepted', 'rejected'
- Add technologies for jobs
- Add technologies for users

## Tech stack
- PostgreSQL for database
- Express / JavaScript for backend
- Create-React-App/React for frontend

## Dependencies
**Backend dependencies** include:
- bcrypt
- body-parser
- colors
- cors
- dotenv
- express
- jest
- jsonschema
- jsonwebtoken
- morgan
- pg
- supertest

Note: See package.json file for full list and associated package versions.

**Frontend dependencies** include:
- axios for requests
- bootstrap for styling
- jest *(ships with CRA)*
- jsonwebtoken for security
- react-router-dom for routing

Note: For frontend related documentation and commentary, please go <a href="">here</a> 

## Installation
**Backend Development Setup**

A starter database is provided which can be used to create a jobly database:
```console
createdb jobly < jobly.sql
```

We used Node.js for our back-end JavaScript runtime environment. To install the backend dependencies from the package.json file:
```console
npm install
```

Then start up the server (which we have set to start on port 3001):
```console
npm start
```

## Testing

Note: any time you run our tests here, you will need to use the -i flag for Jest so that the tests run "in band" (in order, not at the same time).

**Coverage Report**:

<img src="/static/images/test-coverage-report.png" width="1000" height="250">


## Deployment


## Authors
- Winnie Chou
- Sean Kim (pair programming partner)