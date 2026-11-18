package com.quizz.quizProfile.qpfEntry.Model;

import java.io.Serializable;
import java.util.Objects;

public class UserQuizId implements Serializable {
    private String userId;
    private String quizId;

    // Default constructor
    public UserQuizId() {}

    public UserQuizId(String userId, String quizId) {
        this.userId = userId;
        this.quizId = quizId;
    }

    // Getters & Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }

    // equals() and hashCode() are important for MongoDB _id uniqueness
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserQuizId)) return false;
        UserQuizId that = (UserQuizId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(quizId, that.quizId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, quizId);
    }
}

