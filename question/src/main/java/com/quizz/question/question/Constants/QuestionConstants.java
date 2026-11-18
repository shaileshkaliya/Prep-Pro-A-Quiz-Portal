package com.quizz.question.question.Constants;

public class QuestionConstants {

    public enum QuestionCategory {
        SINGLE_CHOICE_QUESTION(1),
        MULTIPLE_CHOICE_QUESTION(2);

        private final int value;  // Field to store the custom value

        // Constructor to assign the custom value
        QuestionCategory(int value) {
            this.value = value;
        }

        // Getter to retrieve the custom value
        public int getValue() {
            return value;
        }
    }

}
