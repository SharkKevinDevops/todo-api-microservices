# Todo App - Microservices Architecture with DynamoDB

## Architecture Overview

This application is split into 3 microservices following the CQRS pattern:

```
┌─────────────────────┐
│  Frontend Service   │  Port 3000
│  (Static Files)     │
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
     │DynamoDB │
     │ (NoSQL) │
     └─────────┘
```

## Services

### 1. Frontend Service (Port 3000)
- Serves static HTML/CSS/JS files
- Single Page Application

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

### 4. DynamoDB
- Serverless NoSQL database
- Table: `TodoItems`
- Primary Key: `id` (String)

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
- `DYNAMODB_TABLE` - DynamoDB table name (default: TodoItems)
- `AWS_REGION` - AWS region (default: ap-southeast-1)
- `AWS_ENDPOINT_URL` - DynamoDB endpoint (for local testing)

### Write Service
- `DYNAMODB_TABLE` - DynamoDB table name (default: TodoItems)
- `AWS_REGION` - AWS region (default: ap-southeast-1)
- `AWS_ENDPOINT_URL` - DynamoDB endpoint (for local testing)

## Deploying to AWS ECS Fargate

### Prerequisites
1. Create DynamoDB table:
```bash
aws dynamodb create-table \
  --table-name TodoItems \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1
```

2. Push images to ECR
3. Create ECS Task Definitions with IAM roles for DynamoDB access
4. Create ECS Services
5. Use Application Load Balancer for routing

### Required IAM Permissions

ECS Task Role needs:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-southeast-1:*:table/TodoItems"
    }
  ]
}
```

## Benefits of This Architecture

✅ **Separation of Concerns** - Read and Write operations are isolated
✅ **Independent Scaling** - Scale read-heavy and write-heavy workloads separately
✅ **Serverless Database** - No database container to manage
✅ **Auto-scaling** - DynamoDB scales automatically
✅ **High Availability** - DynamoDB is multi-AZ by default
✅ **Cost Effective** - Pay per request with DynamoDB
✅ **CQRS Pattern** - Command Query Responsibility Segregation
