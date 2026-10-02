package com.vastra.repository;

import com.vastra.model.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends MongoRepository<OTP, String> {

    Optional<OTP> findByEmail(String email);

    void deleteByEmail(String email);
}
