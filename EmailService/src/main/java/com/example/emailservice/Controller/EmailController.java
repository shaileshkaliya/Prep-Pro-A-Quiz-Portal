package com.example.emailservice.Controller;

import com.example.emailservice.Model.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.emailservice.Service.EmailService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.security.SecureRandom;
import java.util.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    @Autowired
    private final EmailService emailService;

    private static final String CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int PASSWORD_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();

    private final Map<String, String> otpStorage = new HashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1); // for OTP expiry

    private static String generateOTP() {
        StringBuilder otp = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHAR_SET.length());
            otp.append(CHAR_SET.charAt(index));
        }
        return otp.toString();
    }

    @PostMapping("/send-welcome")
    public ResponseEntity<String> sendWelcomeMail(@RequestBody WelcomeRequest request) {
        System.out.println("Get Request for "+request.getEmail());
	String subject = "Welcome to PrePro Quiz";
        String body = "Hello"+ request.getName()+ ",\n\nYour account to PrePro Quiz is created.\n\n"
                    + "Your email to login is: " + request.getEmail() + "\n"
                    + "And your password is: " + request.getPassword()
                    + "\n\nTeam PrePro";

        try {
            emailService.sendEmail(request.getEmail(), subject, body);
            return ResponseEntity.ok("✅ Welcome email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("❌ Failed to send welcome email: " + e.getMessage());
        }
    }

    @PostMapping("/send-updatePass")
    public ResponseEntity<String> sendUpdatePassMail(@RequestBody WelcomeRequest request) {
        System.out.println("Get Request for "+request.getEmail());
	    String subject = "Password Updated for PrePro Quiz Platform";
        String body = "Hello"+ request.getName()+ ",\n\nYour Password for account to PrePro Quiz is Updated.\n\n"
                    + "Your email to login is: " + request.getEmail() + "\n"
                    + "And your new password is: " + request.getPassword()
                    + "\n\nTeam PrePro";
        try {
            emailService.sendEmail(request.getEmail(), subject, body);
            return ResponseEntity.ok("✅ Welcome email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("❌ Failed to send welcome email: " + e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOTP(@RequestBody OtpRequest request) {
        String email = request.getEmail();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("❗ Email must not be empty.");
        }

        String otp = generateOTP();
        otpStorage.put(email, otp);

        // Auto-clear OTP after 60 seconds
        scheduler.schedule(() -> {
            otpStorage.remove(email);
            System.out.println("OTP for " + email + " has expired and removed.");
        }, 60, TimeUnit.SECONDS);

        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("OTP sent to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required.");
        }

        if (otpStorage.containsKey(email) && otpStorage.get(email).equals(otp)) {
            otpStorage.remove(email); // clean up manually if verified
            return ResponseEntity.ok("OTP Verified Successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Invalid or Expired OTP!\n");
        }
    }
}

