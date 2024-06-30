# Gmail Clone Backend

This is the backend for a Gmail clone application built with Node.js, Express, and MongoDB. The backend provides RESTful APIs for user authentication, email management, and email folder operations.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Email Management](#email-management)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)

## Installation

1. Clone the repository:

```
git clone https://github.com/RakeshV0498/gmail-clone-backend.git
```

```
cd gmail-clone-backend
```

### Install the dependencies:

```
npm install
```

### Configuration

### Create a .env file in the root directory with the following environment variables:

### .env

```
PORT=your_port_number
MONGODB_URI=your_mongodb_connection_string
JWT_SECRETKEY=your_jwt_secret_key
Replace your_port_number, your_mongodb_connection_string, and your_jwt_secret_key with your actual configuration values.
```

## Running the Server

### Start the server using the following command:

### To start the server

```
npm run server
```

The server will start listening on the port specified in the .env file.

## API Endpoints

- ### User Authentication

  ### Register User

      POST /register

  ### Login User

  ```
  POST /login
  ```

  ### Forgot Password

  ```
  POST /forgot-password
  ```

  ### Reset Password

  ```
  POST /reset-password
  ```

```

### Email Management

- ### Validate Email Addresses
      GET /emails/validateEmail/:email
- ### Inbox

      GET /emails/inbox

- ### Sent Items

```

GET /emails/sentItems

````

- ### Drafts

  ```
  GET /emails/drafts
  ```

- ### Starred Emails

      GET /emails/starred


- ### Trash

      GET /emails/trash

- ### All Emails

      GET /emails/all

- ### Draft Email

    POST /emails/draftEmail

- ### Send Email


    POST /emails/sendEmail

- ### Add Star to Email


       PATCH /emails/addStar/:id

- ### Move Email to Trash

      PATCH /emails/trash/:id

- ###  Delete Email

  ```
  DELETE /emails/delete/:id
  ```

##  Folder Structure


````

📦gmail-clone-backend
┣ 📂db-utils
┃ ┣ 📜model.js
┃ ┗ 📜mongoConnect.js
┣ 📂mail-utils
┃ ┗ 📜mail-util.js
┣ 📂routes
┃ ┣ 📜email.js
┃ ┣ 📜forgotPassword.js
┃ ┣ 📜login.js
┃ ┣ 📜register.js
┃ ┗ 📜resetPassword.js
┣ 📜package-lock.json
┣ 📜package.json
┣ 📜README.md
┗ 📜server.js

```
## Dependencies
- ### express
- ### cors
- ### dotenv
- ### jsonwebtoken
- ### mongoose
- ### nanoid

## License

This project is licensed under the MIT License.


```
