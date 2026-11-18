package com.quizz.quiz.quiz.DAO;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.quizz.quiz.quiz.Model.QuizModel;

@Repository
public interface QuizDao extends MongoRepository<QuizModel,String> {
    List<QuizModel> findAllByCompanyName(String companyName);
    List<QuizModel> findAllByState(int state);
    List<QuizModel> findAllByCompanyNameAndState(String companyName, int state);
    Optional<QuizModel> findByQuizIdAndState(String quizId, int state);
    long countByState(int state);
}