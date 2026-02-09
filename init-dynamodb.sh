#!/bin/bash

echo "Waiting for DynamoDB Local to be ready..."
sleep 5

echo "Creating TodoItems table..."
aws dynamodb create-table \
  --table-name TodoItems \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://dynamodb-local:8000 \
  --region ap-southeast-1

echo "DynamoDB table created successfully!"
