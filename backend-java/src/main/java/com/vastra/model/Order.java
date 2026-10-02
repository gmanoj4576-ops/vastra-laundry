package com.vastra.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userEmail;
    private String userMobile;

    private List<OrderItem> items = new ArrayList<>();
    private double totalAmount;
    private String address;

    private double partnerPayout = 0;
    private String assignedPartner;
    private String deliveryAgent;

    @Indexed(unique = true, sparse = true)
    private String trackingId;

    private String status = "Pending";
    private String date;

    private Location currentLocation;

    public Order() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserMobile() { return userMobile; }
    public void setUserMobile(String userMobile) { this.userMobile = userMobile; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getPartnerPayout() { return partnerPayout; }
    public void setPartnerPayout(double partnerPayout) { this.partnerPayout = partnerPayout; }

    public String getAssignedPartner() { return assignedPartner; }
    public void setAssignedPartner(String assignedPartner) { this.assignedPartner = assignedPartner; }

    public String getDeliveryAgent() { return deliveryAgent; }
    public void setDeliveryAgent(String deliveryAgent) { this.deliveryAgent = deliveryAgent; }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Location getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(Location currentLocation) { this.currentLocation = currentLocation; }

    public static class OrderItem {
        private String itemName;
        private String serviceName;
        private double price;
        private int quantity;
        private boolean isCustom = false;
        private String details;
        private String budget;

        public OrderItem() {}

        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }

        public String getServiceName() { return serviceName; }
        public void setServiceName(String serviceName) { this.serviceName = serviceName; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public boolean isCustom() { return isCustom; }
        public void setCustom(boolean custom) { isCustom = custom; }

        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }

        public String getBudget() { return budget; }
        public void setBudget(String budget) { this.budget = budget; }
    }

    public static class Location {
        private double lat;
        private double lng;
        private Date updatedAt = new Date();

        public Location() {}
        public Location(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
            this.updatedAt = new Date();
        }

        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }

        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }

        public Date getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    }
}
