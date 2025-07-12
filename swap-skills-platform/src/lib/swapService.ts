import { apiService } from './api';

// Swap Request interface matching the backend model
export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  rating?: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Swap Request DTO for creating new requests
export interface SwapRequestDto {
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  message?: string;
}

// Swap Request with user details for display
export interface SwapRequestWithUsers extends SwapRequest {
  fromUser?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  toUser?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
}

class SwapService {
  // Create a new swap request
  async createSwapRequest(swapData: SwapRequestDto): Promise<SwapRequest> {
    const response = await apiService.post<SwapRequest>('/swaps', swapData);
    return response.data;
  }

  // Get swap request by ID
  async getSwapRequestById(id: string): Promise<SwapRequest> {
    const response = await apiService.get<SwapRequest>(`/swaps/${id}`);
    return response.data;
  }

  // Get swap requests by from user
  async getSwapRequestsByFromUser(fromUserId: string): Promise<SwapRequest[]> {
    const response = await apiService.get<SwapRequest[]>(`/swaps/from/${fromUserId}`);
    return response.data;
  }

  // Get swap requests by to user
  async getSwapRequestsByToUser(toUserId: string): Promise<SwapRequest[]> {
    const response = await apiService.get<SwapRequest[]>(`/swaps/to/${toUserId}`);
    return response.data;
  }

  // Get swap requests by status for a user
  async getSwapRequestsByStatus(userId: string, status: SwapRequest['status']): Promise<SwapRequest[]> {
    const response = await apiService.get<SwapRequest[]>(`/swaps/user/${userId}/status/${status}`);
    return response.data;
  }

  // Accept a swap request
  async acceptSwapRequest(id: string): Promise<SwapRequest> {
    const response = await apiService.patch<SwapRequest>(`/swaps/${id}/accept`);
    return response.data;
  }

  // Reject a swap request
  async rejectSwapRequest(id: string): Promise<SwapRequest> {
    const response = await apiService.patch<SwapRequest>(`/swaps/${id}/reject`);
    return response.data;
  }

  // Complete a swap request
  async completeSwapRequest(id: string): Promise<SwapRequest> {
    const response = await apiService.patch<SwapRequest>(`/swaps/${id}/complete`);
    return response.data;
  }

  // Add rating and feedback to a completed swap
  async addRatingAndFeedback(id: string, rating: number, feedback?: string): Promise<SwapRequest> {
    const params = new URLSearchParams();
    params.append('rating', rating.toString());
    if (feedback) {
      params.append('feedback', feedback);
    }
    
    const response = await apiService.patch<SwapRequest>(`/swaps/${id}/rating?${params.toString()}`);
    return response.data;
  }

  // Delete a swap request (only if pending)
  async deleteSwapRequest(id: string): Promise<void> {
    await apiService.delete<void>(`/swaps/${id}`);
  }

  // Get all swap requests for a user (both sent and received)
  async getAllSwapRequestsForUser(userId: string): Promise<SwapRequest[]> {
    const [sentRequests, receivedRequests] = await Promise.all([
      this.getSwapRequestsByFromUser(userId),
      this.getSwapRequestsByToUser(userId)
    ]);
    
    return [...sentRequests, ...receivedRequests];
  }
}

export const swapService = new SwapService(); 