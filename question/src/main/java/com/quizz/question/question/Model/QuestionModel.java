package com.quizz.question.question.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
@Document(collection = "questions")
public class QuestionModel {
    @Id
    private String questionId;
    private String quizId;
    private int questionCategory;
    private String questionContent;
    private Map<String, String> options;
    private List<String> correctOptions;
    private LocalDateTime createdAt;
    private String createdBy;
}
