package com.swap_skill.swapskill.repository;

import com.swap_skill.swapskill.model.SwapRequest;
import java.util.List;
import java.util.Optional;

public interface SwapRequestRepository {
    SwapRequest save(SwapRequest swapRequest);
    Optional<SwapRequest> findById(String id);
    List<SwapRequest> findByFromUserId(String fromUserId);
    List<SwapRequest> findByToUserId(String toUserId);
    List<SwapRequest> findByFromUserIdAndStatus(String fromUserId, SwapRequest.SwapStatus status);
    List<SwapRequest> findByToUserIdAndStatus(String toUserId, SwapRequest.SwapStatus status);
    void deleteById(String id);
    boolean existsById(String id);
} 