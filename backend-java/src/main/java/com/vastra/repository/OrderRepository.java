package com.vastra.repository;

import com.vastra.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserEmailOrUserMobile(String userEmail, String userMobile);

    Optional<Order> findByTrackingId(String trackingId);

    List<Order> findByDeliveryAgentOrAssignedPartner(String deliveryAgent, String assignedPartner);
}
