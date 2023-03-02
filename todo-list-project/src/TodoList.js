import { TodoListItem } from "./TodoListItem";

export function TodoList(todoItems) {
    const div = document.createElement('div');
    for (let i = 0; i < todoItems.length; i++) {
        const item = todoItems[i];
        div.appendChild(TodoListItem(item));
    }
    return div;
}