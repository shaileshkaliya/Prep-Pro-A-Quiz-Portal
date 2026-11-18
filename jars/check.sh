# Define Docker network
docker network create quiz-network || echo "Network already exists."

# Start MongoDB on host (Ensure MongoDB is running locally on port 27017)
echo "✅ Exposing host MongoDB to Docker network..."

# Run APIGateway with Host Mapping
docker run -d --name apigateway --network quiz-network -p 8090:8090 apigateway


docker rm user qpfentry question quiz serviceregistry



# Run Other Services Without Host Exposure (Internal Networking)
docker run -d --name user --network quiz-network user
docker run -d --name qpfentry --network quiz-network qpfentry
docker run -d --name question --network quiz-network question
docker run -d --name quiz --network quiz-network quiz
docker run -d --name serviceregistry --network quiz-network serviceregistry

# Connect all containers to the host MongoDB
docker network connect bridge apigateway
docker network connect bridge user
docker network connect bridge qpfentry
docker network connect bridge question
docker network connect bridge quiz
docker network connect bridge serviceregistry

echo "✅ Services started successfully!"

