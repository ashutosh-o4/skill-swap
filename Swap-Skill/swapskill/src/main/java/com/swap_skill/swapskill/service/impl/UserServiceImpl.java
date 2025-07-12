package com.swap_skill.swapskill.service.impl;

import com.swap_skill.swapskill.dto.UserDto;
import com.swap_skill.swapskill.dto.UserSearchDto;
import com.swap_skill.swapskill.model.User;
import com.swap_skill.swapskill.repository.UserRepository;
import com.swap_skill.swapskill.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(UserDto userDto) {
        log.info("Creating new user: {}", userDto.getName());
        
        User user = User.builder()
                .name(userDto.getName())
                .profilePhoto(userDto.getProfilePhoto())
                .location(userDto.getLocation())
                .availability(userDto.getAvailability())
                .skillsOffered(userDto.getSkillsOffered())
                .skillsWanted(userDto.getSkillsWanted())
                .publicProfile(userDto.getPublicProfile())
                .rating(0.0)
                .about(userDto.getAbout())
                .build();
        
        return userRepository.save(user);
    }

    @Override
    public User updateUser(String id, UserDto userDto) {
        log.info("Updating user with ID: {}", id);
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        existingUser.setName(userDto.getName());
        existingUser.setProfilePhoto(userDto.getProfilePhoto());
        existingUser.setLocation(userDto.getLocation());
        existingUser.setAvailability(userDto.getAvailability());
        existingUser.setSkillsOffered(userDto.getSkillsOffered());
        existingUser.setSkillsWanted(userDto.getSkillsWanted());
        existingUser.setPublicProfile(userDto.getPublicProfile());
        existingUser.setAbout(userDto.getAbout());
        
        return userRepository.save(existingUser);
    }

    @Override
    public User getUserById(String id) {
        log.info("Getting user by ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        if (!user.isPublicProfile()) {
            throw new RuntimeException("User profile is private");
        }
        
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        log.info("Getting all public users");
        return userRepository.findByPublicProfile(true);
    }

    @Override
    public List<User> searchUsers(String searchTerm) {
        log.info("Searching users with term: {}", searchTerm);
        return userRepository.searchUsers(searchTerm);
    }

    @Override
    public List<User> getUsersBySkillsOffered(String skill) {
        log.info("Getting users by skills offered: {}", skill);
        return userRepository.findBySkillsOfferedContaining(skill);
    }

    @Override
    public List<User> getUsersBySkillsWanted(String skill) {
        log.info("Getting users by skills wanted: {}", skill);
        return userRepository.findBySkillsWantedContaining(skill);
    }

    @Override
    public List<User> getUsersByAvailability(String availability) {
        log.info("Getting users by availability: {}", availability);
        return userRepository.findByAvailabilityContaining(availability);
    }

    @Override
    public void deleteUser(String id) {
        log.info("Deleting user with ID: {}", id);
        userRepository.deleteById(id);
    }

    @Override
    public void toggleProfileVisibility(String id) {
        log.info("Toggling profile visibility for user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        user.setPublicProfile(!user.isPublicProfile());
        userRepository.save(user);
    }

} 