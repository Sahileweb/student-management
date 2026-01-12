# Student Management System (Admin & Student)

A full-stack MERN application that allows **Admins** to manage students and tasks, and **Students** to view and submit tasks.  
The project implements **JWT authentication**, **role-based access control**, and a protected dashboard for each role.

---

## Features

### 🔐 Authentication & Authorization
- User Registration and Login
- Password hashing using **bcrypt**
- Token-based authentication using **JWT**
- Protected routes with middleware

### Role-Based Access Control (RBAC)
- Admin-only routes protected via middleware
- Student-only routes for task access and submission
- Token validation on all protected APIs

### Admin Features
- Create students
- View all students created by the admin
- Delete students
- Create tasks
- View all tasks
- Delete tasks
- Secure admin dashboard

### Student Features
- Login as student
- View assigned tasks
- Submit task answers (file upload supported)
- Secure student dashboard

---

## Tech Stack

### Frontend
- React
- TypeScript
- React Router DOM
- Context API (Auth Context)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

## Project Structure

### Backend
backend/
|── config/
│  └── db.js
├── controllers/
│ ├── adminController.js
│ ├── studentController.js
│ └── taskController.js
├── middleware/
│ ├── authMiddleware.js
│ └── roleMiddleware.js
├── models/
│ ├── Admin.js
│ ├── Student.js
│ └── Task.js
├── routes/
│ ├── adminRoutes.js
│ ├── studentRoutes.js
│ └── taskRoutes.js
├── .env
├── server.js
└── package.json


## API Reference

### Admin

**POST /api/auth/admin/login**  
Login as admin and receive JWT

**GET /api/admin/get-students**  
Returns list of all students (Admin only)

**POST /api/tasks/admin**  
Create a new task (Admin only)

**DELETE /api/tasks/admin/:id**  
Delete a task by ID (Admin only)

**DELETE /api/admin/admin/:id**  
Delete a student by ID (Admin only)

---

### Student

**POST /api/auth/student/login**  
Login as student and receive JWT

**GET /api/tasks/student**  
View assigned tasks (Student only)

**PUT /api/tasks/student/:id**
Student updates Task Status

---

## Data Models (Summary)

**Admin**  
`{ name, email, password(hash), role }`

**Student**  
`{ name, email, password(hash), assignedTasks }`

**Task**  
`{ title, description, deadline, createdBy }`


##  Security Considerations

- Passwords are never stored in plain text
- JWT tokens are required for all protected routes
- Role validation ensures restricted access
- File type validation for uploads

---

Scalability

Microservices
Split the system into independent services such as Auth Service, Student Service, Task Service, and File Upload Service. This enables independent scaling, better fault isolation, and clearer ownership boundaries.

API Gateway / Ingress
Introduce an API Gateway using NGINX or Envoy to handle TLS termination, routing, authentication, rate limiting, and request validation. This centralizes cross-cutting concerns and simplifies service communication.

Caching
Use Redis to cache frequently accessed data such as task lists, student profiles, and admin dashboards. Apply cache invalidation on task creation, deletion, or submission. Public or semi-static data can leverage HTTP caching headers.

Message Queue
Integrate Kafka or RabbitMQ for asynchronous workflows such as task submission processing, notifications, email alerts, and audit logging. This decouples long-running operations from request-response cycles.

Database Scaling
Use MongoDB read replicas for read-heavy operations (task lists, student views). Apply sharding or partitioning for large datasets such as submissions and logs. Maintain separate databases per service to reduce contention.

Load Balancing
Containerize services using Docker and orchestrate with Kubernetes. Use cloud load balancers to distribute traffic across multiple instances and regions for high availability.

Observability
Implement centralized logging using ELK/OpenSearch, metrics collection via Prometheus/Grafana, and distributed tracing with OpenTelemetry. Define SLAs, SLOs, and alerting rules for critical services.

Resilience
Apply retries with exponential backoff, circuit breakers, timeouts, and bulkhead isolation. Add health and readiness probes to ensure graceful deployments and fault recovery.

Security
Use mTLS for inter-service communication, secure secrets with Vault or KMS, rotate JWTs with short TTLs, enforce scoped RBAC, and apply per-route authorization policies.

CI/CD
Automate builds, tests, and deployments using CI/CD pipelines. Use canary or blue-green deployments with rollback strategies. Apply database migration safety checks and feature flags for progressive rollouts.

CDN & Edge
Serve static assets and documentation via a CDN. Cache non-sensitive API responses at the edge with appropriate TTLs to reduce backend load and improve latency.



This project was developed to:
- Demonstrate backend fundamentals
- Implement real-world authentication flows
- Apply role-based access control
- Work with file uploads and REST APIs
- Follow clean code and modular architecture

---

## License

Internal project created for internship evaluation and learning purposes.
