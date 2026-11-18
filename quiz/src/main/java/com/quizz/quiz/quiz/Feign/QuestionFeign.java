package com.quizz.quiz.quiz.Feign;

import com.quizz.quiz.quiz.Model.QuestionInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "QUESTION-SERVICE", url = "http://localhost:8082")
public interface QuestionFeign {

    @GetMapping("questions/getQuestionsByQuizId/{quizId}")
    public ResponseEntity<List<QuestionInfo>> getAllQuestionsByQuizId(@PathVariable String quizId, @RequestHeader("jwtToken") String token);

    @DeleteMapping("questions/deleteByQuizId/{quizId}")
    public ResponseEntity<String> deleteAllQuestionsByQuizId(@PathVariable String quizId, @RequestHeader ("jwtToken") String token);
}
