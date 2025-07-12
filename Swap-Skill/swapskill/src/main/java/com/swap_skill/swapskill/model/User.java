package com.swap_skill.swapskill.model;

import com.google.cloud.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String name;
    private String profilePhoto;
    private String location;
    private List<String> availability;
    private List<String> skillsOffered;
    private List<String> skillsWanted;
    private boolean publicProfile;
    private Double rating;
    private String about;
    private Timestamp createdAt;
    private Timestamp updatedAt;
} 