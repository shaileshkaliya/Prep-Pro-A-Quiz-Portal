package com.quizz.user.User.Controller;

import com.quizz.user.User.Dao.UserDao;
import com.quizz.user.User.Feign.QuizFeignForUser;
import com.quizz.user.User.Model.*;
import com.quizz.user.User.Service.UserService;
import com.quizz.user.User.Utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("user")
public class RestUserController {

    @Autowired
    private UserService userService_;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDao userDao_;
    @Autowired
    private QuizFeignForUser quizFeign_;


    @GetMapping("/profile")
    public ResponseEntity<UserInfo> fetchProfile(@RequestHeader("jwtToken") String token){
        Map<String, Object> response = userService_.fetchProfile(token);
        if(response.get("message").equals("Token Authenticated")){
            return new ResponseEntity<>((UserInfo)response.get("user"), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserSignIn userLogin) {
        // Call the login service method
        Map<String, String> response = userService_.login(userLogin);

        // If response contains "Bearer", it's a token, else it's an error message
        if (response.containsKey("token")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }


    @PostMapping("signup")
    public ResponseEntity<String> signup(@RequestBody List<UserSignUp> userSignUp, @RequestHeader("jwtToken") String token){
 	   if (Boolean.TRUE.equals(userService_.isAdmin(token).getBody())) {
        	String response = userService_.signup(userSignUp);
        	return response.equals("Successfull")
            		? new ResponseEntity<>("User created successfully.", HttpStatus.CREATED)
            		: new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    	  }
       	  return new ResponseEntity<>("Only admins can create users", HttpStatus.UNAUTHORIZED);
    }
    @PostMapping("/reset-password")
    @CacheEvict(value = "users", key = "#userSignIn.email")
    public ResponseEntity<String> resetPassword(@RequestBody UserSignIn userLogin) {
        boolean response = userService_.updatePass(userLogin);
        if (response) {
            return new ResponseEntity<>("✅ Password updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("❌ Failed to update password", HttpStatus.BAD_REQUEST);
    	}
    }

    @PostMapping("/{userId}/attended-quiz/{quizId}")
    public ResponseEntity<String> updateAttendedQuizzes(
            @PathVariable String userId, @PathVariable String quizId) {

        String response = userService_.updateAttendedQuizzes(userId, quizId);
        if (response.equals("User not found")) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/verifyToken")
    public boolean verifyToken(@RequestHeader("jwtToken") String token){
        if (token == null || token.isEmpty())
            return false;
        try {
            token = token.substring(7);
            String email = jwtUtil.getEmailFromToken(token);
            return jwtUtil.validateToken(token, email);
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping("/bulk-signup")
    public ResponseEntity<List<UserSignUp>> bulkSignUpUsers(@RequestParam("file") MultipartFile file, @RequestHeader("jwtToken") String token
                                                  ) throws IOException {
        if (Boolean.TRUE.equals(userService_.isAdmin(token).getBody())) {

            List<UserSignUp> signUpList = new ArrayList<>();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                String line;
                boolean isFirstLine = true;

                while ((line = reader.readLine()) != null) {
                    if (isFirstLine) {
                        isFirstLine = false; // Skip header
                        continue;
                    }

                    String[] values = line.split(",");
                    if (values.length != 3) {
                        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
                    }

                    UserSignUp userSignUp = new UserSignUp();
                    userSignUp.setName(values[0].trim());
                    userSignUp.setEmail(values[1].trim());
                    userSignUp.setPassword(values[2].trim());

                    signUpList.add(userSignUp);
                }

                return new ResponseEntity<>(signUpList, HttpStatus.CREATED);

            } catch (IOException e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/allUsers")
    public ResponseEntity<Map<String, Object>> getAllUsers(@RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userService_.isAdmin(token).getBody())) {
            List<UserInfo> users = userService_.getAllUsers();
            return new ResponseEntity<>(Map.of("users", users), HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("message", "Unauthorized: Only admins can view users"), HttpStatus.UNAUTHORIZED);
    }
						   

    @DeleteMapping("/deleteUsers")
    public ResponseEntity<String> deleteUsers(@RequestHeader("jwtToken") String token,
                                              @RequestBody List<String> emails) {
        if (Boolean.TRUE.equals(userService_.isAdmin(token).getBody())) {
            String result = userService_.deleteUsersByEmails(emails);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>("Only admins can delete users", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/isAdmin")
    public ResponseEntity<Boolean> isLoggedInUserAdmin(@RequestHeader("jwtToken") String token) {
        return userService_.isAdmin(token);
    }

    @GetMapping("/fetchAdminDashboardData")
    public ResponseEntity<Map<String, Object>> fetchAdminDashboardData(@RequestHeader("jwtToken") String token) {
        Map<String, Object> response = quizFeign_.getQuizCount(token).getBody();
        if (response == null) {
            return new ResponseEntity<>(Map.of("message", "No data found"), HttpStatus.NO_CONTENT);
        }
        try {
            long userCount = userDao_.count();
            response.put("participants", userCount);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("userNames")
    public ResponseEntity<Map<String, String>> getUserNames(@RequestBody List<String> userIds, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userService_.isAdmin(token).getBody())) {
            return new ResponseEntity<>(userService_.getAllUserNames(userIds), HttpStatus.OK);
        } else{
            return new ResponseEntity<>(Map.of("message", "User should be authenticated admin"), HttpStatus.UNAUTHORIZED);
        }
    }


}
