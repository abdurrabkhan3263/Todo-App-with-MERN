/* eslint-disable no-useless-catch */
import { base_url } from "@/conf";

class Todo {
  baseUrl;
  constructor() {
    this.baseUrl = base_url;
  }

  // GET THE DATA

  async getDirectTodo() {
    try {
      const response = await fetch(`${this.baseUrl}/todo/get`, {
        method: "get",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw result.message;
      }
      return result?.data?.Todos || [];
    } catch (error) {
      throw error;
    }
  }
  async getImportantTodo() {
    try {
      const response = await fetch(`${this.baseUrl}/todo/get-important`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw result?.message || "Something went wrong";
      return result?.data || [];
    } catch (error) {
      throw error;
    }
  }

  // PUTTING AND PATCH THE DATA

  async setIsImportant(id) {
    try {
      console.log(id);
      const response = await fetch(`${this.baseUrl}/todo/setimportant`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo_id: id }),
        credentials: "include",
        mode: "cors",
      });
      const result = await response.json();
      if (!response.ok) throw result?.message || "Something went wrong";

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const TodoApi = new Todo();
export default TodoApi;
