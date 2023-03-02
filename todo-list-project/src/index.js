import { TodoList } from "./TodoList";
import { TodoListItemCreator } from "./TodoListItemCreator";

const todoItems = [
    {complete: true, text: "This is complete"},
    {complete:false, text: "This is NOT complete"}
];

document.body.appendChild(TodoListItemCreator());
document.body.appendChild(TodoList(todoItems));