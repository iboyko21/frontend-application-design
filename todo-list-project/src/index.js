import { VDOM } from "./VirtualDom";
import TodoApp from "./TodoApp";

document.body.innerHTML = `<div id="root"></div>`;
VDOM.mount('root', TodoApp);