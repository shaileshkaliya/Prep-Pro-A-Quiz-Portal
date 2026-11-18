package com.quizz.user.User.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
@Document(collection = "users")
public class UserModel {
    @Id
    private String userId;
    private String name;
    private String email;
    private String password;
    private Map<String, LocalDateTime> attendedQuizzes;
    private LocalDateTime createdAt;
    private int role;

    public enum ROLE{
        admin,
        user
    };
}
