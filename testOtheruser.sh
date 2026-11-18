#!/bin/bash

# Step 1: Login and capture JWT
echo "[1] Logging in and capturing JWT token..."
response=$(curl -s -X GET "http://localhost:8090/user-service/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "alice.johnson@example.com", "password": "Password123"}')

jwt=$(echo "$response")

if [ -z "$jwt" ]; then
  echo "❌ Login failed or JWT not returned."
  exit 1
fi

echo "✅ JWT captured:"
echo "$jwt"

# Step 2: Verify token
echo -e "\n[2] Verifying token..."
verify=$(curl -s -X GET http://localhost:8090/user-service/user/verifyToken \
  -H "jwtToken: $jwt")

echo "Response: $verify"

# Step 3: Check isAdmin
echo -e "\n[3] Checking if user is admin..."
adminCheck=$(curl -s -X GET http://localhost:8090/user-service/user/isAdmin \
  -H "jwtToken: $jwt")

echo "Response: $adminCheck"

# Step 4: Fetch profile
echo -e "\n[4] Fetching user profile..."
profile=$(curl -s -X GET http://localhost:8090/user-service/user/profile \
  -H "Content-Type: application/json" \
  -H "jwtToken: $jwt")

echo "Profile:"
echo "$profile"

