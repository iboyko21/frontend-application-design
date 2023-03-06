import TodoItem from "../models/TodoItem";
import TodoList from "../models/TodoList";
import axios from "axios";
import { EXT_TodoList } from "./TodoApi.d";

export const API_BASE_URL="http://127.0.0.1:3000";

const axiosInstance = axios.create({baseURL: API_BASE_URL});

const TodoApi = {

    getAllLists: async () : Promise<TodoList[]> => {
        const response = await axiosInstance.get(`lists`);
        return response.data.map( (l : EXT_TodoList) => TodoList.fromServerObject(l));
    },

    getList: async (listId : number) : Promise<TodoList> => {
       const response = await axiosInstance.get(`/lists/${listId}`);
       return TodoList.fromServerObject(response.data);
    },

    addList: async (name : string) : Promise<TodoList> => {
        const response = await axiosInstance.post('/lists', {name});
        return TodoList.fromServerObject(response.data)
    },

    addItem: async (listId: number, itemText: string) : Promise<TodoItem> => {
        const response = await axiosInstance.post(`/lists/${listId}/items`, {text: itemText});
        return TodoItem.fromServerObject(response.data);
    },

    updateItem: async (listId : number, item : TodoItem ) : Promise<TodoItem> => {
        if (typeof(item.id) != 'number') {
            throw new Error("TodoItem must have an 'id' property in order to update it.")
        }
        const response = await axiosInstance.post(`/lists/${listId}/items/${item.id}`, item.toServerObject());
        return TodoItem.fromServerObject(response.data);
    }
}
export default TodoApi;