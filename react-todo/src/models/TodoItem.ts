import {EXT_TodoItem} from '../api/TodoApi.d';

class TodoItem {
    id: number | undefined;
    complete : boolean = false;
    text : string = "";

    constructor({id, complete, text} : {id? : number, complete?: boolean, text?: string} = {}) {
        if (typeof(id) != 'undefined') this.id = id;
        if (complete) this.complete = complete;
        if (text) this.text = text;
    }

    static fromServerObject({id, text, status} : EXT_TodoItem) {
        return new TodoItem({id, text, complete: status == "COMPLETE"})
    }

    toServerObject() : EXT_TodoItem {
        return {
            id: this.id, 
            text: this.text,
            status: this.complete ? "COMPLETE" : "INCOMPLETE"
        }
    }

    toggleComplete() {
        this.complete = !this.complete;
    }
}

export default TodoItem;