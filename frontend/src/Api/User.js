import { base_url } from "@/conf";

class user {
  baseUrl;
  constructor() {
    this.baseUrl = base_url;
  }
  async getCurrentUser() {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(`${this.baseUrl}/user/user-details`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
  async logoutUser() {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(`${this.baseUrl}/user/logout`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const UserApi = new user();

export default UserApi;
