package com.quizz.user.User.Dao;

import com.quizz.user.User.Model.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao extends MongoRepository<UserModel,String> {
    UserModel findByEmail(String email);
}
