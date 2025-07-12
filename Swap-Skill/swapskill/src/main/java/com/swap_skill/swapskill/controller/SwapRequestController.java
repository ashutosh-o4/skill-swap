package com.swap_skill.swapskill.controller;

import com.swap_skill.swapskill.dto.ApiResponse;
import com.swap_skill.swapskill.dto.SwapRequestDto;
import com.swap_skill.swapskill.model.SwapRequest;
import com.swap_skill.swapskill.service.SwapRequestService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/swaps")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:8081"})
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    public SwapRequestController(SwapRequestService swapRequestService) {
        this.swapRequestService = swapRequestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SwapRequest>> createSwapRequest(@Valid @RequestBody SwapRequestDto swapRequestDto) {
        try {
            SwapRequest createdSwapRequest = swapRequestService.createSwapRequest(swapRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdSwapRequest, "Swap request created successfully"));
        } catch (Exception e) {
            log.error("Error creating swap request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SwapRequest>> getSwapRequestById(@PathVariable String id) {
        try {
            SwapRequest swapRequest = swapRequestService.getSwapRequestById(id);
            return ResponseEntity.ok(ApiResponse.success(swapRequest));
        } catch (Exception e) {
            log.error("Error getting swap request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/from/{fromUserId}")
    public ResponseEntity<ApiResponse<List<SwapRequest>>> getSwapRequestsByFromUser(@PathVariable String fromUserId) {
        try {
            List<SwapRequest> swapRequests = swapRequestService.getSwapRequestsByFromUser(fromUserId);
            return ResponseEntity.ok(ApiResponse.success(swapRequests));
        } catch (Exception e) {
            log.error("Error getting swap requests by from user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/to/{toUserId}")
    public ResponseEntity<ApiResponse<List<SwapRequest>>> getSwapRequestsByToUser(@PathVariable String toUserId) {
        try {
            List<SwapRequest> swapRequests = swapRequestService.getSwapRequestsByToUser(toUserId);
            return ResponseEntity.ok(ApiResponse.success(swapRequests));
        } catch (Exception e) {
            log.error("Error getting swap requests by to user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<ApiResponse<List<SwapRequest>>> getSwapRequestsByStatus(
            @PathVariable String userId,
            @PathVariable SwapRequest.SwapStatus status) {
        try {
            List<SwapRequest> swapRequests = swapRequestService.getSwapRequestsByStatus(userId, status);
            return ResponseEntity.ok(ApiResponse.success(swapRequests));
        } catch (Exception e) {
            log.error("Error getting swap requests by status: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<SwapRequest>> acceptSwapRequest(@PathVariable String id) {
        try {
            SwapRequest swapRequest = swapRequestService.acceptSwapRequest(id);
            return ResponseEntity.ok(ApiResponse.success(swapRequest, "Swap request accepted successfully"));
        } catch (Exception e) {
            log.error("Error accepting swap request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<SwapRequest>> rejectSwapRequest(@PathVariable String id) {
        try {
            SwapRequest swapRequest = swapRequestService.rejectSwapRequest(id);
            return ResponseEntity.ok(ApiResponse.success(swapRequest, "Swap request rejected successfully"));
        } catch (Exception e) {
            log.error("Error rejecting swap request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<SwapRequest>> completeSwapRequest(@PathVariable String id) {
        try {
            SwapRequest swapRequest = swapRequestService.completeSwapRequest(id);
            return ResponseEntity.ok(ApiResponse.success(swapRequest, "Swap request completed successfully"));
        } catch (Exception e) {
            log.error("Error completing swap request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/rating")
    public ResponseEntity<ApiResponse<SwapRequest>> addRatingAndFeedback(
            @PathVariable String id,
            @RequestParam Double rating,
            @RequestParam(required = false) String feedback) {
        try {
            SwapRequest swapRequest = swapRequestService.addRatingAndFeedback(id, rating, feedback);
            return ResponseEntity.ok(ApiResponse.success(swapRequest, "Rating and feedback added successfully"));
        } catch (Exception e) {
            log.error("Error adding rating and feedback: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSwapRequest(@PathVariable String id) {
        try {
            swapRequestService.deleteSwapRequest(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Swap request deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting swap request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 