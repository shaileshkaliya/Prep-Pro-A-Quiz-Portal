#!/bin/bash

# Define services and their ports
declare -A services=(
    ["serviceregistry"]="8761"
    ["apigateway"]="8080"
    ["question"]="8082"
    ["quiz"]="8081"
    ["user"]="8083"
    ["qpfentry"]="8084"
    ["emailservice"]="8587"
)

network_name="quiz-network"
mongo_container="mongo"

ensure_network() {
    if ! docker network ls | grep -q "$network_name"; then
        echo "🔗 Creating Docker network: $network_name"
        docker network create "$network_name"
    else
        echo "ℹ️ Docker network $network_name already exists."
    fi
}

start_services() {
    echo "🚀 Starting all services..."

    ensure_network

    # Start MongoDB if not running
    if ! docker ps --format '{{.Names}}' | grep -q "^$mongo_container$"; then
        if docker ps -a --format '{{.Names}}' | grep -q "^$mongo_container$"; then
            echo "📦 Starting existing MongoDB container..."
            docker start "$mongo_container"
        else
            echo "🆕 Launching new MongoDB container..."
            docker run -d --name "$mongo_container" --network "$network_name" -p 27017:27017 mongo
        fi
    else
        echo "✅ MongoDB is already running."
    fi

    for service in "${!services[@]}"; do
        service_lower=$(echo "$service" | tr '[:upper:]' '[:lower:]')
        port="${services[$service]}"

        if docker ps --format '{{.Names}}' | grep -q "^$service_lower$"; then
            echo "✅ $service_lower is already running."
        elif docker ps -a --format '{{.Names}}' | grep -q "^$service_lower$"; then
            echo "🔄 Starting existing container: $service_lower"
            docker start "$service_lower"
        else
            echo "🆕 Running new container for $service_lower"
            port_mapping=""
            [[ "$service" == "apigateway" ]] && port_mapping="-p $port:$port"

            docker run -d --name "$service_lower" --network "$network_name" $port_mapping -e MONGO_URI="mongodb://mongo:27017" "$service_lower"
        fi
    done
    echo "✅ All services started."
}

stop_services() {
    echo "🛑 Stopping all containers..."
    for service in "${!services[@]}"; do
        service_lower=$(echo "$service" | tr '[:upper:]' '[:lower:]')
        if docker ps --format '{{.Names}}' | grep -q "^$service_lower$"; then
            echo "🔻 Stopping $service_lower"
            docker stop "$service_lower"
        fi
    done

    if docker ps --format '{{.Names}}' | grep -q "^$mongo_container$"; then
        echo "🔻 Stopping MongoDB"
        docker stop "$mongo_container"
    fi

    echo "✅ All containers stopped."
}

restart_services() {
    echo "♻️ Restarting all containers..."
    stop_services
    start_services
}

# -------------------
# MAIN ENTRY POINT
# -------------------

case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac

