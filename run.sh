#!/bin/bash

echo "Install dependencies..."
npm install

echo "Building the prod version..."
npm run build

echo "Delete active the container..."
docker rm -f chat-frontend-container 2>/dev/null || true

echo "Building the image..."
docker build -t chat-frontend .

echo "Starting the container..."
docker run -d -p 8080:80 --name chat-frontend-container chat-frontend