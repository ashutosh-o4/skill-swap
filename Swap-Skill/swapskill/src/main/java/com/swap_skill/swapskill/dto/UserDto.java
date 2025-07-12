package com.swap_skill.swapskill.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    private String profilePhoto;
    
    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;
    
    @NotEmpty(message = "Availability is required")
    private List<String> availability;
    
    @NotEmpty(message = "Skills offered is required")
    private List<String> skillsOffered;
    
    @NotEmpty(message = "Skills wanted is required")
    private List<String> skillsWanted;
    
    @NotNull(message = "Public profile setting is required")
    private Boolean publicProfile;
    
    private Double rating;
    
    @Size(max = 1000, message = "About section must not exceed 1000 characters")
    private String about;
} 