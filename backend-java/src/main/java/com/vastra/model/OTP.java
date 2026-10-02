package com.vastra.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Date;

@Document(collection = "otps")
public class OTP {

    @Id
    private String id;

    @Indexed
    private String email;

    private String otp;

    @Indexed(expireAfterSeconds = 600)
    private Date createdAt = new Date();

    public OTP() {}

    public OTP(String email, String otp) {
        this.email = email;
        this.otp = otp;
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
