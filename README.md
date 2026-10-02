# TaskMaster API

**TaskMaster API** is a robust, modular, and secure RESTful backend service built with Node.js, Express, and MongoDB. Designed as a project management platform, it enables users to register, create projects, and manage hierarchical tasks with role- and ownership-based authorization.


## Tech Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** JSON Web Tokens (JWT)
* **Security:** bcrypt (Password Hashing)
* **Environment Configuration:** dotenv


## Key Features & Security Architecture

* **Decoupled MVC Architecture:** Clean separation of concerns across models, controllers, routes, and middleware.
* **JWT-Based Authentication:** Secure user registration and login issuing signed Bearer tokens.
* **Resource-Level Authorization:** Ownership-based validation ensuring users can only view, update, or delete their own projects and tasks.
* **Hierarchical/Nested REST Routes:** RESTful endpoints for parent-child resources (`/api/projects/:projectId/tasks`).
* **Data Validation & Sanitization:** Schema-level validations and pre-save hooks for hashing passwords.


## Project Structure

```text
task-master-app/
├── config/
│   └── db.js                  # MongoDB database connection configuration
├── controllers/
│   ├── userController.js      # User registration & login logic
│   ├── projectControllers.js  # CRUD operations for Projects
│   └── taskController.js      # CRUD operations for Tasks
├── models/
│   ├── User.js                # User Mongoose schema & pre-save hook
│   ├── Project.js             # Project schema (references User)
│   └── Task.js                # Task schema (references Project)
├── routes/
│   └── api/
│       ├── index.js           # API route bundler
│       ├── userRoutes.js      # Routes for /api/users
│       ├── projectRoutes.js   # Routes for /api/projects
│       └── taskRoutes.js      # Routes for /api/tasks
|   └──index.js.               # API route bundler
├── utils/
│   └── auth.js                # JWT verification & sign helper functions
├── .env                       # Environment variables (ignored by git)
├── .gitignore                 # Git ignore rule file
├── package.json               # Project dependencies & scripts
├── README.md                  # Project documentation
└── server.js                  # Application entry point
```


## Installation & Local Setup

### Prerequisites

* [Node.js](https://nodejs.org/) 
* [MongoDB](https://www.mongodb.com/) (Local instance running or MongoDB Atlas cluster URI)
* [Git]

### Step-by-Step Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/natalymelnichuk/task-master-backend
   cd task-master-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following parameters:
   ```env
    PORT=3000
    MONGODB_URI=MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>?appName=Cluster0

    JWT_SECRET=type_your_secret
   ```

   **Note:** Replace username, password and database_name with your actual MongoDB Atlas connection details.

4. **Start the Server:**
   * Development Mode (with nodemon):
     ```bash
     npm run dev
     ```
   * Production Mode:
     ```bash
     npm start
     ```


## REST API Documentation

All protected endpoints require an `Authorization` header containing a valid Bearer token:
```text
Authorization: Bearer <YOUR_JWT_TOKEN>
```


### Authentication Routes (`/api/users`)

#### 1. Register a New User
* **Method:** `POST`
* **Endpoint:** `/api/users/register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "650c00011122334455667788",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

#### 2. User Login
* **Method:** `POST`
* **Endpoint:** `/api/users/login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "650c00011122334455667788",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```


### Projects Routes (`/api/projects`)

#### 1. Get All Projects
* **Method:** `GET`
* **Endpoint:** `/api/projects`
* **Access:** Protected
* **Response (`200 OK`):**
  ```json
  [
    {
      "_id": "6ac03c6668bc987d52cef48b",
      "title": "TaskMaster App",
      "description": "Building a full-stack REST API",
      "user": "650c00011122334455667788",
      "createdAt": "2026-10-02T23:20:00.000Z",
      "updatedAt": "2026-10-02T23:20:00.000Z"
    }
  ]
  ```

#### 2. Create a Project
* **Method:** `POST`
* **Endpoint:** `/api/projects`
* **Access:** Protected
* **Request Body:**
  ```json
  {
    "title": "TaskMaster App",
    "description": "Building a full-stack REST API"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "_id": "6ac03c6668bc987d52cef48b",
    "title": "TaskMaster App",
    "description": "Building a full-stack REST API",
    "user": "650c00011122334455667788",
    "createdAt": "2026-10-02T23:20:00.000Z",
    "updatedAt": "2026-10-02T23:20:00.000Z"
  }
  ```

#### 3. Get Project by ID
* **Method:** `GET`
* **Endpoint:** `/api/projects/:id`
* **Access:** Protected (Owner Only)
* **Response (`200 OK`):**
  ```json
  {
    "_id": "6ac03c6668bc987d52cef48b",
    "title": "TaskMaster App",
    "description": "Building a full-stack REST API",
    "user": "650c00011122334455667788"
  }
  ```

#### 4. Update Project
* **Method:** `PUT`
* **Endpoint:** `/api/projects/:id`
* **Access:** Protected (Owner Only)
* **Request Body:**
  ```json
  {
    "title": "TaskMaster API v2"
  }
  ```
* **Response (`200 OK`):** Updated project object.

#### 5. Delete Project
* **Method:** `DELETE`
* **Endpoint:** `/api/projects/:id`
* **Access:** Protected (Owner Only)
* **Response (`200 OK`):**
  ```json
  {
    "message": "Project deleted successfully"
  }
  ```


### Tasks Routes

#### 1. Create a Task (Nested Route)
* **Method:** `POST`
* **Endpoint:** `/api/projects/:projectId/tasks`
* **Access:** Protected (Owner of Project)
* **Request Body:**
  ```json
  {
    "title": "Design Database Schema",
    "description": "Create Mongoose models for User, Project, and Task",
    "status": "To Do"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "_id": "6ac03cb468bc987d52cef48c",
    "title": "Design Database Schema",
    "description": "Create Mongoose models for User, Project, and Task",
    "status": "To Do",
    "project": "6ac03c6668bc987d52cef48b",
    "createdAt": "2026-10-02T23:22:28.073Z",
    "updatedAt": "2026-10-02T23:22:28.073Z"
  }
  ```

#### 2. Get All Tasks for a Project
* **Method:** `GET`
* **Endpoint:** `/api/projects/:projectId/tasks`
* **Access:** Protected (Owner of Project)
* **Response (`200 OK`):** Array of tasks associated with specified project.

#### 3. Get Task by ID
* **Method:** `GET`
* **Endpoint:** `/api/tasks/:id`
* **Access:** Protected (Owner of Task's Parent Project)
* **Response (`200 OK`):** Task object with populated project details.

#### 4. Update Task Status/Details
* **Method:** `PUT`
* **Endpoint:** `/api/tasks/:id`
* **Access:** Protected (Owner of Task's Parent Project)
* **Request Body:**
  ```json
  {
    "status": "In Progress"
  }
  ```
* **Response (`200 OK`):** Updated task object.

#### 5. Delete Task
* **Method:** `DELETE`
* **Endpoint:** `/api/tasks/:id`
* **Access:** Protected (Owner of Task's Parent Project)
* **Response (`200 OK`):**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```


## Security Best Practices Implemented

1. **Environment Isolation:** Keys and sensitive data stored in `.env`.
2. **Password Security:** Salted and hashed using `bcrypt` pre-save middleware.
3. **Authorization Isolation:** Users can never view, mutate, or delete resources belonging to other accounts.
4. **Validations:** Mongoose schema validations prevent invalid data insertion.