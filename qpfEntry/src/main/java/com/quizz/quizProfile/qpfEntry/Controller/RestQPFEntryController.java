package com.quizz.quizProfile.qpfEntry.Controller;

import com.quizz.quizProfile.qpfEntry.Feign.QuizFeign;
import com.quizz.quizProfile.qpfEntry.Feign.UserFeign;
import com.quizz.quizProfile.qpfEntry.Model.*;
import com.quizz.quizProfile.qpfEntry.ServiceImpl.QPFEntryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("quizProfile")
public class RestQPFEntryController {

    @Autowired
    private QPFEntryServiceImpl qpfService_;
    @Autowired
    private UserFeign userFeign;
    @Autowired
    private QuizFeign quizFeign_;


    @PostMapping("/user/{userId}/quiz/{quizId}/save")
    public ResponseEntity<String> saveQPFEntry(@RequestBody QPFEntryParams entryParams, @PathVariable String userId, @PathVariable String quizId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            String response = qpfService_.saveQPFEntry(entryParams, userId, quizId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/user/{userId}/quiz/{quizId}")
    public ResponseEntity<QPFEntry> getQPFEntry(@PathVariable String userId, @PathVariable String quizId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            QPFEntry response = qpfService_.fetchByUserIdAndQuizId(userId, quizId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/user/{userId}/getDashboardInfo")
    public ResponseEntity<Map<String, Object>> getLatestQuizInfoAndTotalQuizCount(@PathVariable String userId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            // Fetch aggregated dashboard data directly from the service
            Map<String, Object> dashboardInfo = qpfService_.getDashboarData(userId);

            if (dashboardInfo == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Return 204 if no data
            }

            return new ResponseEntity<>(dashboardInfo, HttpStatus.OK);
        }

        // If token verification fails
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("resultsOverview")
    public ResponseEntity<Map<String, Object>> getResultsOverview(@RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            List<QPFEntry.QuizSummaryDTO> quizList = quizFeign_.getAllActiveQuizzes(token).getBody();
            Map<String, Object> res = qpfService_.getResultsOverview(quizList);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(Map.of("message", "User should be authenticated admin."), HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("{quizId}/results")
    public ResponseEntity<List<QuizUserResultDTO>> getResultsForQuiz(@PathVariable String quizId, @RequestHeader("jwtToken") String token){
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            return new ResponseEntity<>(qpfService_.getQuizResults(quizId, token), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("{userId}/quizzes/results")
    public ResponseEntity<List<UserQuizzesInfo>> getUserAttemptedQuizzes(@RequestHeader("jwtToken") String token, @PathVariable String userId){
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())){
            return new ResponseEntity<>(qpfService_.getAllQuizzesForUser(token, userId), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

}
