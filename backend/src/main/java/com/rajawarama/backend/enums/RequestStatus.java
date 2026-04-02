package com.rajawarama.backend.enums;

public enum RequestStatus {
    PENDING,             // Default — customer just submitted
    PRICE_SET,           // Admin added transport price
    ACCEPTED_WITH_PRICE, // Customer accepted the price
    CANCELLED,           // Customer cancelled after price was set
    APPROVED,            // Admin approved final request
    REJECTED,            // Admin rejected the request
    COMPLETED            // Event done — admin marked complete
}
 