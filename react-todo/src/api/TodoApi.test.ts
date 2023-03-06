import {describe, it, expect} from 'vitest';
import TodoApi, {API_BASE_URL} from './TodoApi';
import nock from 'nock';
import TodoList from '../models/TodoList';
import TodoItem from '../models/TodoItem';

const scope = nock(API_BASE_URL).defaultReplyHeaders({
    'access-control-allow-origin': '*', 
    'access-control-allow-credentials': 'true'
})

describe("The TodoApi getList function", () => {
    it("should return a TodoList", async () => {
        const reply = {id: 1, name: "Test List 1", items: []}
        scope.get("/lists/1").reply(200, reply);

        const list : TodoList = await TodoApi.getList(1);
        expect(list).toBeInstanceOf(TodoList);
        expect(list.name).toEqual(reply.name);
        expect(list.id).toEqual(reply.id);
        expect(list.items).toEqual(reply.items);
    })

    it("should return a TodoList with TodoItem objects", async () => {
        const reply = {"name": "list1", "id": 0, "items": [
            {"text": "Item number 1", "id": 0, "status": "INCOMPLETE"}, 
            {"text": "Item number 2", "id": 1, "status": "COMPLETE"}
        ]};
        scope.get("/lists/0").reply(200, reply);

        const list = await TodoApi.getList(0);
        /* Check that the converted items length is the same length as the reply */ 
        expect(list.items.length).toEqual(reply.items.length);
        
        /* Loop over items and validate each item */
        for (let i = 0; i < list.items.length; i++) {
            expect(list.items[i]).toBeInstanceOf(TodoItem);
            expect(list.items[i].id).toEqual(reply.items[i].id);
            expect(list.items[i].text).toEqual(reply.items[i].text);
            if (reply.items[i].status == "COMPLETE") {
                expect(list.items[i].complete).toBe(true);
            } else {
                expect(list.items[i].complete).toBe(false);
            }
        }

    })

})

describe("The TodoApi addItem function", () => {

    it("should call the addItem endpoint and return a TodoItem", async () => {
        const newItemRequest = {text: "New Item"};
        const newItemResponse = {text: "New Item", id: 1, status: "INCOMPLETE"}

        scope.post("/lists/1/items", newItemRequest).reply(201, newItemResponse);

        const response = await TodoApi.addItem(1, "New Item");
        expect(response).toBeInstanceOf(TodoItem);
        expect(response.id).toEqual(newItemResponse.id);
        expect(response.text).toEqual(newItemResponse.text);
        expect(response.complete).toBe(false);
    })
})

describe("The TodoApi updateItem function", () => {
    
    it("should raise an error if the TodoItem does not have an id", async () => {
        const updateItem = async () => TodoApi.updateItem(1 , new TodoItem({text: "No Id"}))
        await expect(updateItem).rejects.toThrowError()
    })

    it("should call the updateItem endpoint and return a TodoItem", async () => {
        const id = 1;
        const text = "My Item";
        const status = "COMPLETE"
        const updateItemRequest = {id, text, status}
        const updateItemResponse = {id, text, status}

        scope.post("/lists/1/items/1", updateItemRequest).reply(200, updateItemResponse);

        const response = await TodoApi.updateItem(1, new TodoItem({id, text, complete: true}))
        expect(response).toBeInstanceOf(TodoItem);
    })
})

describe("The TodoApi getAllLists function", () => {

    it("should return an array of TodoList objects with empty items", async () => {
        const reply = [
            {
                id: 0,
                name: "List 0",
            },
            {
                id: 1,
                name: "List 1"
            }
        ]

        const response = scope.get('/lists').reply(200, reply);

        const lists = await TodoApi.getAllLists();

    })
})

describe("The TodoApi addList function", () => {
    it("should return a new TodoList object", async() => {
        const listName = "Test List"
        const reply = {
            id: 1,
            name: listName,
            items: []
        }

        scope.post('/lists', {name: listName}).reply(200, reply);

        const list = await TodoApi.addList(listName)
        expect(list).toBeInstanceOf(TodoList)
        expect(list.id).toEqual(reply.id)
        expect(list.name).toEqual(listName)
        expect(list.items.length).toBe(0);
        

    })
})