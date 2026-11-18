package com.quizz.quizProfile.qpfEntry.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "qpfentry")
public class QPFEntry {

    public record QuizSummaryDTO(String quizId, String title) {}


    @Id
    private UserQuizId qpfEntryId;

    private int maxScore;
    private int gainedScore;
    private int totalTime;
    private int timeSpent;
    private int totalQuestions;
    private int correctAttempted;
    private int incorrectAttempted;
    private int unAttempted;
    private int lastScore;
    private LocalDateTime  currentAttemptTime;
    private LocalDateTime lastAttemptTime;
}
