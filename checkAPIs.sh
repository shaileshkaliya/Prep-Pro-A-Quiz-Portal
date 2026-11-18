#!/bin/bash

# Total number of endpoints (including login)
TOTAL=25
SUCCESS=0
CURRENT=0
docker exec -it qpfentry curl -X GET "http://serviceregistry:8761/eureka/apps" | grep name
print_progress() {
    local progress=$((CURRENT * 100 / TOTAL))
    local done=$((progress / 5))
    local left=$((20 - done))
    printf "\r["
    for ((i = 0; i < done; i++)); do printf "#"; done
    for ((i = 0; i < left; i++)); do printf "."; done
    printf "] %d%%" "$progress"
}

echo "Authenticating and retrieving JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8080/user-service/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "Group08.admin@gmail.com", "password": "Group08@pccoe"}')

JWT=$(echo "$LOGIN_RESPONSE")

if [ -z "$JWT" ]; then
  echo "❌ Failed to retrieve JWT token. Aborting."
  exit 1
fi

echo "✅ JWT token acquired."
CURRENT=$((CURRENT + 1))
SUCCESS=$((SUCCESS + 1))
print_progress

run_test() {
  local desc="$1"
  local cmd="$2"
  local response=$(eval "$cmd" 2>/dev/null)

  CURRENT=$((CURRENT + 1))

  if [[ $? -eq 0 && $response != "" ]]; then
    echo "✅ $desc Successful"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "❌ $desc Failed"
  fi

  print_progress
}


run_test "User Profile" "curl -s -X GET http://localhost:8080/user-service/user/profile -H 'Content-Type: application/json' -H 'jwtToken: $JWT'"

run_test "Verify Token" "curl -s -X GET http://localhost:8080/user-service/user/verifyToken -H 'jwtToken: $JWT'"

run_test "Check isAdmin" "curl -s -X GET http://localhost:8080/user-service/user/isAdmin -H 'jwtToken: $JWT'"

run_test "Bulk User Adding" "curl -s -X POST http://localhost:8080/user-service/user/bulk-signup -H 'jwtToken: $JWT' -F 'file=@signUp.csv'"

run_test "Signup New User" "curl -s -X POST http://localhost:8080/user-service/user/signup -H 'Content-Type: application/json' -H 'jwtToken: $JWT' -d '{\"name\": \"New User\",\"email\": \"newuser@example.com\",\"password\": \"SecurePassword123\"}'"

run_test "Create Quiz 1" "curl -s -X POST http://localhost:8080/quiz-service/quiz/create -H 'Content-Type: application/json' -H 'jwtToken: $JWT' -d '{\"title\": \"sample quiz\",\"companyName\": \"ExampleCorp\",\"quizTime\": 30,\"numQuestions\": 10}'"

run_test "Create Quiz 2" "curl -s -X POST http://localhost:8080/quiz-service/quiz/create -H 'Content-Type: application/json' -H 'jwtToken: $JWT' -d '{\"title\": \"Java Basics\",\"companyName\": \"ExampleCorp\",\"quizTime\": 30,\"numQuestions\": 10}'"

run_test "Get All Quizzes" "curl -s -X GET http://localhost:8080/quiz-service/quiz/getAllQuizzes -H 'jwtToken: $JWT'"

run_test "Get Quizzes By Company Name" "curl -s -X GET http://localhost:8080/quiz-service/quiz/getAllQuizzesByCompanyName/ExampleCorp -H 'jwtToken: $JWT'"
# 🧠 Dynamically extract the quiz ID for "Java Basics"
QUIZ_RESPONSE=$(curl -s -X GET http://localhost:8080/quiz-service/quiz/getAllQuizzesByCompanyName/ExampleCorp \
  -H "jwtToken: $JWT")
QUIZ_ID=$(echo "$QUIZ_RESPONSE" | jq -r '.[0].quizId')
if [ -z "$QUIZ_ID" ]; then
  echo -e "\n❌ Could not extract quizId"
  exit 1
else
  echo -e "\n✅ Extracted quizId: $QUIZ_ID"
