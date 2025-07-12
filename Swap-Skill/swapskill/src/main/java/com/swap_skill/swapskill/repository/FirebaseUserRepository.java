package com.swap_skill.swapskill.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.swap_skill.swapskill.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Repository
@Slf4j
public class FirebaseUserRepository implements UserRepository {

    private static final String COLLECTION_NAME = "users";
    private final Firestore firestore;

    public FirebaseUserRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public User save(User user) {
        try {
            if (user.getId() == null) {
                user.setId(UUID.randomUUID().toString());
                user.setCreatedAt(com.google.cloud.Timestamp.now());
            }
            user.setUpdatedAt(com.google.cloud.Timestamp.now());
            
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(user.getId());
            ApiFuture<WriteResult> result = docRef.set(user);
            result.get(); // Wait for the write to complete
            
            log.info("User saved successfully with ID: {}", user.getId());
            return user;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving user: {}", e.getMessage());
            throw new RuntimeException("Failed to save user", e);
        }
    }

    @Override
    public Optional<User> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            
            if (document.exists()) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                return Optional.of(user);
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding user by ID: {}", e.getMessage());
            throw new RuntimeException("Failed to find user", e);
        }
    }

    @Override
    public List<User> findAll() {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME).get();
            QuerySnapshot documents = future.get();
            
            List<User> users = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                users.add(user);
            }
            return users;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding all users: {}", e.getMessage());
            throw new RuntimeException("Failed to find users", e);
        }
    }

    @Override
    public List<User> findBySkillsOfferedContaining(String skill) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereArrayContains("skillsOffered", skill)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<User> users = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                users.add(user);
            }
            return users;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding users by skills offered: {}", e.getMessage());
            throw new RuntimeException("Failed to find users by skills offered", e);
        }
    }

    @Override
    public List<User> findBySkillsWantedContaining(String skill) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereArrayContains("skillsWanted", skill)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<User> users = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                users.add(user);
            }
            return users;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding users by skills wanted: {}", e.getMessage());
            throw new RuntimeException("Failed to find users by skills wanted", e);
        }
    }

    @Override
    public List<User> findByAvailabilityContaining(String availability) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereArrayContains("availability", availability)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<User> users = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                users.add(user);
            }
            return users;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding users by availability: {}", e.getMessage());
            throw new RuntimeException("Failed to find users by availability", e);
        }
    }

    @Override
    public List<User> findByPublicProfile(boolean publicProfile) {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("publicProfile", publicProfile)
                    .get();
            QuerySnapshot documents = future.get();
            
            List<User> users = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                users.add(user);
            }
            return users;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding users by public profile: {}", e.getMessage());
            throw new RuntimeException("Failed to find users by public profile", e);
        }
    }

    @Override
    public List<User> searchUsers(String searchTerm) {
        try {
            // Firestore doesn't support full-text search, so we'll search by name
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                    .whereGreaterThanOrEqualTo("name", searchTerm)
                    .whereLessThanOrEqualTo("name", searchTerm + '\uf8ff')
                    .get();
            QuerySnapshot documents = future.get();
            
            List<User> users = new ArrayList<>();
            for (DocumentSnapshot document : documents) {
                User user = document.toObject(User.class);
                user.setId(document.getId());
                users.add(user);
            }
            return users;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error searching users: {}", e.getMessage());
            throw new RuntimeException("Failed to search users", e);
        }
    }

    @Override
    public void deleteById(String id) {
        try {
            ApiFuture<WriteResult> writeResult = firestore.collection(COLLECTION_NAME).document(id).delete();
            writeResult.get();
            log.info("User deleted successfully with ID: {}", id);
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error deleting user: {}", e.getMessage());
            throw new RuntimeException("Failed to delete user", e);
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
            log.error("Error checking if user exists: {}", e.getMessage());
            throw new RuntimeException("Failed to check if user exists", e);
        }
    }
} 