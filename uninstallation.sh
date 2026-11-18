#!/bin/bash

set -e

service_unit_name="quizapp.service"
service_script_name="quiz-service.sh"
service_unit_path="/etc/systemd/system/$service_unit_name"
service_script_path="/usr/local/bin/$service_script_name"
network_name="quiz-network"

# Define services to remove containers/images if needed
declare -a services=("serviceregistry" "apigateway" "question" "quiz" "user" "qpfentry" "mongo")

echo "🛑 Stopping and disabling systemd service..."
sudo systemctl stop "$service_unit_name" || echo "⚠️ Service not running."
sudo systemctl disable "$service_unit_name" || echo "⚠️ Service not enabled."

echo "🧽 Removing systemd service unit file..."
if [ -f "$service_unit_path" ]; then
    sudo rm "$service_unit_path"
else
    echo "ℹ️ No systemd unit file found at $service_unit_path"
fi

echo "🧹 Removing service script..."
if [ -f "$service_script_path" ]; then
    sudo rm "$service_script_path"
else
    echo "ℹ️ No script found at $service_script_path"
fi

echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

# Optional: Remove Docker containers and images
read -p "❓ Do you want to remove all related Docker containers/images and network? (y/N): " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo "🚮 Removing Docker containers..."
    for service in "${services[@]}"; do
        container=$(echo "$service" | tr '[:upper:]' '[:lower:]')

        if docker ps -a --format '{{.Names}}' | grep -q "^$container$"; then
            docker stop "$container" && docker rm "$container"
            echo "🗑️ Removed container: $container"
        fi

        if docker images --format '{{.Repository}}' | grep -q "^$container$"; then
            docker rmi "$container" || echo "⚠️ Failed to remove image for $container"
        fi
    done

    echo "🧯 Removing Docker network..."
    if docker network ls | grep -q "$network_name"; then
        docker network rm "$network_name"
        echo "🧹 Removed Docker network: $network_name"
    else
        echo "ℹ️ Docker network $network_name not found."
    fi
else
    echo "⚠️ Skipping Docker cleanup."
fi

echo "✅ Uninstallation complete."

