package com.quizz.quizProfile.qpfEntry.Feign;

import com.quizz.quizProfile.qpfEntry.Model.QPFEntry;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "QUIZ-SERVICE", contextId = "quizFeign") // ❗️No 'url' needed if you're using Eureka
public interface QuizFeign {
    @GetMapping("quiz/getAllActiveQuizzes")
    public ResponseEntity<List<QPFEntry.QuizSummaryDTO>> getAllActiveQuizzes(@RequestHeader("jwtToken") String token);

    @PostMapping("/quiz/quizInfoByQuizIds")
    public ResponseEntity<List<QPFEntry.QuizSummaryDTO>> getQuizInfoByQuizIds(@RequestHeader("jwtToken") String token, @RequestBody List<String> quizIds);
}
