package com.swap_skill.swapskill.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.swap_skill.swapskill.model.SwapRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Repository
@Slf4j
public class FirebaseSwapRequestRepository implements SwapRequestRepository {

    private static final String COLLECTION_NAME = "swaps";
    private final Firestore firestore;

    public FirebaseSwapRequestRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public SwapRequest save(SwapRequest swapRequest) {
        try {
            if (swapRequest.getId() == null) {
                swapRequest.setId(UUID.randomUUID().toString());
                swapRequest.setCreatedAt(com.google.cloud.Timestamp.now());
            }
            swapRequest.setUpdatedAt(com.google.cloud.Timestamp.now());
            
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(swapRequest.getId());
            ApiFuture<WriteResult> result = docRef.set(swapRequest);
            result.get();
            
            log.info("Swap request saved successfully with ID: {}", swapRequest.getId());
            return swapRequest;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving swap request: {}", e.getMessage());
            throw new RuntimeException("Failed to save swap request", e);
        }
    }

    @Override
    public Optional<SwapRequest> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            
            if (document.exists()) {
                SwapRequest swapRequest = document.toObject(SwapRequest.class);
                swapRequest.setId(document.getId());
                return Optional.of(swapRequest);
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swap request by ID: {}", e.getMessage());
            throw new RuntimeException("Failed to find swap request", e);
        }
    }

    @Override
    public List<SwapRequest> findByFromUserId(String fromUserId) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("fromUserId", fromUserId)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<SwapRequest> swapRequests = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                SwapRequest swapRequest = document.toObject(SwapRequest.class);
                swapRequest.setId(document.getId());
                swapRequests.add(swapRequest);
            }
            return swapRequests;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swap requests by from user ID: {}", e.getMessage());
            throw new RuntimeException("Failed to find swap requests by from user ID", e);
        }
    }

    @Override
    public List<SwapRequest> findByToUserId(String toUserId) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("toUserId", toUserId)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<SwapRequest> swapRequests = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                SwapRequest swapRequest = document.toObject(SwapRequest.class);
                swapRequest.setId(document.getId());
                swapRequests.add(swapRequest);
            }
            return swapRequests;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swap requests by to user ID: {}", e.getMessage());
            throw new RuntimeException("Failed to find swap requests by to user ID", e);
        }
    }

    @Override
    public List<SwapRequest> findByFromUserIdAndStatus(String fromUserId, SwapRequest.SwapStatus status) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("fromUserId", fromUserId)
                    .whereEqualTo("status", status)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<SwapRequest> swapRequests = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                SwapRequest swapRequest = document.toObject(SwapRequest.class);
                swapRequest.setId(document.getId());
                swapRequests.add(swapRequest);
            }
            return swapRequests;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swap requests by from user ID and status: {}", e.getMessage());
            throw new RuntimeException("Failed to find swap requests by from user ID and status", e);
        }
    }

    @Override
    public List<SwapRequest> findByToUserIdAndStatus(String toUserId, SwapRequest.SwapStatus status) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("toUserId", toUserId)
                    .whereEqualTo("status", status)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<SwapRequest> swapRequests = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                SwapRequest swapRequest = document.toObject(SwapRequest.class);
                swapRequest.setId(document.getId());
                swapRequests.add(swapRequest);
            }
            return swapRequests;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding swap requests by to user ID and status: {}", e.getMessage());
            throw new RuntimeException("Failed to find swap requests by to user ID and status", e);
        }
    }

    @Override
    public void deleteById(String id) {
        try {
            ApiFuture<WriteResult> writeResult = firestore.collection(COLLECTION_NAME).document(id).delete();
            writeResult.get();
            log.info("Swap request deleted successfully with ID: {}", id);
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error deleting swap request: {}", e.getMessage());
            throw new RuntimeException("Failed to delete swap request", e);
        }
    }

    @Override
    public boolean existsById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            return document.exists();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error checking if swap request exists: {}", e.getMessage());
            throw new RuntimeException("Failed to check if swap request exists", e);
        }
    }
} 