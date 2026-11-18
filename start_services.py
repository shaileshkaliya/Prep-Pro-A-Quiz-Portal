import os
import subprocess

# List of services
services = [
    "serviceRegistry",
    "APIGateway",
    "EmailService",
    "User",
    "qpfEntry",
    "question",
    "quiz"
]

# Save current directory
BASE_DIR = os.getcwd()

# Function to run a service
def start_service(service):
    print(f"▶ Building and starting {service}...")

    service_dir = os.path.join(BASE_DIR, service)
    if not os.path.isdir(service_dir):
        print(f"❌ Directory for {service} not found: {service_dir}")
        return

    os.chdir(service_dir)

    print(f"📦 Running mvn clean install for {service}...")
    subprocess.run(["mvn", "clean", "install", "-DskipTests"], check=True)

    log_file = os.path.join(BASE_DIR, f"{service}_log.txt")
    print(f"🚀 Starting {service} with mvn spring-boot:run...")
    
    with open(log_file, "w") as log:
        subprocess.Popen(
            ["mvn", "spring-boot:run"],
            stdout=log,
            stderr=subprocess.STDOUT
        )

    print(f"✅ {service} started. Logs: {log_file}")

# Start all services
for service in services:
    start_service(service)

print("🎉 All services have been started!")



