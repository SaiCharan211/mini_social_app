# Mini Social App - Backend

This is the backend API for the Mini Social App, built using Django and Django REST Framework. It handles user authentication, data persistence with PostgreSQL, and serves API endpoints for the frontend application.

## Features

- **User Authentication**: Secure registration and login using JSON Web Tokens (JWT).
- **Forgot Password**: Functionality for users to reset their password via email if forgotten.
- **Post Management**: Users can create, read, update, and delete posts.
- **Media Support**: Support for uploading images associated with posts or profiles.
- **Social Interactions**: Functionality for liking posts and commenting.
- **User Profiles**: Management of user details and avatars.

## Tech Stack

- **Framework:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **CORS:** Django CORS Headers

## Prerequisites

Before you begin, ensure you have the following installed:
- [Python](https://www.python.org/downloads/) (3.8 or higher)
- [PostgreSQL](https://www.postgresql.org/download/)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Mini_Social_App/backend
   ```

2. **Create a Virtual Environment**

   It is recommended to use a virtual environment to manage dependencies.

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**

   The application relies on environment variables for security and configuration.

   Create a `.env` file in the root of the `backend` directory. You can copy the structure below:

   ```dotenv
   # Django Settings
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   # Database
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=social_app
   DB_USER=postgres
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432

   # JWT Settings
   ACCESS_TOKEN_LIFETIME=60

   # Email Configuration (Required for Forgot Password)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password

   # CORS Settings
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   CORS_ALLOW_ALL_ORIGINS=False
   ```

   ### Environment Variables Explained

   - **SECRET_KEY**: A long random string used for cryptographic signing.
   - **DEBUG**: Set to `True` for development, `False` for production.
   - **DB_***: Settings for your PostgreSQL database connection.
   - **EMAIL_HOST_USER**: Your Gmail address.
   - **EMAIL_HOST_PASSWORD**: This is **NOT** your regular Gmail password. You must generate an **App Password**:
     1. Go to your Google Account.
     2. Navigate to **Security** > **2-Step Verification**.
     3. Scroll to the bottom and select **App passwords**.
     4. Create a new app password (name it "Social App") and paste the 16-character code here.

5. **Database Setup**

   Ensure your PostgreSQL server is running and create a database named `social_app` (or whatever you specified in `DB_NAME`).

   Then, apply the migrations:

   ```bash
   python manage.py migrate
   ```

6. **Create a Superuser (Optional)**

   To access the Django Admin interface:

   ```bash
   python manage.py createsuperuser
   ```

7. **Run the Development Server**

   ```bash
   python manage.py runserver
   ```

   The API will be running at `http://127.0.0.1:8000/`.

## Usage

Once the server is running, you can interact with the API using the Django REST Framework's browsable interface or an API client like Postman.

### Admin Interface

Access the Django Admin panel at `http://127.0.0.1:8000/admin/` to manage database records directly. You will need to log in with the superuser account created during setup.

### Authentication

This API uses JWT (JSON Web Tokens) for secure access.
1. **Get Token**: Send a POST request to the token endpoint (e.g., `/api/token/`) with your credentials.
2. **Authorize**: Include the returned access token in the headers of subsequent requests:
   `Authorization: Bearer <your_access_token>`

### API Endpoints

Navigate to `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/api/` (depending on your URL configuration) to view the list of available endpoints. Typical endpoints include:
- `/posts/`: List and create posts.
- `/users/`: View user profiles.
- `/request-reset-email/`: Request a password reset link.
- `/password-reset-complete/`: Set a new password.