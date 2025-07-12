package com.swap_skill.swapskill.controller;

import com.swap_skill.swapskill.dto.ApiResponse;
import com.swap_skill.swapskill.dto.UserDto;
import com.swap_skill.swapskill.dto.UserSearchDto;
import com.swap_skill.swapskill.model.User;
import com.swap_skill.swapskill.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:8081"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            User createdUser = userService.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdUser, "User created successfully"));
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable String id, 
                                                       @Valid @RequestBody UserDto userDto) {
        try {
            User updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user, "User retrieved successfully"));
        } catch (Exception e) {
            log.error("Error getting user by ID: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            log.error("Error getting all users: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<User>>> searchUsers(@RequestParam String searchTerm) {
        try {
            List<User> users = userService.searchUsers(searchTerm);
            return ResponseEntity.ok(ApiResponse.success(users, "Users found successfully"));
        } catch (Exception e) {
            log.error("Error searching users: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/skills/offered")
    public ResponseEntity<ApiResponse<List<User>>> getUsersBySkillsOffered(@RequestParam String skill) {
        try {
            List<User> users = userService.getUsersBySkillsOffered(skill);
            return ResponseEntity.ok(ApiResponse.success(users, "Users found successfully"));
        } catch (Exception e) {
            log.error("Error getting users by skills offered: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/skills/wanted")
    public ResponseEntity<ApiResponse<List<User>>> getUsersBySkillsWanted(@RequestParam String skill) {
        try {
            List<User> users = userService.getUsersBySkillsWanted(skill);
            return ResponseEntity.ok(ApiResponse.success(users, "Users found successfully"));
        } catch (Exception e) {
            log.error("Error getting users by skills wanted: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/availability")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByAvailability(@RequestParam String availability) {
        try {
            List<User> users = userService.getUsersByAvailability(availability);
            return ResponseEntity.ok(ApiResponse.success(users, "Users found successfully"));
        } catch (Exception e) {
            log.error("Error getting users by availability: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<ApiResponse<Void>> toggleProfileVisibility(@PathVariable String id) {
        try {
            userService.toggleProfileVisibility(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Profile visibility toggled successfully"));
        } catch (Exception e) {
            log.error("Error toggling profile visibility: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }


} 