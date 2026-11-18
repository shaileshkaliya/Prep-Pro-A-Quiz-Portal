package com.quizz.question.question.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "USER-SERVICE", contextId = "userFeignForQuestion")
public interface UserFeignForQuestion {
    @GetMapping("/user/verifyToken")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("jwtToken") String token);

    @GetMapping("/user/isAdmin")
    public ResponseEntity<Boolean> isLoggedInUserAdmin(@RequestHeader("jwtToken") String token);
}
