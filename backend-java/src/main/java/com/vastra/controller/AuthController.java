package com.vastra.controller;

import com.vastra.service.EmailService;
import com.vastra.model.OTP;
import com.vastra.model.User;
import com.vastra.repository.OtpRepository;
import com.vastra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);

        Optional<OTP> existing = otpRepository.findByEmail(email);
        OTP otpRecord = existing.orElseGet(() -> new OTP(email, otpCode));
        otpRecord.setOtp(otpCode);
        otpRecord.setCreatedAt(new Date());

        otpRepository.save(otpRecord);

        // Attempt live email delivery via Spring Mail
        boolean emailSent = emailService.sendOtpEmail(email, otpCode);

        System.out.println("📧 [JAVA OTP LOG] Generated OTP for " + email + ": " + otpCode + " (Email Sent: " + emailSent + ")");
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully to " + email);
        response.put("otp", otpCode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required"));
        }

        Optional<OTP> record = otpRepository.findByEmail(email);
        if (record.isEmpty() || !record.get().getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }

        return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String mobile = (String) body.get("mobile");
        String password = (String) body.get("password");
        String email = (String) body.get("email");
        String role = (String) body.getOrDefault("role", "customer");
        Boolean otpVerified = (Boolean) body.getOrDefault("otpVerified", false);

        if ("customer".equals(role) && email != null && !email.isBlank() && !Boolean.TRUE.equals(otpVerified)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email verification required"));
        }

        if (userRepository.findByMobile(mobile).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User with this mobile number already exists"));
        }

        User newUser = new User(name, mobile, email, password, role);
        User saved = userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User created successfully", "user", saved));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> body) {
        String mobile = body.get("mobile");
        String email = body.get("email");
        String identifier = body.get("identifier");
        String password = body.get("password");

        String loginId = mobile != null ? mobile : (email != null ? email : identifier);

        if (loginId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile or Email is required"));
        }

        Optional<User> userOpt = userRepository.findByMobileOrEmail(loginId, loginId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        if (password != null && !password.equals(user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid password"));
        }

        return ResponseEntity.ok(Map.of("message", "Login successful", "user", user));
    }

    @GetMapping("/logistics")
    public ResponseEntity<List<User>> getLogisticsAgents() {
        List<User> agents = userRepository.findByRoleIn(List.of("logistics", "partner"));
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String avatar = body.get("avatar");
        String role = body.getOrDefault("role", "customer");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required for social login"));
        }

        Optional<User> existing = userRepository.findByEmail(email);
        User user;
        if (existing.isPresent()) {
            user = existing.get();
        } else {
            user = new User(name, "Google-User-" + (new Random().nextInt(900000) + 100000), email, UUID.randomUUID().toString().substring(0, 8), role);
            user.setAvatar(avatar);
            user = userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Social login successful", "user", user));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        if (body.containsKey("walletBalance")) {
            user.setWalletBalance(Double.parseDouble(body.get("walletBalance").toString()));
        }
        if (body.containsKey("vastraCoins")) {
            user.setVastraCoins(Integer.parseInt(body.get("vastraCoins").toString()));
        }
        if (body.containsKey("lastCheckinDate")) {
            user.setLastCheckinDate((String) body.get("lastCheckinDate"));
        }

        User updated = userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", updated));
    }
}
