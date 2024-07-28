/* eslint-disable no-useless-catch */
import { base_url } from "@/conf";

class Todo {
  baseUrl;
  constructor() {
    this.baseUrl = base_url;
  }
  async getDirectTodo() {
    try {
      const response = await fetch(`${this.baseUrl}/todo/get`, {
        method: "get",
        credentials: "include",
      });
      console.log(response);
      const result = await response.json();
      if (!response.ok) {
        throw result.message;
      }
      return result?.data?.Todos || [];
    } catch (error) {
      throw error;
    }
  }
  async setIsImportant() {
    try {
      const response = await fetch(`${this.baseUrl}/todo/is-important`, {
        method: "patch",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

const TodoApi = new Todo();
export default TodoApi;
