package com.quizz.quiz.quiz.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
@Document(collection = "quizzes")
public class QuizModel {

    public enum QuizState{
        DRAFT,
        ACTIVE,
    };

    @Id
    private String quizId;
    private String title;
    private String companyName;
    private int quizTime;
    private int numQuestions;
    private LocalDateTime createdAt;
    private String createdBy;
    private int state = QuizState.DRAFT.ordinal();
}
