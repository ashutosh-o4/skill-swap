package com.swap_skill.swapskill.service;

import com.swap_skill.swapskill.dto.UserDto;
import com.swap_skill.swapskill.dto.UserSearchDto;
import com.swap_skill.swapskill.model.User;

import java.util.List;

public interface UserService {
    User createUser(UserDto userDto);
    User updateUser(String id, UserDto userDto);
    User getUserById(String id);
    List<User> getAllUsers();
    List<User> searchUsers(String searchTerm);
    List<User> getUsersBySkillsOffered(String skill);
    List<User> getUsersBySkillsWanted(String skill);
    List<User> getUsersByAvailability(String availability);
    void deleteUser(String id);
    void toggleProfileVisibility(String id);
} 