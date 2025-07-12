package com.swap_skill.swapskill.service;

import com.swap_skill.swapskill.dto.SwapRequestDto;
import com.swap_skill.swapskill.model.SwapRequest;

import java.util.List;

public interface SwapRequestService {
    SwapRequest createSwapRequest(SwapRequestDto swapRequestDto);
    SwapRequest getSwapRequestById(String id);
    List<SwapRequest> getSwapRequestsByFromUser(String fromUserId);
    List<SwapRequest> getSwapRequestsByToUser(String toUserId);
    List<SwapRequest> getSwapRequestsByStatus(String userId, SwapRequest.SwapStatus status);
    SwapRequest acceptSwapRequest(String id);
    SwapRequest rejectSwapRequest(String id);
    SwapRequest completeSwapRequest(String id);
    SwapRequest addRatingAndFeedback(String id, Double rating, String feedback);
    void deleteSwapRequest(String id);
} 