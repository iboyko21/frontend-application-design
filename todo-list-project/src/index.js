// import HelloSuperhero from "./HelloSuperhero";
import { TodoListItem } from "./TodoListItem";

// document.body.appendChild(HelloSuperhero("Superman"));
document.body.appendChild(TodoListItem({complete: true, text: "This is complete"}));
document.body.appendChild(TodoListItem({complete: false, text: "This is NOT complete"}));