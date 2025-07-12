import { apiService, ApiResponse } from './api';

// User interface matching the backend model
export interface User {
  id: string;
  name: string;
  profilePhoto?: string;
  location: string;
  availability: string[];
  skillsOffered: string[];
  skillsWanted: string[];
  publicProfile: boolean;
  rating?: number;
  about?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User DTO for creating/updating users
export interface UserDto {
  name: string;
  profilePhoto?: string;
  location: string;
  availability: string[];
  skillsOffered: string[];
  skillsWanted: string[];
  publicProfile: boolean;
  about?: string;
}

// Search criteria interface
export interface UserSearchDto {
  searchTerm?: string;
  skills?: string[];
  availability?: string[];
  publicProfile?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

class UserService {
  // Create a new user
  async createUser(userData: UserDto): Promise<User> {
    const response = await apiService.post<User>('/users', userData);
    return response.data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await apiService.get<User>(`/users/${id}`);
    return response.data;
  }

  // Get all public users
  async getAllUsers(): Promise<User[]> {
    const response = await apiService.get<User[]>('/users');
    return response.data;
  }

  // Search users
  async searchUsers(searchCriteria: UserSearchDto): Promise<User[]> {
    const response = await apiService.post<User[]>('/users/search', searchCriteria);
    return response.data;
  }

  // Get users by skill
  async getUsersBySkill(skill: string, type: 'offered' | 'wanted' = 'offered'): Promise<User[]> {
    const response = await apiService.get<User[]>(`/users/skill/${skill}?type=${type}`);
    return response.data;
  }

  // Get users by availability
  async getUsersByAvailability(availability: string): Promise<User[]> {
    const response = await apiService.get<User[]>(`/users/availability/${availability}`);
    return response.data;
  }

  // Toggle profile visibility
  async toggleProfileVisibility(id: string, isPublic: boolean): Promise<User> {
    const response = await apiService.patch<User>(`/users/${id}/visibility?isPublic=${isPublic}`);
    return response.data;
  }

  // Update user rating
  async updateRating(id: string, rating: number): Promise<User> {
    const response = await apiService.patch<User>(`/users/${id}/rating?rating=${rating}`);
    return response.data;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await apiService.delete<void>(`/users/${id}`);
  }
}

export const userService = new UserService(); 