package com.quizz.user.User.Service;

import com.quizz.user.User.Model.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

public interface UserService {
    public Map<String, String> login(UserSignIn userLogin);

    public String signup(List<UserSignUp> userSignUp);

    public Map<String, Object> fetchProfile(String token);

    public String updateAttendedQuizzes(String userId, String quizId);

    public ResponseEntity<Boolean> isAdmin(String token);

    public String deleteUsersByEmails(List<String> emails);
    
    public boolean updatePass(UserSignIn userLogin);

    public List<UserInfo> getAllUsers();

    public Map<String, String> getAllUserNames(List<String> userIds);
}
