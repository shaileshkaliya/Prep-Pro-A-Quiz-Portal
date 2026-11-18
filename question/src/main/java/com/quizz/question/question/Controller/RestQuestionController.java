package com.quizz.question.question.Controller;

import com.quizz.question.question.Dao.QuestionDao;
import com.quizz.question.question.Feign.UserFeignForQuestion;
import com.quizz.question.question.Model.QuestionInfo;
import com.quizz.question.question.Model.QuestionModel;
import com.quizz.question.question.Model.QuestionParams;
import com.quizz.question.question.Service.QuestionService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("questions")
public class RestQuestionController {

    @Autowired
    private QuestionService questionService_;
    @Autowired
    private UserFeignForQuestion userFeign;

    @PostMapping("create/{quizId}")
    public ResponseEntity<String> createQuiz(@RequestBody List<QuestionParams> params, @PathVariable String quizId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) && Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            List<QuestionModel> questions = new ArrayList<>();
            for (QuestionParams param : params) {
                QuestionModel question = new QuestionModel();
                String id = UUID.randomUUID().toString();
                question.setQuestionId(id);
                question.setQuestionContent(param.getQuestionContent());
                question.setQuestionCategory(param.getQuestionCategory());
                question.setQuizId(quizId);
                question.setOptions(param.getOptions());
                question.setCorrectOptions(param.getCorrectOptions());
                question.setCreatedAt(LocalDateTime.now());
                question.setCreatedBy("ADMIN");

                questions.add(question);
            }

            String response = questionService_.createQuestion(questions);

            if (!response.equals("Questions saved successfully")) {
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }
    @PostMapping("/bulk-add")
    public ResponseEntity<List<QuestionInfo>> bulkAddQuestions(@RequestParam("file") MultipartFile file, @RequestHeader("jwtToken") String token
                                                   ) throws IOException {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) &&
                Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {

            List<QuestionInfo> questions = new ArrayList<>();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                String line;
                boolean isFirstLine = true;

                while ((line = reader.readLine()) != null) {
                    if (isFirstLine) { // Skip the header row
                        isFirstLine = false;
                        continue;
                    }
                    String[] values = line.split(",");

                    if (values.length != 7) {
                        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
                    }

                    QuestionInfo question = new QuestionInfo();
                    question.setQuestionId(UUID.randomUUID().toString());
                    question.setQuestionContent(values[0].trim());

                    // Creating options map
                    Map<String, String> options = new HashMap<>();
                    options.put("A", values[1].trim());
                    options.put("B", values[2].trim());
                    options.put("C", values[3].trim());
                    options.put("D", values[4].trim());
                    question.setOptions(options);

                    // Convert correctOptions from "AB" -> ["A", "B"]
                    List<String> correctOptions = values[5].trim()
                            .chars()
                            .mapToObj(c -> String.valueOf((char) c))
                            .collect(Collectors.toList());
                    question.setCorrectOptions(correctOptions);
                    String val = values[6].trim(); // Example of problematic input
                    val = val.replaceAll("[^0-9]", ""); // Remove any non-numeric characters
                    int value = Integer.parseInt(val);

                    question.setQuestionCategory(value);

                    questions.add(question);
                }

                return new ResponseEntity<>(questions, HttpStatus.CREATED);
            } catch (IOException e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }


    @GetMapping("getQuestionsByQuizId/{quizId}")
    public ResponseEntity<List<QuestionInfo>> getAllQuestionsByQuizId(@PathVariable String quizId, @RequestHeader("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody())) {
            List<QuestionInfo> questions = questionService_.getAllQuestionsByQuizId(quizId);
            if (questions.isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(questions, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("deleteByQuizId/{quizId}")
    public ResponseEntity<String> deleteAllQuestionsByQuizId(@PathVariable String quizId, @RequestHeader ("jwtToken") String token) {
        if (Boolean.TRUE.equals(userFeign.verifyToken(token).getBody()) &&
                Boolean.TRUE.equals(userFeign.isLoggedInUserAdmin(token).getBody())) {
            try {
                return questionService_.deleteByQuizId(quizId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return new ResponseEntity<>("User should be authenticated admin.", HttpStatus.UNAUTHORIZED);
    }

}
