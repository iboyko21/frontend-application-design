import { TodoList } from "./TodoList";
import { TodoListItemCreator } from "./TodoListItemCreator";

const todoItems = [
    {complete: true, text: "This is complete"},
    {complete: false, text: "This is NOT complete"}
];

const addItem = (text) => {
    const item = {complete: false, text}
    todoItems.push(item);
    console.log(todoItems);
}

document.body.appendChild(TodoListItemCreator(addItem));
document.body.appendChild(TodoList(todoItems));