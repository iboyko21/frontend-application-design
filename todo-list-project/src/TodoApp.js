import { TodoList } from "./TodoList";
import { TodoListItemCreator } from "./TodoListItemCreator";
import { myUseState } from "./VirtualDom";

// Initialize the [todoItems, setTodoItems] pair 
// with a call to myUseState passing an empty array as the initial value
const [todoItems, setTodoItems] = myUseState([]);

const addItem = (text) => {
    const item = {complete: false, text}
    todoItems.push(item);
    setTodoItems(todoItems);
}

const updateItem = (i, item) => {
    todoItems[i] = item;
    setTodoItems(todoItems);
}

function TodoApp() {
    const div = document.createElement('div');
    div.className = "TodoApp";
    div.appendChild(TodoListItemCreator(addItem));
    div.appendChild(TodoList(todoItems,updateItem));
    return div;
}

export default TodoApp;