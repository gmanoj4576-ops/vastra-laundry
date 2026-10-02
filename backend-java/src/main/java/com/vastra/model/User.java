package com.vastra.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String mobile;

    @Indexed(unique = true, sparse = true)
    private String email;

    private String password;
    private String role = "customer"; // customer, admin, partner, logistics
    private double walletBalance = 0;
    private int vastraCoins = 0;
    private String lastCheckinDate;
    private String avatar;

    private List<Address> savedAddresses = new ArrayList<>();
    private List<Notification> notifications = new ArrayList<>();

    private double dailyEarnings = 0;
    private String partnerStatus = "active";
    private String logisticsStatus = "active";
    private String area = "General";

    public User() {}

    public User(String name, String mobile, String email, String password, String role) {
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : "customer";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public double getWalletBalance() { return walletBalance; }
    public void setWalletBalance(double walletBalance) { this.walletBalance = walletBalance; }

    public int getVastraCoins() { return vastraCoins; }
    public void setVastraCoins(int vastraCoins) { this.vastraCoins = vastraCoins; }

    public String getLastCheckinDate() { return lastCheckinDate; }
    public void setLastCheckinDate(String lastCheckinDate) { this.lastCheckinDate = lastCheckinDate; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public List<Address> getSavedAddresses() { return savedAddresses; }
    public void setSavedAddresses(List<Address> savedAddresses) { this.savedAddresses = savedAddresses; }

    public List<Notification> getNotifications() { return notifications; }
    public void setNotifications(List<Notification> notifications) { this.notifications = notifications; }

    public double getDailyEarnings() { return dailyEarnings; }
    public void setDailyEarnings(double dailyEarnings) { this.dailyEarnings = dailyEarnings; }

    public String getPartnerStatus() { return partnerStatus; }
    public void setPartnerStatus(String partnerStatus) { this.partnerStatus = partnerStatus; }

    public String getLogisticsStatus() { return logisticsStatus; }
    public void setLogisticsStatus(String logisticsStatus) { this.logisticsStatus = logisticsStatus; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    // Inner Helper Classes
    public static class Address {
        private String type;
        private String text;

        public Address() {}
        public Address(String type, String text) {
            this.type = type;
            this.text = text;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class Notification {
        private String text;
        private String date;
        private boolean read = false;

        public Notification() {}
        public Notification(String text, String date, boolean read) {
            this.text = text;
            this.date = date;
            this.read = read;
        }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public boolean isRead() { return read; }
        public void setRead(boolean read) { this.read = read; }
    }
}
