# Monolithic Node.js Application with JWT Authentication, Multer File Upload, and Data Transformation

## Overview

This project is a monolithic Node.js application that integrates authentication, file upload, and data transformation services. The application uses **JWT for authentication**, **Multer for file uploads**, and **custom transformation logic** to process CSV data.

## Features

### 1. Authentication Service

- Allows users to log in with **username and password**.
- Generates a **JWT token** upon successful login.
- Secures endpoints by requiring authentication.

### 2. File Upload Service

- Uses **Multer** for handling file uploads.
- Accepts only **CSV** files.
- Limits file size to **100MB**.
- Saves files locally for further processing.

### 3. Data Transformation Service

- Reads CSV data and applies **custom transformations** based on user-defined mappings.
- Supports:
  - **Field renaming**
  - **Mathematical operations**
  - **Conditional logic**
  - **Field-based calculations**
- Returns transformed data in **JSON format**.

## Installation & Setup

### 1. Clone the Repository

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
JWT_SECRET=Demo_test_123
```

### 4. Start the Server

```sh
npm run dev
```

## API Endpoints

### 1. **User Authentication**

#### **Login**

- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### 2. **File Upload**

#### **Upload a CSV File**

- **Endpoint:** `POST /upload`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  ```
- **Body:** Multipart Form Data (CSV File)
- **Response:**
  ```json
  {
    "message": "File uploaded successfully",
    "filename": "uploaded_file.csv"
  }
  ```

### 3. **Data Transformation**

#### **Transform Data from CSV**

- **Endpoint:** `POST /transform/`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  ```
- **Params:**

  ```
  filename:your save file name,
  page:your page details
  limit:limit of data
  ```

- **Request Body:**

  ```json
  {
    "mapping": {
      "emp_id": "employeeId",
      "full_name": "name",
      "dob": "dateOfBirth",
      "email": "contact.email",
      "salary": "compensation.baseSalary",
      "bonus": {
        "condition": "salary > 50000",
        "value": "salary * 0.1"
      },
      "age": {
        "transform": "calculateAge",
        "source": "dob"
      },
      "department": "work.department",
      "city": "location.city",
      "location": {
        "condition": "city === 'New York'",
        "value": "'NY'"
      },
      "start_date": "work.startDate"
    }
  }

  example body user can switch according their requirements
  ```

- **Response:**
  ```json
  [
    {
      "employeeId": "5708",
      "name": "Employee 2",
      "dateOfBirth": "2004-07-16",
      "contact": {
        "email": "user2@company.com"
      },
      "compensation": {
        "baseSalary": "95150"
      },
      "bonus": 9515.0,
      "age": 20,
      "work": {
        "department": "Operations",
        "startDate": "2021-10-14"
      },
      "location": {
        "city": "New York",
        "code": "NY"
      }
    }
  ]
  ```

### Security Considerations

- **JWT Authentication** ensures only authenticated users access file uploads and transformations.
- **File upload restrictions** prevent large and unsupported file types from being uploaded.
- **In-memory service communication** keeps API calls efficient without external HTTP requests.
