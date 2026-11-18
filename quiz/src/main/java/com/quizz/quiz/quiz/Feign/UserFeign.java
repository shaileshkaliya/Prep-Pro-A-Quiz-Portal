package com.quizz.quiz.quiz.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "USER-SERVICE", url = "http://localhost:8083")
public interface UserFeign {
    @GetMapping("/user/verifyToken")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("jwtToken") String token);

    @GetMapping("/user/isAdmin")
    public ResponseEntity<Boolean> isLoggedInUserAdmin(@RequestHeader("jwtToken") String token);
}