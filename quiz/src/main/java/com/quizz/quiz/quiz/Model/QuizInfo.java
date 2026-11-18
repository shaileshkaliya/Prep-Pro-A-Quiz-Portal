package com.quizz.quiz.quiz.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
public class QuizInfo {
    String quizId;
    private String title;
    private String companyName;
    private int quizTime;
    private int numQuestions;
    private int state;
}
