# SkyGeni Analytics Dashboard

This project is a full-stack analytics dashboard application with a React frontend and a Node.js/Express backend.

## Project Structure

- `frontend/`: Contains the React application.
- `backend/`: Contains the Node.js Express API.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

## Setup and Running the Application

### 1. Backend Setup

First, set up and run the backend server:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# The backend uses environment variables to configure the port.
# Create a .env file from the example:
cp .env.example .env

# Start the backend server
npm start
```

The backend server will start on the port specified in your `.env` file (default is 3001).

### 2. Frontend Setup

Next, set up and run the frontend React application:

```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend development server will start, typically on `http://localhost:5173`. You can now open this URL in your browser to see the application.

## Available Scripts

### Backend (`/backend`)

- `npm start`: Starts the production server.
- `npm run dev`: Starts the server in development mode with auto-reloading using `ts-node-dev`.
- `npm run build`: Compiles the TypeScript code to JavaScript.

### Frontend (`/frontend`)

- `npm run dev`: Starts the development server with Vite.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code.
- `npm run preview`: Previews the production build locally.

## Technologies Used

### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **Runtime**: Node.js

### Frontend

- **Framework**: React
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Data Fetching**: Axios
- **Charting**: D3.js
- **Build Tool**: Vite
