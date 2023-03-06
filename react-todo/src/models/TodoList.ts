import TodoItem from "./TodoItem";
import { EXT_TodoList } from "../api/TodoApi.d";

 class TodoList {

    id : number | undefined;
    name: string = "";
    items: TodoItem[] = [];

    constructor(props : {id? : number, name? : string, items? : TodoItem[]} = {}) {
        if(typeof(props.id) != 'undefined') this.id = props.id;
        if(props.name) this.name = props.name;
        if(props.items) this.items = props.items;
    }

    static fromServerObject({id, name, items} : EXT_TodoList) : TodoList {
        return new TodoList({id, name, items: items?.map(i => TodoItem.fromServerObject(i))})
    }
}

export default TodoList;