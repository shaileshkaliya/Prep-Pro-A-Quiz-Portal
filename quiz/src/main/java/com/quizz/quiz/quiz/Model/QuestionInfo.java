package com.quizz.quiz.quiz.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
public class QuestionInfo {
    private String questionId;
    private String questionContent;
    private Map<String, String> options;
    private List<String> correctOptions;
    private int questionCategory;
}