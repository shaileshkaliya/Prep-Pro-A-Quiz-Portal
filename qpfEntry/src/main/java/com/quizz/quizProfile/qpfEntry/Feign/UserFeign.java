package com.quizz.quizProfile.qpfEntry.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "USER-SERVICE", contextId = "userFeignForQpfEntry")
public interface UserFeign {
    @GetMapping("/user/verifyToken")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("jwtToken") String token);

    @GetMapping("/user/isAdmin")
    public ResponseEntity<Boolean> isLoggedInUserAdmin(@RequestHeader("jwtToken") String token);

    @PostMapping("/user/{userId}/attended-quiz/{quizId}")
    public ResponseEntity<String> updateAttendedQuizzes(
            @PathVariable String userId, @PathVariable String quizId);

    @PostMapping("/user/userNames")
    public ResponseEntity<Map<String, String>> getUserNames(@RequestBody List<String> userIds, @RequestHeader("jwtToken") String token);
}
