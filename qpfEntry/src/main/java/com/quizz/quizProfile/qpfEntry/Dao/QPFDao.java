package com.quizz.quizProfile.qpfEntry.Dao;

import com.quizz.quizProfile.qpfEntry.Model.QPFEntry;
import com.quizz.quizProfile.qpfEntry.Model.UserQuizId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QPFDao extends MongoRepository<QPFEntry, UserQuizId> {
    List<QPFEntry> findAllByQpfEntryId_QuizId(String quizId);
    List<QPFEntry> findAllByQpfEntryId_UserId(String userId);
}
