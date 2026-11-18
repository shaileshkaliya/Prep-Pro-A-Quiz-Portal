package com.quizz.user.User.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "QUIZ-SERVICE", url = "http://localhost:8081")
public interface QuizFeignForUser {

    @GetMapping("/quiz/quizCount")
    public ResponseEntity<Map<String, Object>> getQuizCount(@RequestHeader("jwtToken") String token);

}
