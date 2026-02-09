# Todo App - Microservices Architecture

## Architecture Overview

This application is split into 3 microservices following the CQRS pattern:

```
┌─────────────────────┐
│  Frontend Service   │  Port 3000
│  (Static Files +    │
│   API Gateway)      │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼─────┐
│  Read   │ │  Write  │
│ Service │ │ Service │
│ Port    │ │ Port    │
│ 3001    │ │ 3002    │
└────┬────┘ └───┬─────┘
     │          │
     └────┬─────┘
          │
     ┌────▼────┐
     │  MySQL  │
     │  Port   │
     │  3306   │
     └─────────┘
```

## Services

### 1. Frontend Service (Port 3000)
- Serves static HTML/CSS/JS files
- Acts as API Gateway
- Routes requests to Read/Write services

### 2. Todo Read Service (Port 3001)
- Handles all READ operations
- Endpoints:
  - `GET /items` - Get all todos
  - `GET /items/:id` - Get single todo
  - `GET /health` - Health check

### 3. Todo Write Service (Port 3002)
- Handles all WRITE operations
- Endpoints:
  - `POST /items` - Create new todo
  - `PUT /items/:id` - Update todo
  - `DELETE /items/:id` - Delete todo
  - `GET /health` - Health check

### 4. MySQL Database (Port 3306)
- Shared database for all services
- Table: `todo_items`

## Running Locally with Docker Compose

```bash
cd microservices
docker-compose up --build
```

Access the application at: http://localhost:3000

## Building Individual Services

### Frontend Service
```bash
cd frontend-service
docker build -t frontend-service:1.0.0 .
```

### Read Service
```bash
cd todo-read-service
docker build -t todo-read-service:1.0.0 .
```

### Write Service
```bash
cd todo-write-service
docker build -t todo-write-service:1.0.0 .
```

## Environment Variables

### Read Service
- `MYSQL_HOST` - MySQL host (default: localhost)
- `MYSQL_USER` - MySQL user (default: root)
- `MYSQL_PASSWORD` - MySQL password (default: password)
- `MYSQL_DB` - Database name (default: todos)

### Write Service
- `MYSQL_HOST` - MySQL host (default: localhost)
- `MYSQL_USER` - MySQL user (default: root)
- `MYSQL_PASSWORD` - MySQL password (default: password)
- `MYSQL_DB` - Database name (default: todos)

### Frontend Service
- `READ_SERVICE_URL` - Read service URL (default: http://localhost:3001)
- `WRITE_SERVICE_URL` - Write service URL (default: http://localhost:3002)

## Deploying to AWS ECS Fargate

Each service can be deployed as a separate ECS Task:

1. Push images to ECR
2. Create Task Definitions for each service
3. Create ECS Services
4. Use Application Load Balancer for routing
5. Use AWS RDS MySQL for database

## Benefits of This Architecture

✅ **Separation of Concerns** - Read and Write operations are isolated
✅ **Independent Scaling** - Scale read-heavy and write-heavy workloads separately
✅ **Fault Isolation** - Failure in one service doesn't affect others
✅ **Technology Flexibility** - Each service can use different tech stack
✅ **CQRS Pattern** - Command Query Responsibility Segregation
