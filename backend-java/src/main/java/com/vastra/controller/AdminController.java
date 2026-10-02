package com.vastra.controller;

import com.vastra.model.User;
import com.vastra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUserByAdmin(@RequestBody User user) {
        if (user.getMobile() == null || user.getMobile().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number is required"));
        }

        if (userRepository.findByMobile(user.getMobile()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User with this mobile number already exists"));
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered by Admin", "user", savedUser));
    }

    @PutMapping("/users/{userId}/wallet")
    public ResponseEntity<?> updateWalletBalance(@PathVariable String userId, @RequestBody Map<String, Object> body) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        double balance = Double.parseDouble(body.get("walletBalance").toString());
        User user = userOpt.get();
        user.setWalletBalance(balance);

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Wallet balance updated successfully", "user", updatedUser));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody Map<String, Object> body) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        if (body.containsKey("name")) user.setName((String) body.get("name"));
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("role")) user.setRole((String) body.get("role"));
        if (body.containsKey("area")) user.setArea((String) body.get("area"));
        if (body.containsKey("partnerStatus")) user.setPartnerStatus((String) body.get("partnerStatus"));

        User updated = userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User updated successfully", "user", updated));
    }
}
