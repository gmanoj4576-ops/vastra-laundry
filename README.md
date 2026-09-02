# VASTRA – Smart Laundry Management System

## Overview

VASTRA is a smart laundry management system developed to simplify and digitize the traditional laundry service process. The system provides a convenient platform for customers to request laundry services, schedule clothing pickup, track order progress, manage payments, and receive cleaned clothes through doorstep delivery.

The project focuses on reducing manual work, improving order management, and providing a better experience for both customers and laundry service providers.

## Problem Statement

Traditional laundry businesses often depend on manual processes for booking, order recording, billing, customer communication, and delivery management. These processes can result in difficulties such as misplaced orders, incorrect billing, delays, lack of order visibility, and inefficient management of customer information.

VASTRA addresses these challenges by providing a centralized digital system for managing the complete laundry workflow.

## Objectives

The main objectives of VASTRA are:

* To digitize the traditional laundry booking process.
* To provide customers with an easy way to request laundry services.
* To simplify pickup and delivery management.
* To provide customers with order status information.
* To organize customer and order information digitally.
* To reduce manual record keeping and administrative work.
* To improve communication between customers and laundry service providers.
* To provide a structured system for managing laundry operations.

## Key Features

### Customer Management

Customers can create an account and access the laundry services through the application. Their basic information and order history can be maintained digitally.

### Laundry Service Selection

Customers can select the required laundry service according to their needs. Services may include washing, ironing, dry cleaning, and other available laundry options.

### Order Management

Customers can create laundry orders by providing the required service and clothing details. Each order can be maintained with its corresponding customer, service, price, and status information.

### Pickup Scheduling

Customers can select a suitable date and time for clothes pickup. This reduces the need for customers to physically visit the laundry service.

### Order Tracking

The system provides different order stages so that customers can understand the current progress of their laundry.

A typical order workflow is:

```text
Order Placed
     ↓
Pickup Scheduled
     ↓
Clothes Picked Up
     ↓
Processing
     ↓
Washing
     ↓
Drying
     ↓
Ironing and Folding
     ↓
Ready for Delivery
     ↓
Out for Delivery
     ↓
Delivered
```

### Payment Management

The system can maintain the billing information associated with each laundry order. Customers can view the applicable charges and payment status.

### Admin Management

The administrator can manage important aspects of the laundry operation, including customers, orders, services, pricing, and order status.

### Delivery Management

The system supports the management of clothing pickup and delivery. Delivery personnel can receive assigned orders and update their progress.

### Feedback

Customers can provide feedback after receiving their orders. This can help the laundry service identify areas for improvement and understand customer satisfaction.

## System Workflow

The overall VASTRA workflow can be summarized as:

```text
Customer
   ↓
Registration / Login
   ↓
Select Laundry Service
   ↓
Add Clothing Details
   ↓
Schedule Pickup
   ↓
Place Order
   ↓
Pickup
   ↓
Laundry Processing
   ↓
Quality Check
   ↓
Billing / Payment
   ↓
Delivery
   ↓
Customer Feedback
```

## User Roles

### Customer

The customer interacts with the system to:

* Register and log in.
* Select laundry services.
* Add clothing details.
* Place laundry orders.
* Schedule pickup.
* Track order status.
* View billing information.
* Make payments.
* Provide feedback.

### Administrator

The administrator manages the overall laundry operation and can:

* Manage customers.
* View and manage orders.
* Manage laundry services.
* Update service prices.
* Update order status.
* Manage pickup and delivery.
* Monitor payments.
* View customer feedback.

### Delivery Personnel

Delivery personnel are responsible for handling the movement of clothes between the customer and laundry facility. They can receive assigned orders and update pickup and delivery status.

## Technology Stack

The project can be developed using the following technologies:

### Frontend

* HTML
* CSS
* JavaScript

HTML is used to structure the application interface, CSS is used for styling and layout, and JavaScript is used to provide interactive functionality.

### Application Development

* Java
* Android Studio

Java can be used for Android application development and for implementing application logic within the Android environment.

### Backend and Data Processing

* Python

Python can be used for backend services, API development, data processing, and future AI/ML integration.

### Database

Depending on the implementation, the project can use:

* MONGO DB
* Firebase

The database stores information such as customer details, orders, services, payments, and delivery information.

## System Architecture

The basic architecture of VASTRA can be represented as:

