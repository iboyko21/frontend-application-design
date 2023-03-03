import { TodoList } from "./TodoList";
import { TodoListItemCreator } from "./TodoListItemCreator";
import { VDOM } from "./VirtualDom";

const todoItems = [
    {complete: true, text: "This is complete"},
    {complete: false, text: "This is NOT complete"}
];

const addItem = (text) => {
    const item = {complete: false, text}
    todoItems.push(item);
    // console.log(todoItems);
    VDOM.refresh();
}

const updateItem = (i, item) => {
    todoItems[i] = item;
    VDOM.refresh();
}

function TodoApp() {
    const div = document.createElement('div');
    div.appendChild(TodoListItemCreator(addItem));
    div.appendChild(TodoList(todoItems,updateItem));
    return div;
}

export default TodoApp;