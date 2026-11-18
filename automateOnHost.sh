#!/bin/bash

# List of services
services=(serviceRegistry APIGateway EmailService User qpfEntry question quiz)

# Save current directory
BASE_DIR=$(pwd)

# Function to run a service
start_service() {
    service=$1
    echo "▶️ Building and starting $service..."
    
    cd "$BASE_DIR/$service" || exit

    echo "📦 Running mvn clean install for $service..."
    mvn clean install -DskipTests

    echo "🚀 Starting $service with mvn spring-boot:run..."
    nohup mvn spring-boot:run > "$BASE_DIR/${service}_log.txt" 2>&1 &

    echo "✅ $service started. Logs: ${service}_log.txt"
}

# Loop through each service and start it
for service in "${services[@]}"
do
    start_service "$service"
done

echo "🎉 All services have been started!"

