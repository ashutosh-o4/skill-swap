package com.swap_skill.swapskill.service.impl;

import com.swap_skill.swapskill.dto.SwapRequestDto;
import com.swap_skill.swapskill.model.SwapRequest;
import com.swap_skill.swapskill.repository.SwapRequestRepository;
import com.swap_skill.swapskill.repository.UserRepository;
import com.swap_skill.swapskill.service.SwapRequestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class SwapRequestServiceImpl implements SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final UserRepository userRepository;

    public SwapRequestServiceImpl(SwapRequestRepository swapRequestRepository, UserRepository userRepository) {
        this.swapRequestRepository = swapRequestRepository;
        this.userRepository = userRepository;
    }

    @Override
    public SwapRequest createSwapRequest(SwapRequestDto swapRequestDto) {
        log.info("Creating swap request from user {} to user {}", 
                swapRequestDto.getFromUserId(), swapRequestDto.getToUserId());
        
        // Validate that both users exist
        if (!userRepository.existsById(swapRequestDto.getFromUserId())) {
            throw new RuntimeException("From user not found with ID: " + swapRequestDto.getFromUserId());
        }
        
        if (!userRepository.existsById(swapRequestDto.getToUserId())) {
            throw new RuntimeException("To user not found with ID: " + swapRequestDto.getToUserId());
        }
        
        // Check if user is trying to swap with themselves
        if (swapRequestDto.getFromUserId().equals(swapRequestDto.getToUserId())) {
            throw new RuntimeException("Cannot create swap request with yourself");
        }
        
        SwapRequest swapRequest = SwapRequest.builder()
                .fromUserId(swapRequestDto.getFromUserId())
                .toUserId(swapRequestDto.getToUserId())
                .skillOffered(swapRequestDto.getSkillOffered())
                .skillWanted(swapRequestDto.getSkillWanted())
                .message(swapRequestDto.getMessage())
                .status(SwapRequest.SwapStatus.PENDING)
                .build();
        
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    public SwapRequest getSwapRequestById(String id) {
        log.info("Getting swap request by ID: {}", id);
        
        return swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with ID: " + id));
    }

    @Override
    public List<SwapRequest> getSwapRequestsByFromUser(String fromUserId) {
        log.info("Getting swap requests by from user: {}", fromUserId);
        return swapRequestRepository.findByFromUserId(fromUserId);
    }

    @Override
    public List<SwapRequest> getSwapRequestsByToUser(String toUserId) {
        log.info("Getting swap requests by to user: {}", toUserId);
        return swapRequestRepository.findByToUserId(toUserId);
    }

    @Override
    public List<SwapRequest> getSwapRequestsByStatus(String userId, SwapRequest.SwapStatus status) {
        log.info("Getting swap requests for user {} with status: {}", userId, status);
        
        List<SwapRequest> fromUserRequests = swapRequestRepository.findByFromUserIdAndStatus(userId, status);
        List<SwapRequest> toUserRequests = swapRequestRepository.findByToUserIdAndStatus(userId, status);
        
        fromUserRequests.addAll(toUserRequests);
        return fromUserRequests;
    }

    @Override
    public SwapRequest acceptSwapRequest(String id) {
        log.info("Accepting swap request with ID: {}", id);
        
        SwapRequest swapRequest = swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with ID: " + id));
        
        if (swapRequest.getStatus() != SwapRequest.SwapStatus.PENDING) {
            throw new RuntimeException("Cannot accept swap request that is not pending");
        }
        
        swapRequest.setStatus(SwapRequest.SwapStatus.ACCEPTED);
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    public SwapRequest rejectSwapRequest(String id) {
        log.info("Rejecting swap request with ID: {}", id);
        
        SwapRequest swapRequest = swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with ID: " + id));
        
        if (swapRequest.getStatus() != SwapRequest.SwapStatus.PENDING) {
            throw new RuntimeException("Cannot reject swap request that is not pending");
        }
        
        swapRequest.setStatus(SwapRequest.SwapStatus.REJECTED);
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    public SwapRequest completeSwapRequest(String id) {
        log.info("Completing swap request with ID: {}", id);
        
        SwapRequest swapRequest = swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with ID: " + id));
        
        if (swapRequest.getStatus() != SwapRequest.SwapStatus.ACCEPTED) {
            throw new RuntimeException("Cannot complete swap request that is not accepted");
        }
        
        swapRequest.setStatus(SwapRequest.SwapStatus.COMPLETED);
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    public SwapRequest addRatingAndFeedback(String id, Double rating, String feedback) {
        log.info("Adding rating and feedback to swap request with ID: {}", id);
        
        if (rating < 0 || rating > 5) {
            throw new RuntimeException("Rating must be between 0 and 5");
        }
        
        SwapRequest swapRequest = swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with ID: " + id));
        
        if (swapRequest.getStatus() != SwapRequest.SwapStatus.COMPLETED) {
            throw new RuntimeException("Cannot add rating to swap request that is not completed");
        }
        
        swapRequest.setRating(rating);
        swapRequest.setFeedback(feedback);
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    public void deleteSwapRequest(String id) {
        log.info("Deleting swap request with ID: {}", id);
        
        SwapRequest swapRequest = swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with ID: " + id));
        
        if (swapRequest.getStatus() != SwapRequest.SwapStatus.PENDING) {
            throw new RuntimeException("Cannot delete swap request that is not pending");
        }
        
        swapRequestRepository.deleteById(id);
    }
} 