# Project Title: Node Server App

## Description

This Node.js application manages user and business data through a REST API. Key features include user registration, login, content publication, and editing. It uses Express.js and MongoDB, with advanced features like error logging and temporary account lockout.

## Technologies

- Node.js
- Express
- MongoDB

## Packages

- **bcrypt**: Password hashing
- **chalk**: Terminal string styling
- **cors**: Cross-Origin Resource Sharing
- **cross-env**: Environment variables
- **dotenv**: Loads environment variables
- **express**: Web framework
- **joi**: Schema validation
- **jsonwebtoken**: JWT handling
- **lodash**: Utility functions
- **mongoose**: MongoDB ORM
- **morgan**: HTTP request logger
- **passport**: Authentication
- **uuid**: Unique identifiers

## Installation

Install dependencies:

```shell
npm install
```

Set up environment files:

- `.env.development`
- `.env.production`

## Running the Project

Start in production mode:

```shell
npm start
```

Start in development mode with hot reloading:

```shell
npm run dev
```

Seed the database:

```shell
npm run seed-db
```

## API Routes

### User Routes

- **Register**: `POST /api/users`
- **Login**: `POST /api/login`
- **Get Me**: `GET /api/users/me`
- **Get All Users**: `GET /api/users` (admin only)
- **Get User by ID**: `GET /api/users/:id`
- **Edit User by ID**: `PUT /api/users/edit/:id`
- **Change User Status**: `PATCH /api/users/:id`
- **Change to Admin**: `PATCH /api/users/admin/:id` (admin only)
- **Delete User**: `DELETE /api/users/:id`

### Card Routes

- **Create Card**: `POST /api/cards` (business users only)
- **Get All Cards**: `GET /api/cards`
- **Get Card by ID**: `GET /api/cards/:id`
- **Delete Card**: `DELETE /api/cards/:id`
- **Get My Cards**: `GET /api/cards/my-cards`
- **Like Card**: `PATCH /api/cards/:id`
- **Edit Card**: `PUT /api/cards/edit/:id`
- **Change BizNumber**: `PATCH /api/cards/editBiz/:id` (admin only)

[API Documentation](https://documenter.getpostman.com/view/27577545/2s9YsQ6UPy)

## Security Features

### Temporary Account Lock

After three failed login attempts, an account is locked for 24 hours to prevent unauthorized access.

## Application Logging

### Error Logging

Logs errors (status code 400+) in daily log files in the `logs` directory, capturing date, time, status code, and error message.
