import { TodoListItem } from "./TodoListItem";

export function TodoList(todoItems, updateItem) {
    const div = document.createElement('div');
    div.className = "TodoList"
    for (let i = 0; i < todoItems.length; i++) {
        const item = todoItems[i];
        item.toggleComplete = () => {
            item.complete = !item.complete;
            updateItem(i, item);
        }
        div.appendChild(TodoListItem(item));
    }
    return div;
}