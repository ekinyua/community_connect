# Community Connect Backend

This is the backend server for the Community Connect platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Profile management API
- Search and discovery endpoints
- Booking system API
- Real-time chat server
- Ratings and reviews API

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4 or later)

## Getting Started

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. Start the server:
   ```
   npm run start
   ```

The server will start running on `http://localhost:3000` (or the port specified in your `.env` file).

## Available Scripts

- `npm run start`: Starts the server
- `npm run dev`: Starts the server with nodemon for development
- `npm run test`: Runs the test suite
- `npm run lint`: Lints the codebase

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   └── app.js
├── tests/
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
└── package.json
```

## API Documentation

API documentation is available at `/api-docs` when the server is running. This documentation is generated using Swagger.

## Database

We use MongoDB as our database. Make sure you have MongoDB installed and running locally, or provide a connection string to a remote MongoDB instance in your `.env` file.

## Testing

We use Jest for unit and integration tests. Run the tests with:

```
npm run test
```