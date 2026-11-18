package com.quizz.question.question.Dao;

import com.quizz.question.question.Model.QuestionModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDao extends MongoRepository<QuestionModel,String> {
    List<QuestionModel> findByQuizId(String quizId);
    void deleteByQuizId(String quizId);
}
