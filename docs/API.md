# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error message"
}
```

### Pagination Response
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

---

### Users

#### Get All Users (Admin)
```http
GET /users?page=1&limit=10
```

#### Get User by ID
```http
GET /users/:id
```

#### Update User
```http
PATCH /users/:id
```

**Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### Delete User (Admin)
```http
DELETE /users/:id
```

---

### Classes

#### Get All Classes
```http
GET /classes
```

#### Get Class by ID
```http
GET /classes/:id
```

#### Create Class (Admin/Teacher)
```http
POST /classes
```

**Body:**
```json
{
  "name": "Math 101",
  "description": "Introduction to Mathematics",
  "teacherId": "teacher-uuid"
}
```

#### Update Class (Admin/Teacher)
```http
PATCH /classes/:id
```

#### Delete Class (Admin)
```http
DELETE /classes/:id
```

---

### Attendance

#### Get Attendance by Class
```http
GET /attendance/class/:classId
```

#### Mark Attendance (Teacher)
```http
POST /attendance
```

**Body:**
```json
{
  "studentId": "student-uuid",
  "classId": "class-uuid",
  "status": "PRESENT"
}
```

#### Update Attendance (Teacher)
```http
PATCH /attendance/:id
```

---

### Grades

#### Get Student Grades
```http
GET /grades/student/:studentId
```

#### Create Grade (Teacher/Admin)
```http
POST /grades
```

**Body:**
```json
{
  "studentId": "student-uuid",
  "classId": "class-uuid",
  "grade": 95.5,
  "subject": "Mathematics"
}
```

#### Update Grade (Teacher/Admin)
```http
PATCH /grades/:id
```

---

### Notifications

#### Get Notifications
```http
GET /notifications
```

#### Mark as Read
```http
PATCH /notifications/:id/read
```

#### Send Notification
```http
POST /notifications
```

**Body:**
```json
{
  "userId": "user-uuid",
  "title": "Notification Title",
  "message": "Notification message"
}
```

---

### Admin

#### Get Dashboard Stats
```http
GET /admin/stats
```

#### Get Recent Activities
```http
GET /admin/activities
```

---

## Error Codes

- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (Resource already exists)
- `500` - Internal Server Error
