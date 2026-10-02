package com.vastra.controller;

import com.vastra.model.Order;
import com.vastra.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        if (order.getUserMobile() == null || order.getUserMobile().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User mobile number is required"));
        }

        if (order.getTrackingId() == null) {
            order.setTrackingId("VST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        if (order.getStatus() == null) {
            order.setStatus("Pending");
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/{emailOrMobile}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String emailOrMobile) {
        List<Order> orders = orderRepository.findByUserEmailOrUserMobile(emailOrMobile, emailOrMobile);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/logistics/{agentId}")
    public ResponseEntity<List<Order>> getPartnerOrders(@PathVariable String agentId) {
        List<Order> orders = orderRepository.findByDeliveryAgentOrAssignedPartner(agentId, agentId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/tracking/{trackingId}")
    public ResponseEntity<?> getOrderByTrackingId(@PathVariable String trackingId) {
        Optional<Order> orderOpt = orderRepository.findByTrackingId(trackingId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Tracking ID not found"));
        }
        return ResponseEntity.ok(orderOpt.get());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        Order order = orderOpt.get();
        order.setStatus(status);
        Order updated = orderRepository.save(order);

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignPartner(@PathVariable String id, @RequestBody Map<String, String> body) {
        String partnerId = body.get("partnerId");
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        Order order = orderOpt.get();
        order.setDeliveryAgent(partnerId);
        order.setAssignedPartner(partnerId);
        order.setStatus("Assigned");
        Order updated = orderRepository.save(order);

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<?> updateLocation(@PathVariable String id, @RequestBody Map<String, Double> body) {
        Double lat = body.get("lat");
        Double lng = body.get("lng");

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        Order order = orderOpt.get();
        order.setCurrentLocation(new Order.Location(lat != null ? lat : 0, lng != null ? lng : 0));
        Order updated = orderRepository.save(order);

        return ResponseEntity.ok(updated);
    }
}
