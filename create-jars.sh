#!/bin/bash

# Mapping of service folder to output jar name
declare -A services=(
  ["quiz"]="quiz"
  ["question"]="question"
  ["qpfEntry"]="qpfEntry"
  ["User"]="User"
  ["serviceRegistry"]="serviceRegistry"
  ["APIGateway"]="APIGateway"
  ["EmailService"]="emailservice"
)

echo "🚀 Starting build and copy of JARs to jars/<lowercase_dir>/..."

# Loop through each service
for service_dir in "${!services[@]}"; do
  jar_name="${services[$service_dir]}.jar"
  lowercase_dir=$(echo "$service_dir" | tr '[:upper:]' '[:lower:]')

  echo ""
  echo "🔧 Building $service_dir..."
  cd "$service_dir" || { echo "❌ Failed to enter $service_dir directory"; exit 1; }

  # Build the service
  mvn clean package -DskipTests
  if [ $? -ne 0 ]; then
    echo "❌ Maven build failed for $service_dir"
    exit 1
  fi

  # Find the jar and copy it
  target_jar=$(find target -name "*SNAPSHOT.jar" | head -n 1)
  if [ -z "$target_jar" ]; then
    echo "❌ JAR not found for $service_dir"
    exit 1
  fi


  # Copy jar
  echo "📦 Copying $target_jar to jars/$lowercase_dir/$jar_name"
  cp "$target_jar" "../jars/$lowercase_dir/$jar_name"

  cd ..
done

echo ""
echo "✅ All modules built and copied successfully!"

