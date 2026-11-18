package com.quizz.quiz.quiz.ServiceImpl;

import com.quizz.quiz.quiz.DAO.QuizDao;
import com.quizz.quiz.quiz.Model.QuizInfo;
import com.quizz.quiz.quiz.Model.QuizModel;
import com.quizz.quiz.quiz.Service.QuizService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizDao quizDao_;

    @Autowired
    public QuizServiceImpl(QuizDao quizDao_) {
        this.quizDao_ = quizDao_;
    }

    @Autowired
    private MongoTemplate mongoTemplate;


    @Override
    public QuizInfo createQuiz(QuizModel quiz) {

        // save the data to db
        quizDao_.save(quiz);
        QuizInfo quizInfo = new QuizInfo();
        quizInfo.setQuizId(quiz.getQuizId());
        quizInfo.setTitle(quiz.getTitle());
        quizInfo.setCompanyName((quiz.getCompanyName()));
        quizInfo.setState(quiz.getState());

        return quizInfo;
    }

    @Override
    public Map<String, Object> getAllCompanyNames() {
        Map<String, Object> response = new HashMap<>();
        try {
            Query query = new Query();
            query.fields().include("companyName"); // Project only companyName

            List<QuizModel> result = mongoTemplate.find(query, QuizModel.class);

            Set<String> companyNames = result.stream()
                    .map(QuizModel::getCompanyName)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            response.put("companyNames", companyNames);
        } catch (Exception e) {
            response.clear(); // Clear any partial data
            response.put("message", "Error occurred while fetching company names: " + e.getMessage());
        }
        return response;
    }

    @Override
    public List<QuizInfo> getALlQuizzesByCompanyName(String companyName, boolean isAdmin) {

        // get all quizzes from db
        List<QuizModel> quizList;
        quizList = isAdmin ? quizDao_.findAllByCompanyName(companyName) : quizDao_.findAllByCompanyNameAndState(companyName, QuizModel.QuizState.ACTIVE.ordinal());

        List<QuizInfo> quizzes = new ArrayList<>();
        for (QuizModel quiz : quizList) {
            quizzes.add(new QuizInfo(quiz.getQuizId(), quiz.getTitle(), quiz.getCompanyName(), quiz.getQuizTime(), quiz.getNumQuestions(), quiz.getState()));
        }

        return quizzes;
    }

    @Override
    public QuizInfo getQuizById(String quizId, boolean isAdmin) {

        // get required quiz from db
        Optional<QuizModel> quiz_ = isAdmin ? quizDao_.findById(quizId) : quizDao_.findByQuizIdAndState(quizId, QuizModel.QuizState.ACTIVE.ordinal());
        QuizInfo quiz;
        if (quiz_.isPresent()) {
            quiz = new QuizInfo();
            quiz.setQuizId(quiz_.get().getQuizId());
            quiz.setTitle(quiz_.get().getTitle());
            quiz.setCompanyName(quiz_.get().getCompanyName());
            quiz.setState(quiz.getState());
        } else {
            quiz = null;
        }
        return quiz;
    }

    @Override
    public String changeState(String quizId, int state){
        Optional<QuizModel> quiz_ = quizDao_.findById(quizId);
        if (quiz_.isPresent()) {
            if(quiz_.get().getState() != state){
                quiz_.get().setState(state);
            }
            QuizModel response = quizDao_.save(quiz_.get());
            return "Quiz state changed successfully";
        } else {
            return "Failed to update state of quiz";
        }
    }

    @Override
    public boolean isInDraftState(String quizId){
        Optional<QuizModel> quiz_ = quizDao_.findById(quizId);
        return quiz_.filter(quizModel -> quizModel.getState() == QuizModel.QuizState.DRAFT.ordinal()).isPresent();
    }

    @Override
    public Map<String, Object> getAllQuizzesCount() {
        try {
            long activeCount = quizDao_.countByState(QuizModel.QuizState.ACTIVE.ordinal());
            long draftCount = quizDao_.countByState(QuizModel.QuizState.DRAFT.ordinal());
            return Map.of("totalTests", activeCount + draftCount, "activeTests", activeCount);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<QuizInfo> getAllQuizzes() {
        try {
            return quizDao_.findAll().stream()
                    .map(quiz -> new QuizInfo(quiz.getQuizId(), quiz.getTitle(), quiz.getCompanyName(), quiz.getQuizTime(), quiz.getNumQuestions(), quiz.getState()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<QuizSummaryDTO> getAllActiveQuizzes() {
        try {
//            List<QuizSummaryDTO> response = new ArrayList<>();
            return quizDao_.findAllByState(QuizModel.QuizState.ACTIVE.ordinal()).stream()
                    .map(quiz -> new QuizSummaryDTO(quiz.getQuizId(), quiz.getTitle()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<String> deleteQuiz(String quizId){
        try {
            quizDao_.deleteById(quizId);
            return new ResponseEntity("Deleted quiz successfully ! ", HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<QuizSummaryDTO> getQuizzesInfoByQuizIds(List<String> quizIds) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("_id").in(quizIds));
            query.fields().include("_id").include("title");

            List<Document> docs = mongoTemplate.find(query, Document.class, "quizzes");
            return docs.stream()
                    .map(doc -> new QuizSummaryDTO(doc.getString("_id"), doc.getString("title")))
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
