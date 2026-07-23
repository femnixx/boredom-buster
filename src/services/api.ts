import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('accessToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
          details: data.details,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(email: string, username: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.accessToken);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.clearToken();
    return response;
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(data: { username?: string; avatarUrl?: string }) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getInventory() {
    return this.request('/users/me/inventory');
  }

  async equipItem(itemId: string) {
    return this.request(`/users/me/inventory/equip/${itemId}`, {
      method: 'POST',
    });
  }

  async unequipItem(slot: string) {
    return this.request(`/users/me/inventory/unequip/${slot}`, {
      method: 'POST',
    });
  }

  async getLeaderboard(type = 'LEVEL', limit = 100) {
    return this.request(`/users/leaderboard?type=${type}&limit=${limit}`);
  }

  // Quest endpoints
  async getAvailableQuests() {
    return this.request('/quests/available');
  }

  async getActiveQuests() {
    return this.request('/quests/active');
  }

  async acceptQuest(questId: string) {
    return this.request('/quests/accept', {
      method: 'POST',
      body: JSON.stringify({ questId }),
    });
  }

  async abandonQuest(questId: string) {
    return this.request('/quests/abandon', {
      method: 'POST',
      body: JSON.stringify({ questId }),
    });
  }

  async getQuestDetails(questId: string) {
    return this.request(`/quests/${questId}`);
  }

  async getQuestHistory(status?: string, limit = 20, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(status && { status }),
    });
    return this.request(`/quests/history?${params}`);
  }

  // Verification endpoints
  async submitPhotoVerification(questStepId: string, photoUrl: string, thumbnailUrl?: string) {
    return this.request('/verifications/photo', {
      method: 'POST',
      body: JSON.stringify({ questStepId, photoUrl, thumbnailUrl }),
    });
  }

  async submitTextVerification(questStepId: string, content: string) {
    return this.request('/verifications/text', {
      method: 'POST',
      body: JSON.stringify({ questStepId, content }),
    });
  }

  async getVerificationStatus(verificationId: string) {
    return this.request(`/verifications/${verificationId}/status`);
  }

  async getMyVerifications(status?: string, limit = 20, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(status && { status }),
    });
    return this.request(`/verifications?${params}`);
  }

  // Social endpoints
  async sendFriendRequest(friendId: string) {
    return this.request('/social/friends/request', {
      method: 'POST',
      body: JSON.stringify({ friendId }),
    });
  }

  async acceptFriendRequest(requestId: string) {
    return this.request(`/social/friends/accept/${requestId}`, {
      method: 'POST',
    });
  }

  async getFriends() {
    return this.request('/social/friends');
  }

  async getFriendRequests() {
    return this.request('/social/friends/requests');
  }

  async removeFriend(friendId: string) {
    return this.request(`/social/friends/${friendId}`, {
      method: 'DELETE',
    });
  }

  async createGuild(name: string, description?: string, isPublic = true) {
    return this.request('/social/guilds', {
      method: 'POST',
      body: JSON.stringify({ name, description, isPublic }),
    });
  }

  async getGuilds(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/social/guilds${params}`);
  }

  async joinGuild(guildId: string) {
    return this.request(`/social/guilds/${guildId}/join`, {
      method: 'POST',
    });
  }

  async leaveGuild(guildId: string) {
    return this.request(`/social/guilds/${guildId}/leave`, {
      method: 'POST',
    });
  }

  // Economy endpoints
  async getMarketplace(category?: string, rarity?: string, minPrice?: number, maxPrice?: number) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (rarity) params.append('rarity', rarity);
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());

    return this.request(`/economy/marketplace?${params}`);
  }

  async listItemForSale(itemId: string, price: number, currency = 'GOLD') {
    return this.request('/economy/marketplace/list', {
      method: 'POST',
      body: JSON.stringify({ itemId, price, currency }),
    });
  }

  async purchaseItem(listingId: string) {
    return this.request(`/economy/marketplace/purchase/${listingId}`, {
      method: 'POST',
    });
  }

  async cancelListing(listingId: string) {
    return this.request(`/economy/marketplace/${listingId}`, {
      method: 'DELETE',
    });
  }

  async getTransactionHistory(type?: string, currency?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(type && { type }),
      ...(currency && { currency }),
    });
    return this.request(`/economy/transactions?${params}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;