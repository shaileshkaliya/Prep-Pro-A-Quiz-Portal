package com.quizz.quizProfile.qpfEntry.Model;

public record QuizUserResultDTO(
        String userId,
        String name,
        int gainedScore,
        int timeSpent,
        int maxScore,
        double percentage
) {}

