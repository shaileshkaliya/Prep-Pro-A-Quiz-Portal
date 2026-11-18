package com.quizz.quizProfile.qpfEntry.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserQuizzesInfo {
    String userId;
    String quizId;
    String quizTitle;
    QPFEntryParams params;
}
