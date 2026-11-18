package com.quizz.question.question.Service;

import com.quizz.question.question.Model.QuestionInfo;
import com.quizz.question.question.Model.QuestionModel;
import jakarta.ws.rs.core.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface QuestionService {
    public String createQuestion(List<QuestionModel> questions);

    public List<QuestionInfo> getAllQuestionsByQuizId(String quizId);

    public ResponseEntity<String> deleteByQuizId(String quizId);

}
