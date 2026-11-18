package com.quizz.quiz.quiz.Controller;

import com.quizz.quiz.quiz.Feign.QuestionFeign;
import com.quizz.quiz.quiz.Feign.UserFeign;
import com.quizz.quiz.quiz.Model.*;
import com.quizz.quiz.quiz.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("quiz")

public class RestQuizController {

    @Autowired
    private QuizService quizService_;
    @Autowired
    private QuestionFeign questionFeign_;
    @Autowired
    private UserFeign userFeign;

    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestBody QuizParams params, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            QuizModel quiz = new QuizModel();
            String id = UUID.randomUUID().toString();
            quiz.setQuizId(id);
            quiz.setCompanyName(params.getCompanyName().toLowerCase());
            quiz.setTitle(params.getTitle().toLowerCase());
            quiz.setQuizTime(params.getQuizTime());
            quiz.setCreatedAt(LocalDateTime.now());
            quiz.setNumQuestions(params.getNumQuestions());
            quiz.setCreatedBy("ADMIN");
            quiz.setState(QuizModel.QuizState.DRAFT.ordinal());

            quizService_.createQuiz(quiz);
            return new ResponseEntity<>(id, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);

    }

    @GetMapping("companies")
    public ResponseEntity<Map<String, Object>> getAllCompanyNames(@RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            Map<String, Object> response = quizService_.getAllCompanyNames();

            if (response.containsKey("message")) {
                // Error occurred during fetch
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            if (response.get("companyNames") == null || ((Set<?>) response.get("companyNames")).isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        // Unauthorized access
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("getAllQuizzesByCompanyName/{companyName}")
    public ResponseEntity<List<QuizInfo>> getALlQuizzesByCompanyName(@PathVariable String companyName, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            boolean isAdmin = Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody());
            List<QuizInfo> quizList = quizService_.getALlQuizzesByCompanyName(companyName.toLowerCase(), isAdmin);

            // Handling no quiz present of demanded company
            if (quizList.isEmpty()) {
                return new ResponseEntity<>(quizList, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(quizList, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("getAllQuizzes")
    public ResponseEntity<List<QuizInfo>> getAllQuizzes(@RequestHeader("jwtToken") String token) {
        try {
            Boolean isValid = userFeign.verifyToken(token).getBody();
            Boolean isAdmin = userFeign.isLoggedInUserAdmin(token).getBody();

            if (Boolean.TRUE.equals(isValid) && Boolean.TRUE.equals(isAdmin)) {
                List<QuizInfo> quizList = quizService_.getAllQuizzes();

                // If quiz list is empty
                if (quizList.isEmpty()) {
                    return new ResponseEntity<>(quizList, HttpStatus.NO_CONTENT); // ✅ Still returns an empty array
                }

                return new ResponseEntity<>(quizList, HttpStatus.OK);
            }

            // ✅ Proper unauthorized response with empty array instead of null
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("getAllActiveQuizzes")
    public ResponseEntity<List<QuizService.QuizSummaryDTO>> getAllActiveQuizzes(@RequestHeader("jwtToken") String token) {
        try {
            Boolean isValid = userFeign.verifyToken(token).getBody();
            Boolean isAdmin = userFeign.isLoggedInUserAdmin(token).getBody();

            if (Boolean.TRUE.equals(isValid) && Boolean.TRUE.equals(isAdmin)) {
                List<QuizService.QuizSummaryDTO> quizList = quizService_.getAllActiveQuizzes();

                // If quiz list is empty
                if (quizList.isEmpty()) {
                    return new ResponseEntity<>(quizList, HttpStatus.NO_CONTENT); // ✅ Still returns an empty array
                }

                return new ResponseEntity<>(quizList, HttpStatus.OK);
            }

            // ✅ Proper unauthorized response with empty array instead of null
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("getQuiz/{quizId}")
    public ResponseEntity<List<QuestionInfo>> getQuizById(@PathVariable String quizId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            boolean isAdmin = Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody());
            List<QuestionInfo> questions = questionFeign_.getAllQuestionsByQuizId(quizId, token).getBody();

            // handling if no quiz is present case
            if (questions == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(questions, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/activate/{quizId}")
    public ResponseEntity<String> activateQuiz(@PathVariable String quizId, @RequestHeader("jwtToken") String token){
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            String resMessage = quizService_.changeState(quizId, QuizModel.QuizState.ACTIVE.ordinal());
            return new ResponseEntity<>(resMessage, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("User should be authenticated admin.", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{quizId}/state/draft")
    public ResponseEntity<String> quizInDrafState(@PathVariable String quizId, @RequestHeader("jwtToken") String token){
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            boolean resMessage = quizService_.isInDraftState(quizId);
            return new ResponseEntity<>(resMessage+"", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("User should be authenticated admin.", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/quizCount")
    public ResponseEntity<Map<String, Object>> getQuizCount(@RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            Map<String, Object> response  = quizService_.getAllQuizzesCount();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("message", "User should be authenticated admin."), HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable String quizId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            ResponseEntity<String> response = quizService_.deleteQuiz(quizId);
            if(response.getStatusCode() == HttpStatus.OK) {
                ResponseEntity<String> questionDeletionResponse = questionFeign_.deleteAllQuestionsByQuizId(quizId, token);
                if(questionDeletionResponse.getStatusCode() == HttpStatus.OK) {
                    return new ResponseEntity<>("Deleted quiz successfully !", HttpStatus.OK);
                }
            }
            return new ResponseEntity<>("Failed to delete quiz", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("User should be authenticated admin", HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/quizInfoByQuizIds")
    public ResponseEntity<List<QuizService.QuizSummaryDTO>> getQuizInfoByQuizIds(@RequestHeader("jwtToken") String token, @RequestBody List<String> quizIds){
        if(Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            return new ResponseEntity<>(quizService_.getQuizzesInfoByQuizIds(quizIds), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }
}
