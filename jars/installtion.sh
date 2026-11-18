#!/bin/bash

set -e

# Define services and their ports
declare -A services=(
    ["serviceregistry"]="8761"
    ["apigateway"]="8090"
    ["question"]="8082"
    ["quiz"]="8081"
    ["user"]="8083"
    ["qpfentry"]="8084"
)

network_name="quiz-network"
service_script_name="quiz-service.sh"
service_unit_name="quizapp.service"

echo "🔧 Checking Docker network..."
if ! docker network ls | grep -q "$network_name"; then
    echo "🛠 Creating Docker network: $network_name"
    docker network create "$network_name"
else
    echo "ℹ️ Docker network $network_name already exists."
fi

echo "🔨 Building Docker images..."
for service in "${!services[@]}"; do
    echo "🚧 Building image for $service"
    service_lower=$(echo "$service" | tr '[:upper:]' '[:lower:]')

    if [ -d "$service" ]; then
        cd "$service"
        docker build -t "$service_lower" .
        cd ..
    else
        echo "❌ Directory $service not found. Skipping..."
    fi
done

echo "✅ All Docker images built successfully."

# ------------------------------
# Setup systemd service and script
# ------------------------------

# Define paths
SCRIPT_SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_SCRIPT_SOURCE="$SCRIPT_SOURCE_DIR/service.sh"
SERVICE_SCRIPT_TARGET="/usr/local/bin/$service_script_name"
SERVICE_UNIT_PATH="/etc/systemd/system/$service_unit_name"

echo "📦 Installing service script to $SERVICE_SCRIPT_TARGET"
sudo cp "$SERVICE_SCRIPT_SOURCE" "$SERVICE_SCRIPT_TARGET"
sudo chmod +x "$SERVICE_SCRIPT_TARGET"

echo "📝 Creating systemd unit file: $SERVICE_UNIT_PATH"
cat <<EOF | sudo tee "$SERVICE_UNIT_PATH" > /dev/null
[Unit]
Description=Quiz Application Docker Services
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=$SERVICE_SCRIPT_TARGET start
ExecStop=$SERVICE_SCRIPT_TARGET stop
ExecReload=$SERVICE_SCRIPT_TARGET restart
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
EOF

echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "📌 Enabling quizapp.service"
sudo systemctl enable "$service_unit_name"

echo "✅ Installation complete! Use: sudo systemctl start quizapp"

