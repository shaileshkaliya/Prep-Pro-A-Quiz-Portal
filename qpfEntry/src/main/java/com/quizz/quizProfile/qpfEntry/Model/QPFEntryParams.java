package com.quizz.quizProfile.qpfEntry.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QPFEntryParams {
    private int maxScore;
    private int gainedScore;
    private int totalTime;
    private int timeSpent;
    private int totalQuestions;
    private int correctAttempted;
    private int incorrectAttempted;
    private int unAttempted;
}
