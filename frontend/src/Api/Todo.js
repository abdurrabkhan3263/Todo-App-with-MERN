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
  async getLists() {
    try {
      const response = await fetch(`${this.baseUrl}/list`, {
        method: "GET",
        headers: {
          "Content-Types": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw result?.message || "Something went wrong";
      return result.data?.lists || [];
    } catch (error) {
      throw error;
    }
  }

  // DELETING

  async deleteLists(id) {
    try {
      const response = await fetch(`${this.baseUrl}/list/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw result?.message || "Something went wrong";
      return result;
    } catch (error) {
      throw error;
    }
  }

  // PUTTING AND PATCH THE DATA

  async createTodo(data) {
    try {
      const response = await fetch(`${this.baseUrl}/todo/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw result?.message || "Something went wrong";
      return result;
    } catch (error) {
      throw error;
    }
  }
  async setIsImportant(id) {
    try {
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
  async updateList(id, data) {
    console.log("hello");
    try {
      const response = await fetch(`${this.baseUrl}/list/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw result.message || "Something went wrong";
      return result;
    } catch (error) {
      throw error;
    }
  }
  async createList(data) {
    try {
      const response = await fetch(`${this.baseUrl}/list/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw result?.message || "Something went wrong";
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const TodoApi = new Todo();
export default TodoApi;
