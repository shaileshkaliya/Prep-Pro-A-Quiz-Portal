#!/bin/bash

# Define services and their ports
declare -A services=(
    ["serviceregistry"]="8761"
    ["apigateway"]="8090"
    ["question"]="8082"
    ["quiz"]="8081"
    ["user"]="8083"
    ["qpfentry"]="8084"
)

# Create Docker network if it doesn't exist
network_name="quiz-network"
if ! docker network ls | grep -q "$network_name"; then
    echo "Creating Docker network: $network_name"
    docker network create "$network_name"
else
    echo "Docker network $network_name already exists."
fi

# Start MongoDB if not running
mongo_container="mongo"
if ! docker ps -a --format '{{.Names}}' | grep -q "^$mongo_container$"; then
    echo "Starting MongoDB container..."
    docker run -d --name "$mongo_container" --network "$network_name" -p 27017:27017 mongo
else
    echo "MongoDB container already exists."
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

    # Define port mapping: Only expose API Gateway, others should be internal
    port_mapping=""
    if [[ "$service" == "apigateway" ]]; then
        port_mapping="-p $port:$port"  # Expose API Gateway to host
    fi

    # Run the container and link MongoDB
    echo "Running $service container..."
    docker run -d --name "$service_lower" --network "$network_name" $port_mapping -e MONGO_URI="mongodb://mongo:27017" "$service_lower"

    # Go back to root directory
    cd ..
done

echo "✅ All services have been deployed successfully!"

