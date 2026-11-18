#!/bin/bash

echo "Applying all deployments..."
kubectl apply -f k8s/deployments/

echo "Applying all services..."
kubectl apply -f k8s/services/

echo "Done. Use 'kubectl get pods' and 'kubectl get svc' to verify."

