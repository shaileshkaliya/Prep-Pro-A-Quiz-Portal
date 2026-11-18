package com.quizz.quizProfile.qpfEntry.Service;

import com.quizz.quizProfile.qpfEntry.Model.*;

import java.util.List;
import java.util.Map;

public interface QPFEntryService {
    public QPFEntry fetchByUserIdAndQuizId(String userId, String quizId);
    public String saveQPFEntry(QPFEntryParams entry, String userId, String quizId);
    public Map<String, Object> getDashboarData(String userId);
    public Map<String, Object> getResultsOverview(List<QPFEntry.QuizSummaryDTO> quizList);
    public List<QuizUserResultDTO> getQuizResults(String quizId, String token);
    public List<UserQuizzesInfo> getAllQuizzesForUser(String token, String userId);
}
