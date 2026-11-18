#!/bin/bash

# Define services and their ports
declare -A services=(
    ["apigateway"]="8090"
    ["qpfentry"]="8084"
    ["question"]="8082"
    ["quiz"]="8081"
    ["serviceregistry"]="8761"
    ["user"]="8083"
)

# Create Docker network if it doesn't exist
network_name="quiz-network"
if ! docker network ls | grep -q "$network_name"; then
    echo "Creating Docker network: $network_name"
    docker network create "$network_name"
else
    echo "Docker network $network_name already exists."
fi

# Function to check if a port is in use
is_port_in_use() {
    local port=$1
    if netstat -tuln | grep -q ":$port "; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Loop through each service directory
for service in "${!services[@]}"; do
    port="${services[$service]}"
    
    echo "Processing $service..."

    # Convert service name to lowercase
    service_lower=$(echo "$service" | tr '[:upper:]' '[:lower:]')

    # Stop and remove existing container if running
    if docker ps -a --format '{{.Names}}' | grep -q "^$service_lower$"; then
        echo "Stopping and removing existing container: $service_lower"
        docker stop "$service_lower"
        docker rm "$service_lower"
    fi

    # Navigate to the service directory
    cd "./$service" || { echo "Error: Cannot find $service directory"; exit 1; }

    # Build Docker image
    echo "Building Docker image for $service..."
    docker build -t "$service_lower" .

    # Check if the port is in use before running the container
    if is_port_in_use "$port"; then
        echo "⚠️ Port $port is already in use. Skipping $service container."
    else
        echo "Running $service container..."
        docker run -d --name "$service_lower" --network "$network_name" -p "$port:$port" "$service_lower"
    fi

    # Go back to root directory
    cd ..
done

echo "✅ All services have been deployed successfully!"

