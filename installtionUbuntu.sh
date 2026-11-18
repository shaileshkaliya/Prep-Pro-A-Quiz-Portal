#!/bin/bash

set -e

# === 1. Docker Installation ===
echo "🔍 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
      https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    echo "✅ Docker installed."
else
    echo "✅ Docker already installed."
fi

# === 2. Setup docker group ===
echo "👤 Adding user to docker group..."
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker "$USER"
echo "ℹ️ You may need to log out and log in again for group changes to take effect."

# === 3. Build Docker images ===
declare -A services=(
    ["serviceregistry"]="8761"
    ["apigateway"]="8090"
    ["question"]="8082"
    ["quiz"]="8081"
    ["user"]="8083"
    ["qpfentry"]="8084"
)

for service in "${!services[@]}"; do
    port="${services[$service]}"
    echo "🔨 Building Docker image for $service..."
    cd "./$service" || { echo "❌ Error: Directory $service not found"; exit 1; }
    docker build -t "$(echo "$service" | tr '[:upper:]' '[:lower:]')" .
    cd ..
done

# === 4. Place service script ===
service_script="quiz-service.sh"
service_script_path="/usr/local/bin/$service_script"

echo "📂 Installing $service_script to /usr/local/bin..."
sudo cp "$service_script" "$service_script_path"
sudo chmod +x "$service_script_path"

# === 5. Create systemd service ===
echo "🛠️ Setting up systemd service..."

cat <<EOF | sudo tee /etc/systemd/system/quizapp.service > /dev/null
[Unit]
Description=Quiz App Container Management Service
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
ExecStart=/usr/local/bin/quiz-service.sh start
ExecStop=/usr/local/bin/quiz-service.sh stop
ExecReload=/usr/local/bin/quiz-service.sh restart
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable quizapp.service

echo "✅ Installation complete!"
echo "👉 You can now start your service using: sudo systemctl start quizapp"

