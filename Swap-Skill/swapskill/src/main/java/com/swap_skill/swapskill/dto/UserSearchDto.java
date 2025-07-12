package com.swap_skill.swapskill.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDto {
    private String searchTerm;
    private List<String> skills;
    private List<String> availability;
    private Boolean publicProfile;
    private Integer page;
    private Integer size;
    private String sortBy;
    private String sortDirection;
} 