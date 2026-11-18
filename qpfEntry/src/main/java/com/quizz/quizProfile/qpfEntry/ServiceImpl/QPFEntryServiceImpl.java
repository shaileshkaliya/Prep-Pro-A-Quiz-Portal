package com.quizz.quizProfile.qpfEntry.ServiceImpl;

import com.quizz.quizProfile.qpfEntry.Dao.QPFDao;
import com.quizz.quizProfile.qpfEntry.Feign.QuizFeign;
import com.quizz.quizProfile.qpfEntry.Feign.UserFeign;
import com.quizz.quizProfile.qpfEntry.Model.*;
import com.quizz.quizProfile.qpfEntry.Service.QPFEntryService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QPFEntryServiceImpl implements QPFEntryService {

    @Autowired
    private QPFDao qpfDao_;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserFeign userFeign_;

    @Autowired
    private QuizFeign quizFeign_;

    @Override
    public QPFEntry fetchByUserIdAndQuizId(String userId, String quizId) {
        UserQuizId id_ = new UserQuizId(userId,quizId);
        Optional<QPFEntry> entry;
        try {
            entry = qpfDao_.findById(id_);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return entry.orElse(null);
    }

    @Override
    public String saveQPFEntry(QPFEntryParams entry, String userId, String quizId) {
        UserQuizId id_ = new UserQuizId(userId, quizId);
        Optional<QPFEntry> existingEntry = qpfDao_.findById(id_);
        if(existingEntry.isPresent()){

            QPFEntry entryToUpdate = existingEntry.get();
            Query query = new Query(Criteria.where("_id").is(id_));
            Update update = new Update();
            update.set("gainedScore", entry.getGainedScore());
            update.set("timeSpent", entry.getTimeSpent());
            update.set("correctAttempted", entry.getCorrectAttempted());
            update.set("incorrectAttempted", entry.getIncorrectAttempted());
            update.set("unAttempted", entry.getUnAttempted());
            update.set("lastScore", entryToUpdate.getLastScore());
            update.set("lastAttemptTime", entryToUpdate.getCurrentAttemptTime());
            update.set("currentAttemptTime", LocalTime.now());

            try {
                mongoTemplate.updateFirst(query, update, QPFEntry.class);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }else{
            QPFEntry entryToSave = QPFEntry.builder()
                    .qpfEntryId(id_)
                    .maxScore(entry.getMaxScore())
                    .gainedScore(entry.getGainedScore())
                    .totalTime(entry.getTotalTime())
                    .timeSpent(entry.getTimeSpent())
                    .totalQuestions(entry.getTotalQuestions())
                    .correctAttempted(entry.getCorrectAttempted())
                    .incorrectAttempted(entry.getIncorrectAttempted())
                    .unAttempted(entry.getUnAttempted())
                    .lastScore(-1)
                    .currentAttemptTime(LocalDateTime.now())
                    .lastAttemptTime(null)
                    .build();

            try {
                qpfDao_.save(entryToSave);
//                userFeign_.updateAttendedQuizzes(userId,  quizId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return "Entry saved successfully";
    }

    @Override
    public Map<String, Object> getDashboarData(String userId) {
        Map<String, Object> dashboardData = new HashMap<>();

        // 1️⃣ Aggregation for overall stats
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id.userId").is(userId)),
                Aggregation.group("_id.userId")
                        .count().as("totalTestsAttempted")
                        .avg("gainedScore").as("averageScorePercentage")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, QPFEntry.class, Map.class);

        if (!results.getMappedResults().isEmpty()) {
            Map<String, Object> aggResult = results.getMappedResults().get(0);
            dashboardData.put("totalTestsAttempted", aggResult.getOrDefault("totalTestsAttempted", 0));
            dashboardData.put("averageScorePercentage", aggResult.getOrDefault("averageScorePercentage", 0.0));
        } else {
            dashboardData.put("totalTestsAttempted", 0);
            dashboardData.put("averageScorePercentage", 0.0);
        }

        // 2️⃣ Latest quiz attempt (sorted by currentAttemptTime DESC)
        Query query = new Query();
        query.addCriteria(Criteria.where("_id.userId").is(userId));
        query.with(Sort.by(Sort.Direction.DESC, "currentAttemptTime"));
        query.limit(1);

        QPFEntry latestQuiz = mongoTemplate.findOne(query, QPFEntry.class);

        if (latestQuiz != null) {
            dashboardData.put("maxScore", latestQuiz.getMaxScore());
            dashboardData.put("totalTestTimeMins", latestQuiz.getTotalTime() / 60);
            dashboardData.put("totalQuestions", latestQuiz.getTotalQuestions());
            dashboardData.put("yourScore", latestQuiz.getGainedScore());
            dashboardData.put("timeSpentMins", latestQuiz.getTimeSpent() / 60);
            dashboardData.put("correctAnswers", latestQuiz.getCorrectAttempted());
            dashboardData.put("incorrectAnswers", latestQuiz.getIncorrectAttempted());

            double percentage = latestQuiz.getTotalQuestions() > 0
                    ? ((double) latestQuiz.getCorrectAttempted() / latestQuiz.getTotalQuestions()) * 100
                    : 0.0;
            dashboardData.put("percentage", percentage);
        } else {
            // Default values if no quiz found
            dashboardData.put("maxScore", 0);
            dashboardData.put("totalTestTimeMins", 0);
            dashboardData.put("totalQuestions", 0);
            dashboardData.put("yourScore", 0);
            dashboardData.put("timeSpentMins", 0);
            dashboardData.put("correctAnswers", 0);
            dashboardData.put("incorrectAnswers", 0);
            dashboardData.put("percentage", 0.0);
        }

        return dashboardData;
    }

    @Override
    public Map<String, Object> getResultsOverview(List<QPFEntry.QuizSummaryDTO> quizList) {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            for (QPFEntry.QuizSummaryDTO quizSummary : quizList) {
                String quizId = quizSummary.quizId();
                String title = quizSummary.title();

                List<QPFEntry> entries = qpfDao_.findAllByQpfEntryId_QuizId(quizId);

                int totalAttempts = entries.size();
                double averageScore = entries.stream()
                        .mapToInt(QPFEntry::getGainedScore)
                        .average()
                        .orElse(0.0);
                int maxScore = entries.stream()
                        .mapToInt(QPFEntry::getGainedScore)
                        .max()
                        .orElse(0);

                Map<String, Object> quizStats = new HashMap<>();
                quizStats.put("title", title);
                quizStats.put("totalAttempts", totalAttempts);
                quizStats.put("averageScore", averageScore);
                quizStats.put("maxScore", maxScore);

                resultMap.put(quizId, quizStats);
            }
        } catch (Exception e) {
            // Optional: Log the error if you have a logger
            System.err.println("Error while processing quiz results overview: " + e.getMessage());
            e.printStackTrace(); // Or use a logger

            throw new RuntimeException("Failed to fetch quiz results overview", e);
        }

        return resultMap;
    }

    @Override
    public List<QuizUserResultDTO> getQuizResults(String quizId, String token) {
        try {
            List<QPFEntry> entries = qpfDao_.findAllByQpfEntryId_QuizId(quizId);

            // 2. Extract unique userIds
            List<String> userIds = entries.stream()
                    .map(entry -> entry.getQpfEntryId().getUserId())
                    .distinct()
                    .toList();

            // 3. Fetch user names via Feign
            Map<String, String> userIdToNameMap = userFeign_.getUserNames(userIds, token).getBody();

            // 4. Build DTO list
            return entries.stream()
                    .map(entry -> {
                        String userId = entry.getQpfEntryId().getUserId();
                        String name = userIdToNameMap.getOrDefault(userId, "Unknown");
                        int gainedScore = entry.getGainedScore();
                        int timeSpent = entry.getTimeSpent();
                        int maxScore = entry.getMaxScore();
                        double percentage = maxScore != 0 ? (gainedScore * 100.0) / maxScore : 0.0;

                        return new QuizUserResultDTO(userId, name, gainedScore, timeSpent, maxScore, percentage);
                    })
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<UserQuizzesInfo> getAllQuizzesForUser(String token, String userId) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("_id.userId").is(userId));
            query.fields().include("_id.quizId");

            List<Document> results = mongoTemplate.find(query, Document.class, "qpfentry");

            List<String> quizIds = results.stream()
                    .map(doc -> ((Document) doc.get("_id")).getString("quizId"))
                    .toList();

            List<QPFEntry.QuizSummaryDTO> res = quizFeign_.getQuizInfoByQuizIds(token, quizIds).getBody();

            List<QPFEntry> entries = qpfDao_.findAllByQpfEntryId_UserId(userId);

            Map<String, QPFEntry> map = new HashMap<>();
            for(QPFEntry entry : entries) {
                map.put(entry.getQpfEntryId().getQuizId(), entry);
            }
            List<UserQuizzesInfo> response = new ArrayList<>();
            for(QPFEntry.QuizSummaryDTO r : res) {
                QPFEntry entry_ = map.get(r.quizId());
                UserQuizzesInfo info = new UserQuizzesInfo(userId, r.quizId(), r.title(), new QPFEntryParams(entry_.getMaxScore(),
                        entry_.getGainedScore(), entry_.getTotalTime(), entry_.getTimeSpent(), entry_.getTotalQuestions(),
                        entry_.getCorrectAttempted(), entry_.getIncorrectAttempted(), entry_.getUnAttempted()));

                response.add(info);
            }

            return response;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



}
