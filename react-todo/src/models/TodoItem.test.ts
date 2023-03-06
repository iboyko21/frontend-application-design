import {describe, it, expect} from 'vitest';
import TodoItem from './TodoItem';

describe("A TodoItem", () => {
    it("should initialize with default values", () => {
        const item = new TodoItem();
        expect(item.complete).toBe(false);
        expect(item.text).toEqual("");
    });

    it("should initialize with specified values", () => {
        const complete = true; 
        const text = "Eat dinner";
        const id = 5;
        const item = new TodoItem({id, complete, text});
        expect(item.complete).toBe(complete);
        expect(item.text).toEqual(text);
        expect(item.id).toEqual(id);
    });

    it("should initialize with another TodoItem", () => {
        const complete = true; 
        const text = "Eat dinner";
        const id = 2;
        const item = new TodoItem({id, complete, text});
        const item1 = new TodoItem(item);

        expect(item1.complete).toEqual(item.complete);
        expect(item1.text).toEqual(item.text);
        expect(item1.id).toEqual(item.id);
    });

});