package com.quizz.user.User.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import com.quizz.user.User.Model.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "EMAILSERVICE", contextId = "userFeignForQuiz") // ❗️No 'url' needed if you're using Eureka
public interface EmailFeign {
    @PostMapping("/email/send-welcome")
    public ResponseEntity<String> sendWelcomeMail(@RequestBody WelcomeRequest request);
    @PostMapping("/email/send-updatePass")
    public ResponseEntity<String> sendUpdatePassMail(@RequestBody WelcomeRequest request);    
}
