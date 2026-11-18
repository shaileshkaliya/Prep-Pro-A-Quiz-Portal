package com.quizz.user.User.ServiceImpl;

import com.quizz.user.User.Dao.UserDao;
import com.quizz.user.User.Model.*;
import com.quizz.user.User.Service.UserService;
import com.quizz.user.User.Utils.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.quizz.user.User.Feign.EmailFeign;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao_;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AsyncMailService asyncMailService;
    private EmailFeign emailFeign;
    @Autowired
    private MongoTemplate mongoTemplate_;

    @PostConstruct
    public void createAdminUser() {
        if (userDao_.findByEmail("Group08.admin@gmail.com") == null) {
            UserModel userModel = new UserModel();
            String id = UUID.randomUUID().toString();
            userModel.setUserId(id);
            userModel.setName("Admin");
            userModel.setEmail("Group08.admin@gmail.com");
            userModel.setRole(0);
            userModel.setCreatedAt(LocalDateTime.now());
            userModel.setPassword(BCrypt.hashpw("Group08@pccoe", BCrypt.gensalt()));
            userModel.setAttendedQuizzes(new HashMap<>());
            UserModel response;
            try {
                response = userDao_.save(userModel);
                System.out.println("✅ Admin user created successfully.");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        } else {
            System.out.println("✅ Admin user already exists.");
        }
    }


    @Override
    public Map<String, String> login(UserSignIn userLogin) {
        UserModel user = userDao_.findByEmail(userLogin.getEmail());
        if (user == null) {
            return Map.of("message", "Account does not exist. Login unsuccessful.");
        }

        // Check password using BCrypt
        boolean isPasswordCorrect = checkPassword(userLogin.getPassword(), user.getPassword());
        if (!isPasswordCorrect) {
            return Map.of("message", "Incorrect password. Login unsuccessful.");
        }

        // Generate JWT token
        try {
            String token = jwtUtil.generateToken(user.getEmail());
            return Map.of("token", "Bearer " + token, "userId", user.getUserId(), "message", "Login successful.");
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return Map.of("message", "Error generating token, try again.");
        }
    }

    private boolean checkPassword(String loginPassword, String dbPassword) {
        return BCrypt.checkpw(loginPassword, dbPassword);
    }

    @Override
    public String signup(List<UserSignUp> userSignUps) {
        List<UserModel> userModels = new ArrayList<>();
        for(UserSignUp userSignUp : userSignUps) {
            String email = userSignUp.getEmail();
            String password = userSignUp.getPassword();
            String name = userSignUp.getName();
            int role = 0;
            UserModel user = userDao_.findByEmail(email);
            if (user != null) {
                return "Email "+email+" already exist, try to login.";
            }
            UserModel userModel = new UserModel();
            String id = UUID.randomUUID().toString();
            userModel.setUserId(id);
            userModel.setName(name);
            userModel.setEmail(email);
            userModel.setRole(role);
            userModel.setCreatedAt(LocalDateTime.now());
            userModel.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
            userModel.setAttendedQuizzes(new HashMap<>());

            userModels.add(userModel);
        }
        List<UserModel> response;
        try {
            response = userDao_.saveAll(userModels);
//            asyncMailService.sendWelcomeEmailAsync(userSignUps);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return "Successfull";
    }

    @Override
    public boolean updatePass(UserSignIn userLogin) {
        // Find user by email
        UserModel user = userDao_.findByEmail(userLogin.getEmail());
        if (user == null) {
            return false; // User does not exist
        }
        // Hash the new password
        String hashedPassword = BCrypt.hashpw(userLogin.getPassword(), BCrypt.gensalt());
    
        // Update and save the user
        user.setPassword(hashedPassword);
        userDao_.save(user);
        WelcomeRequest welcomeUser = new WelcomeRequest();
        welcomeUser.setName(user.getName());
        welcomeUser.setEmail(user.getEmail());
        welcomeUser.setPassword(userLogin.getPassword());
        asyncMailService.sendPasswordUpdateEmailAsync(welcomeUser);
        System.out.println("Done For User"+ user.getEmail());
        return true;
    }

    @Override
    public Map<String, Object> fetchProfile(String token) {
        if (token == null || token.isEmpty())
            return Map.of("message", "Empty JWT token");
        try {
            // Extract email from JWT token
            token = token.substring(7);
            String email = jwtUtil.getEmailFromToken(token);
            if(jwtUtil.validateToken(token, email)) {
                UserModel user = userDao_.findByEmail(email);
                UserInfo userInfo = new UserInfo(user.getUserId(), user.getName(), user.getEmail());
                return Map.of("message", "Token Authenticated", "user", userInfo);
            }else{
                return Map.of("message","Unauthorized, invalid JWT token");
            }
        } catch (Exception e) {
            return Map.of("message", "Unauthorized, invalid JWT token");
        }
    }

    @Override
    public String updateAttendedQuizzes(String userId, String quizId) {
        // Fetch the user based on userId
        UserModel user = userDao_.findById(userId).orElse(null);
        if (user == null) {
            return "User not found";
        }

        // Add quizId to the attendedQuizzes list if not already present
        Map<String, LocalDateTime> attendedQuizzes = user.getAttendedQuizzes();
        if (attendedQuizzes == null) {
            attendedQuizzes = new HashMap<>();
        }

        attendedQuizzes.put(quizId, LocalDateTime.now());
        user.setAttendedQuizzes(attendedQuizzes);
        userDao_.save(user);

        return "Quiz ID added to attended quizzes successfully";
    }
    public UserModel findByEmailCached(String email) {
        return userDao_.findByEmail(email);
    }
    
    @Override
    public List<UserInfo> getAllUsers() {
        try {
            return userDao_.findAll().stream()
                    .filter(user -> !"Group08.admin@gmail.com".equals(user.getEmail()))
                    .map(user -> {
                        UserInfo info = new UserInfo();
                        info.setUserId(user.getUserId());
                        info.setName(user.getName());
                        info.setEmail(user.getEmail());
                        return info;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public String deleteUsersByEmails(List<String> emails) {
        List<UserModel> usersToDelete = new ArrayList<>();
        List<String> notFound = new ArrayList<>();
    
        for (String email : emails) {
            if(email.equals("Group08.admin@gmail.com")) continue;
            UserModel user = userDao_.findByEmail(email);
            if (user != null) {
                usersToDelete.add(user);
            } else {
                notFound.add(email);
            }
        }
    
        if (!usersToDelete.isEmpty()) {
            userDao_.deleteAll(usersToDelete);
        }
    
        if (notFound.isEmpty()) {
            return "Users deleted successfully.";
        } else {
            return "Some users not found: " + String.join(", ", notFound);
        }
    }



    @Override
    public ResponseEntity<Boolean> isAdmin(String token){
        if (token == null || token.isEmpty())
            return new ResponseEntity<>(false, HttpStatus.UNAUTHORIZED);
        try {
            // Extract email from JWT token
            token = token.substring(7);
            String email = jwtUtil.getEmailFromToken(token);
            if(jwtUtil.validateToken(token, email)) {
                UserModel user = userDao_.findByEmail(email);
                return new ResponseEntity<>(user.getRole() == UserModel.ROLE.admin.ordinal(), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(false, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public Map<String, String> getAllUserNames(List<String> userIds) {
        try {
            Query query = new Query(Criteria.where("userId").in(userIds));
            query.fields().include("userId").include("name");
            List<Document> result = mongoTemplate_.find(query, Document.class, "users");
            Map<String, String> userIdNameMap = new HashMap<>();
            for (Document doc : result) {
                String userId = doc.getString("userId");
                String name = doc.getString("name");
                userIdNameMap.put(userId, name);
            }

            return userIdNameMap;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
