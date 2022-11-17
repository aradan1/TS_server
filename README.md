# TS_server


### To run it:

In source directory:

  `cd TS_server`

  `yarn`
  
  `yarn initdb`
  
  `yarn dev`

(in case the command "initdb" causes problems, create empty file called "db.sqlite" and run the "initdb.ts" file)

## Composition

The main components of this project are:

### src/initdb.ts

Initializes the DataBase.

### src/index.ts

Contain the Express app, all API endpoints, session Authorization and DataBase connection (everything).

### the Database

User Database with fields "id" (auto Primary key), "username" and "password".

#

## API Routes:

- **GET /**

Get all users of the database
- **GET /:id**

Get the user with matching "id" in Database
- **POST /signup**

Register a user if the "username" is available, requires "username" and "password" fields
- **POST /login**

Logs in a user if it exists in the database and returns the TOKEN, requires "username" and "password" fields
- **PUT /:id**

Edits the user's "username" with given "id", requires authentication and "username" field
- **DELETE /:id**

Deletes the user with given "id" from the database, requires authentication

#

- Passwords are encripted
- There's no restriction on the data inserted in the DataBase, be it empty fields, short or long, digit composition...
- All CONSTANTS are 'hardcoded' instead of in a ".env" file.
- The errors thrown may or may not be the required ones, given the problem faced.
- Tests not implemented.
- The structure of the API should be in a different Routes folder, making the Express App call a router that implements all the calls, and this API calls delegate the Database management (logic) to a different folder. The authentication middleware should also be in the same Router folder. The Database connection should also be in it's own different file.
