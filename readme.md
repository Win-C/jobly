# Jobly

Jobly is a mock job board site where users can sign up and login. Logged in users gain access to a list of companies with search and filtering capabilities. Each company has a list of job postings that a user can view. A user may apply to a job posting, but each user is restricted from duplicate applications to a single job posting posted by a company.

Check out the deployed backend <a href="https://winnie-jobly.herokuapp.com/">here</a>.

Note: the following documentation focuses on the backend. For frontend related documentation and commentary, please go <a href="https://github.com/Win-C/react-jobly">here</a>.

## Screenshots

**Database Entity Relationships**

<img src="/static/images/database-er-diagram.png" width="750" height="250">

- Note: The applications tables is a join table and has two foreign keys as a primary key. 
- Key relationships:
    - Each user may have many applications (one-to-many) but each job only has one application for each user (one-to-one)
    - Each company may have many jobs (one-to-many)

## Current features
- RESTful routing
- Users can view list of companies with the option of filtering by company name and # of employees
- Logged in admin users can create, update, and delete companies
- Logged in admin users can also create users but registration is open to everyone
- Logged in admin users can also get the list of all users
- Getting information on a user, updating, or deleting a user is only permitted by either an admin, or by that user
- Logged in users can view jobs with similar backend RESTful routing as companies

## Upcoming features
- Add optional filtering of job postings by title, salary and equity
- Add ability for users to submit job applications
- When admins add a user the system makes a random password for the user
- Use enum types in PostgreSQL to change the state column in the applications table to consist of 'interested', 'applied', 'accepted', 'rejected'
- Add technologies for jobs
- Add technologies for users

## Tech stack
- PostgreSQL for database
- Express.js/Node.js for backend
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

To run tests:
```console
jest -i
```

Note: any time you run our tests here, you will need to use the -i flag for Jest so that the tests run "in band" (in order, not at the same time).

**Coverage Report**:

<img src="/static/images/test-coverage-report.png" width="600" height="250">


## Deployment

Before deploying ensure that your package.json is up to date.

We used Heroku to deploy our app so we created a Procfile in the root directory of our application. Make sure the filename does not have any extension and begins with capital P:
```console
echo "web: node server.js" > Procfile
```

Login to your heroku account and create an application, making sure you have a correct remote. Push your code to the new remote and make sure you have a worker:
```console
heroku login
heroku create NAME_OF_APP
git remote -v
git push heroku main
heroku open
```

Make sure to set your environment variable values

Add a Postgres production database:
```console
heroku addons:create heroku-postgresql:hobby-dev
heroku config
```

Note: In your config.js file, make sure that you are connecting to the correct database when in production and make sure you connect to the correct port. 

Connect to psql and you can run the sql files on Heroku:
```console
heroku pg:psql
heroku pg:psql < jobly-schema.sql
heroku pg:psql < jobly-seed.sql
```

Note: if things break you can always check the server logs to see what's breaking:
```console
heroku logs --t
```

## Authors
- Winnie Chou
- Sean Kim (pair programming partner)