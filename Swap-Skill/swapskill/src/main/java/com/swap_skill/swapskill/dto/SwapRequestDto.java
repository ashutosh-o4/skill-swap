package com.swap_skill.swapskill.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SwapRequestDto {
    private String id;
    
    @NotBlank(message = "From user ID is required")
    private String fromUserId;
    
    @NotBlank(message = "To user ID is required")
    private String toUserId;
    
    @NotBlank(message = "Skill offered is required")
    @Size(max = 100, message = "Skill offered must not exceed 100 characters")
    private String skillOffered;
    
    @NotBlank(message = "Skill wanted is required")
    @Size(max = 100, message = "Skill wanted must not exceed 100 characters")
    private String skillWanted;
    
    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;
    
    private String status;
    
    private Double rating;
    
    @Size(max = 1000, message = "Feedback must not exceed 1000 characters")
    private String feedback;
} 