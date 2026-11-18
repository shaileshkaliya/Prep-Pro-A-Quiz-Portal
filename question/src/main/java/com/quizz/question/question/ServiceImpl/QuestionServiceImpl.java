package com.quizz.question.question.ServiceImpl;

import com.quizz.question.question.Dao.QuestionDao;
import com.quizz.question.question.Model.QuestionInfo;
import com.quizz.question.question.Model.QuestionModel;
import com.quizz.question.question.Service.QuestionService;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionDao questionDao_;

    @Override
    public String createQuestion(List<QuestionModel> questions) {
        List<QuestionModel> savedQuestions = questionDao_.saveAll(questions);
        return !savedQuestions.isEmpty() ? "Questions saved successfully" : "Questions not saved, error occured";
    }

    @Override
    public List<QuestionInfo> getAllQuestionsByQuizId(String quizId) {
        List<QuestionModel> questions = questionDao_.findByQuizId(quizId);
        List<QuestionInfo> questionInfos = new ArrayList<>();
        for(QuestionModel question : questions) {
            QuestionInfo newQuestionInfo = new QuestionInfo();
            newQuestionInfo.setQuestionId(question.getQuestionId());
            newQuestionInfo.setQuestionCategory(question.getQuestionCategory());
            newQuestionInfo.setQuestionContent(question.getQuestionContent());
            newQuestionInfo.setOptions(question.getOptions());
            newQuestionInfo.setCorrectOptions(question.getCorrectOptions());

            questionInfos.add(newQuestionInfo);
        }
        return questionInfos;
    }

    @Override
    public ResponseEntity<String> deleteByQuizId(String quizId) {
        try{
            questionDao_.deleteByQuizId(quizId);
            return new ResponseEntity("Deleted all question associated with given quizId.", HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
