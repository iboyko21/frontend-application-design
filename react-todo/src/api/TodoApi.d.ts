export interface EXT_TodoItem {
    id? : number;  // The payload to update item does not require an id
    text : string;    
    status : "INCOMPLETE" | "INPROGRESS" | "COMPLETE";
}

export interface EXT_TodoList {
    id : number; 
    name : string;
    items? : EXT_TodoItem[];
}