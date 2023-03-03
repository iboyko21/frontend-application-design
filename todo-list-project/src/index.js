import { VDOM } from "./VirtualDom";
import TodoApp from "./TodoApp";
import "./TodoApp.css";

document.body.innerHTML = `<div id="root"></div>`;
VDOM.mount('root', TodoApp);