```text
                Customer
                   |
                   v
          VASTRA Application
                   |
                   v
            Application Layer
                   |
          +--------+--------+
          |                 |
          v                 v
       Backend           AI/ML Layer
       (Python)          (Optional)
          |
          v
       Database
          |
     +----+----+
     |         |
     v         v
   Admin    Delivery
```

## Database Structure

A possible database structure for VASTRA includes the following entities.

### Customer

Stores customer information such as:

* Customer ID
* Name
* Email
* Phone Number
* Address
* Account Details

### Orders

Stores information about laundry orders:

* Order ID
* Customer ID
* Order Date
* Pickup Date
* Delivery Date
* Service
* Total Amount
* Order Status

### Order Items

Stores details about individual clothing items:

* Item ID
* Order ID
* Clothing Type
* Quantity
* Service Type

### Payment

Stores payment-related information:

* Payment ID
* Order ID
* Amount
* Payment Method
* Payment Status

### Delivery

Stores pickup and delivery information:

* Delivery ID
* Order ID
* Delivery Personnel
* Pickup Status
* Delivery Status

### Feedback

Stores customer feedback:

* Feedback ID
* Customer ID
* Order ID
* Rating
* Comments

## AI and Machine Learning Integration

VASTRA can be extended with Artificial Intelligence and Machine Learning to make the system more intelligent.

Possible AI/ML applications include:

### Demand Prediction

Historical laundry orders can be analyzed to predict future demand. This can help the laundry service prepare staff and resources according to expected demand.

### Delivery Time Prediction

Machine learning can be used to estimate delivery time based on factors such as distance, previous delivery data, order volume, and time of day.

### Customer Recommendations

Customer order history can be analyzed to provide personalized service recommendations and reminders.

### Business Analytics

Historical data can be analyzed to identify frequently used services, peak business periods, and customer preferences.

## Advantages

VASTRA provides several advantages over traditional manual laundry management:

* Reduces paperwork and manual record keeping.
* Makes laundry booking easier for customers.
* Improves order organization.
* Provides better visibility of order status.
* Simplifies pickup and delivery management.
* Helps maintain customer history.
* Reduces errors in order management.
* Provides a scalable platform for future improvements.

## Future Enhancements

The system can be further enhanced with:

* AI-powered customer support chatbot.
* GPS-based delivery tracking.
* Intelligent delivery route optimization.
* Online payment gateway integration.
* Automated notifications.
* AI-based demand forecasting.
* Clothing image recognition.
* RFID-based clothing tracking.
* Subscription-based laundry services.
* Multi-branch laundry management.
* Advanced business analytics and reporting.

## Project Structure

A possible project structure is:

```text
VASTRA/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── android/
│   ├── app/
│   └── gradle/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── models/
│   └── services/
│
├── database/
│   └── database.sql
│
├── ml/
│   ├── dataset/
│   ├── models/
│   └── prediction.py
│
└── README.md
```

The exact structure may vary depending on the final implementation.

## Installation and Setup

### Prerequisites

Make sure the following software is installed:

* Android Studio
* Java Development Kit (JDK)
* Python
* Git
* MySQL or Firebase, depending on the database implementation

### Clone the Repository

```bash
git clone <repository-url>
cd VASTRA
```

### Backend Setup

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment and install the required dependencies:

```bash
pip install -r requirements.txt
```

Run the backend application:

```bash
python app.py
```

### Android Application

Open the Android project in Android Studio, allow Gradle dependencies to synchronize, configure the backend/API connection, and run the application using an Android emulator or physical Android device.

## Project Goals

VASTRA aims to create a reliable and user-friendly digital platform for laundry service management. The project combines application development, database management, backend technologies, and the possibility of AI/ML integration to create a complete and scalable solution.

## Conclusion

VASTRA transforms the traditional laundry process into a structured digital workflow. From placing an order and scheduling pickup to processing, payment, tracking, and delivery, the system brings the major laundry operations together in one platform.

The project demonstrates the practical application of software development, database management, mobile application development, backend technologies, and AI/ML concepts to solve a real-world service management problem.

## Project Information

**Project Name:** VASTRA
**Project Type:** Smart Laundry Management System
**Domain:** Service Management / Mobile Application
**Frontend:** HTML, CSS, JavaScript
**Application Development:** Java, Android Studio
**Backend:** Python
**Database:** MySQL / Firebase
**AI/ML:** Python-based integration where applicable

## License

This project is developed for educational and project-development purposes.
