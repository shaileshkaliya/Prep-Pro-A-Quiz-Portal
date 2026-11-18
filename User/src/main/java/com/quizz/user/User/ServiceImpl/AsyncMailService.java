package com.quizz.user.User.ServiceImpl;

import com.quizz.user.User.Feign.EmailFeign;
import com.quizz.user.User.Model.WelcomeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;
import com.quizz.user.User.Model.UserSignUp;

@Service
public class AsyncMailService {

    @Autowired
    private EmailFeign emailFeign;

    @Async
    public void sendWelcomeEmailAsync(List<UserSignUp> requests) {
        try {
            for (UserSignUp request : requests){
                WelcomeRequest welcomeUser = new WelcomeRequest();
                welcomeUser.setName(request.getName());
                welcomeUser.setEmail(request.getEmail());
                welcomeUser.setPassword(request.getPassword());
                emailFeign.sendWelcomeMail(welcomeUser);
	        }
        } catch (Exception e) {
            System.err.println("❌ Error sending welcome email " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordUpdateEmailAsync(WelcomeRequest request) {
        try {
            emailFeign.sendUpdatePassMail(request);
            System.out.println("✅ Password update email sent to " + request.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Error sending password update email to " + request.getEmail() + ": " + e.getMessage());
        }
    }
}
