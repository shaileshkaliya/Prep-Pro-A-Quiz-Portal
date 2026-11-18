package com.quizz.quiz.quiz.Service;

import com.quizz.quiz.quiz.Model.QuizInfo;
import com.quizz.quiz.quiz.Model.QuizModel;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface QuizService {

    public record QuizSummaryDTO(String quizId, String title) {};

    public QuizInfo createQuiz(QuizModel quiz);

    public List<QuizInfo> getALlQuizzesByCompanyName(String companyName, boolean isAdmin);

    public QuizInfo getQuizById(String quizId, boolean isAdmin);

    public Map<String, Object> getAllCompanyNames();

    public String changeState(String quizId, int state);

    public boolean isInDraftState(String quizId);

    public Map<String, Object> getAllQuizzesCount();

    public List<QuizInfo> getAllQuizzes();

    public List<QuizSummaryDTO> getAllActiveQuizzes();

    public ResponseEntity<String> deleteQuiz(String quizId);

    public List<QuizSummaryDTO> getQuizzesInfoByQuizIds(List<String> quizIds);
}
