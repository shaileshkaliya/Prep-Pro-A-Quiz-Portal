package com.quizz.quizProfile.qpfEntry.Model;

import lombok.Data;

@Data
public class DashboardInfoDTO {
    private int totalTestsAttempted;
    private double averageScorePercentage;
    private int maxScore;
    private int totalTestTimeMins;
    private int totalQuestions;
    private int totalCorrectAnswers;
    private int totalIncorrectAnswers;
    private double percentage; // Or any other derived metric if required
    private int totalTimeSpentMins;

}
