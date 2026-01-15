# Mini Social App - Frontend

This is the frontend client for the Mini Social App, built with React and Vite. It provides a user-friendly interface for interacting with the Django backend, enabling a complete social media experience.

## Features

- **User Authentication**: Secure user registration, login, and logout functionality using JWT.
- **Password Management**: "Forgot Password" feature that sends a reset link to the user's email.
- **Post Management**:
    - Create new posts.
    - View a feed of posts from other users.
    - View a separate feed of only your own posts.
    - Delete posts (authors can delete their own, admins can delete any).
- **Social Interaction**:
    - Like and unlike posts.
    - View a list of users who have liked a specific post.
- **User-Friendly Interface**:
    - Responsive design.
    - Clear separation of user-owned content and the general feed.
    - Real-time feedback during API requests (e.g., loading states, error messages).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Environment Configuration

For the frontend to communicate with the backend, it needs to know the API's base URL.

1.  Create a file named `.env` in the `frontend/social_app/` directory.
2.  Add the following line to it. This points the frontend to the default location of the Django backend.

    ```dotenv
    VITE_API_BASE_URL=http://127.0.0.1:8000/api
    ```

    *Note: The `.env` file is listed in `.gitignore` and will not be committed to version control, keeping your local configuration separate.*

## Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd Mini_Social_App/frontend/social_app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Access the application:**
    Open your browser and navigate to `http://localhost:5173`.

    *Note: Ensure the backend server is running on port 8000 for API requests to work correctly.*

## Project Structure

The project follows a standard Vite + React structure.

```
/
├── public/              # Static assets
├── src/
│   ├── App.jsx          # Main component with routing
│   ├── Dashboard.jsx    # Main dashboard after login
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── RequestResetPassword.jsx # "Forgot Password" email request form
│   ├── ResetPassword.jsx  # New password form
│   ├── api.js           # Axios instance for API communication
│   ├── main.jsx         # Application entry point
│   ├── App.css          # Global styles
│   ├── Auth.css         # Styles for auth forms
│   └── Dashboard.css    # Styles for the dashboard
└── .gitignore           # Files to ignore for Git
└── package.json         # Project dependencies and scripts
└── README.md            # This file
```

