import TodoItem from "./TodoItem";
import TodoList from './TodoList';
import {describe, it, expect} from 'vitest';
import { EXT_TodoItem } from "../api/TodoApi.d";

describe("A TodoList", () => {

    it("should initialize with default values", () => {
        const list = new TodoList();
        expect(list.id).toBeUndefined();
        expect(list.name).toEqual("");
        expect(list.items.length).toEqual(0);
    })

    it("should initialize with specific values", () => {
        const id = 2;
        const name = "Test"
        const items = [
            new TodoItem({id: 1, text: "One"}),
            new TodoItem({id: 2, text: "Two"})
        ]
        const list = new TodoList({
            id, name, items  
        })

        expect(list.id).toEqual(id);
        expect(list.name).toEqual(name);
        expect(list.items.length).toEqual(items.length);
        for(let i = 0; i < items.length; i++) {
            expect(list.items[i]).toEqual(items[i]);
        }
    })

    it("should initialize from another todo list", () => {
        const id = 2;
        const name = "Test"
        const items = [
            new TodoItem({id: 1, text: "One"}),
            new TodoItem({id: 2, text: "Two"})
        ]
        const ogList = new TodoList({
            id, name, items  
        })

        const list = new TodoList(ogList);
        expect(list.id).toEqual(id);
        expect(list.name).toEqual(name);
        expect(list.items.length).toEqual(items.length);
        for(let i = 0; i < items.length; i++) {
            expect(list.items[i]).toEqual(items[i]);
        }
    })

    it("should initialize from a server object with items", () => {

        const serverObj = {
            id: 0,
            name: "List 0", 
            items: [
                {
                    id: 0,
                    text: "Item 0",
                    status: "INCOMPLETE"
                } as EXT_TodoItem
            ]
        }

        const list = TodoList.fromServerObject(serverObj)
        expect(list.id).toEqual(serverObj.id)
        expect(list.name).toEqual(serverObj.name)
        expect(list.items.length).toEqual(serverObj.items.length)
        for (let i =0; i < serverObj.items.length; i++) {
            expect(list.items[i].id).toEqual(serverObj.items[i].id)
            expect(list.items[i].text).toEqual(serverObj.items[i].text)
            expect(list.items[i].complete).toEqual(serverObj.items[i].status == "COMPLETE")
        }
    })

    it("should initialize from a server object without items", () => {
        const serverObj = {
            id: 0,
            name: "List 0", 
        }

        const list = TodoList.fromServerObject(serverObj)
        expect(list.id).toEqual(serverObj.id)
        expect(list.name).toEqual(serverObj.name)
    })
})