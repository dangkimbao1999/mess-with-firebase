# # Budget App

A RESTFUL API for budget app - an app to record expenses of a user
![Budget app description](https://storage.googleapis.com/congtroi-assets/images/avatar/f9e06f24-ddf2-4383-b68e-ded5451afce6-1676900157884.jpg
 "a title")


# Installation

[Node v16](https://nodejs.org/en/download/) and [Firebase](https://firebase.google.com/docs/web/setup) is required to run this tool

Install all of the dependency

```
npm install -g .
```

# Start up

To start the project, use the following cmd:

```
cd functions
npm run serve
```



# Usage

The server is run on `http://127.0.0.1:5001/deeptech-test-ee3e1/us-central1/default/`, to call an api, use `http://127.0.0.1:5001/deeptech-test-ee3e1/us-central1/default/{API}`

- ```
  POST: /register
  ```

  - Body:
    - email: Your email to register (required)
    - phone: Your phone number (required)
    - name: Your name to display (required)
    - password: Your password to login (required)

- ```
  POST: /login
  ```

  - Body:
    - email: Registered email (required)
    - password: Password of your account (required)

- ```
  POST: /add-transaction
  ```

  - access token is required to call
  - Body:
    - type: Type of the transaction (INCOME/EXPENSE/TRANSFER)
    - title: Title of the transaction (required)
    - amount: Amount of the transaction (required)
    - to: Email of the account that you want to transfer to (Only applicable for TRANSFER type) (optional)

- ```
  GET: /history
  ```

  - access token is required to call
  - Query:
    - title: Title of the transaction (optional)
    - type: Type of the transaction (optional)
    - limit: Item per page (optional)
    - page: Page (start from 0) (optional)

- ```
  PUT: /edit-transaction
  ```

  - access token is required to call
  - Body: 
    - txid: Id of the transaction (required)
    - title: title of the transaction (required)

# Code structure

In order to fully maintainable and extendable, I decided to go with the following structure

```
│   .eslintrc.js
│   .gitignore
│   firebase-debug.log
│   index.js
│   package-lock.json
│   package.json
│   README.md
│   ui-debug.log
│
├───config
│       firebase.js
│
├───enum
│       actionEnum.js
│
├───services
│       firestore.js
│       service.js
│
├───utils
│       balanceCheck.js
│
└───validators
        authenticated.js
        validator.js
```

Where:

- `index.js`: store all of the APIs file for any new specific api
- `enums`: store all enum definition
- `utils`: contains helper files
  - `balanceCheck.js`: Check balance when perform a transaction
- `config`: store all of the configuration of the application
  - `firebase.js`: firebase configuration  
- `services`: contains service file
  - `firestore.js`: contains functions to perform operation on firestore
  - `service.js`: contains logic handling
- `validator`: contains middleware file to validate input to the request
  - `authenticated.js`: Authenticate an client that is calling API
  - `validator.js`:  Validate query/body input