fi

run_test "Get Quiz By ID" "curl -s -X GET http://localhost:8080/quiz-service/quiz/getQuiz/$QUIZ_ID -H 'jwtToken: $JWT'"

run_test "Add Question" "curl -s -X POST http://localhost:8080/question-service/questions/create/$QUIZ_ID -H 'Content-Type: application/json' -H 'jwtToken: $JWT' -d '[{\"questionContent\": \"What is the capital of France?\",\"options\": {\"A\": \"Paris\",\"B\": \"London\",\"C\": \"Berlin\",\"D\": \"Madrid\"},\"correctOptions\": [\"A\"],\"questionCategory\": 1}]'"

run_test "Get Questions by Quiz ID" "curl -s -X GET http://localhost:8080/question-service/questions/getQuestionsByQuizId/$QUIZ_ID -H 'jwtToken: $JWT'"

# Uncomment if you have a `questions.csv` file
run_test "Bulk Add Questions" "curl -s -X POST http://localhost:8080/question-service/questions/bulk-add/$QUIZ_ID -H 'jwtToken: $JWT' -F 'file=@questions.csv'"

run_test "Test User" "curl -s -X POST http://localhost:8080/user-service/user/login \
  -H Content-Type: application/json \
  -d '{email: suyash.gadhave21@pccoepune.org, password: Password123}'"

response=$(curl -s -X POST "http://localhost:8080/user-service/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "suyash.gadhave21@pccoepune.org", "password": "Password123"}')

jwt=$(echo "$response")

if [ -z "$jwt" ]; then
  echo "❌ Login failed or JWT not returned."
  exit 1
fi

# Step 2: Verify token
run_test "Verify Student User" "curl -s -X GET http://localhost:8080/user-service/user/verifyToken  -H 'jwtToken: $jwt'"

# Step 3: Check isAdmin
run_test "Check if Student is Admin or Not" "curl -s -X GET http://localhost:8080/user-service/user/isAdmin -H 'jwtToken: $jwt'"

# Step 4: Fetch profile
run_test "Get Student Profile" "curl -s -X GET http://localhost:8080/user-service/user/profile   -H 'Content-Type: application/json'   -H 'jwtToken: $jwt'"

run_test "Get All Users as Admin" "curl -X GET http://localhost:8080/user-service/user/all-users -H 'Content-Type: application/json' -H \"jwtToken: $JWT\""

run_test "Get All Users as Students" "curl -X GET http://localhost:8080/user-service/user/all-users -H 'Content-Type: application/json' -H \"jwtToken: $jwt\""

run_test "Delete User by Student" \
"curl -s -X DELETE http://localhost:8080/user-service/user/delete \
  -H 'Content-Type: application/json' \
  -H 'jwtToken: $jwt' \
  -d '[\"suyash.gadhave21@pccoepune.org\"]'"

run_test "Delete User by Admin" \
"curl -s -X DELETE http://localhost:8080/user-service/user/delete \
  -H 'Content-Type: application/json' \
  -H 'jwtToken: $JWT' \
  -d '[\"suyash.gadhave21@pccoepune.org\"]'"

run_test "Send OTP" "curl -X POST http://localhost:8080/emailservice/email/send-otp   -H \"Content-Type: application/json\"   -d '{\"email\": \"koustubhk2193@gmail.com\"}'" 

run_test "Update Password" "curl -s -X GET http://localhost:8080/user-service/user/reset-password \                                      -H Content-Type: application/json \                                                                                     -d '{email: suyash.gadhave21@pccoepune.org, password: Password321}'"



run_test "Check LogIn After Update Password" "curl -s -X POST http://localhost:8080/user-service/user/login \                                      -H Content-Type: application/json \                                                                                     -d '{email: suyash.gadhave21@pccoepune.org, password: Password321}'"


echo -e "\n\n✅ Testing Complete!"
PERCENT=$((SUCCESS * 100 / TOTAL))
echo "✅ Success Rate: $PERCENT% ($SUCCESS/$TOTAL)"

