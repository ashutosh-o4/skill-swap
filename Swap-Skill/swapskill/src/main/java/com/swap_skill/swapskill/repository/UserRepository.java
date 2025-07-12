package com.swap_skill.swapskill.repository;

import com.swap_skill.swapskill.model.User;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(String id);
    List<User> findAll();
    List<User> findBySkillsOfferedContaining(String skill);
    List<User> findBySkillsWantedContaining(String skill);
    List<User> findByAvailabilityContaining(String availability);
    List<User> findByPublicProfile(boolean publicProfile);
    List<User> searchUsers(String searchTerm);
    void deleteById(String id);
    boolean existsById(String id);
} 