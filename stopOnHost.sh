#!/bin/bash

# List of services
services=(APIGateway EmailService User qpfEntry question quiz serviceRegistry)

echo "🛑 Stopping all running Spring Boot services..."

for service in "${services[@]}"
do
    echo "🔍 Looking for $service process..."

    # Find the process ID running mvn spring-boot:run in the service directory
    PID=$(ps aux | grep "mvn spring-boot:run" | grep "$service" | grep -v grep | awk '{print $2}')

    if [ -n "$PID" ]; then
        echo "⚙️ Found $service running with PID: $PID. Stopping..."
        kill -9 "$PID"
        echo "✅ $service stopped."
    else
        echo "ℹ️ $service is not running."
    fi
done

echo "🎉 All specified services have been checked and stopped (if running)."

