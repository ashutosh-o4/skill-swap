package com.swap_skill.swapskill.model;

import com.google.cloud.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SwapRequest {
    private String id;
    private String fromUserId;
    private String toUserId;
    private String skillOffered;
    private String skillWanted;
    private String message;
    private SwapStatus status;
    private Double rating;
    private String feedback;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    public enum SwapStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        COMPLETED,
        CANCELLED
    }
} 