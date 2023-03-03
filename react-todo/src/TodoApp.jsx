import React from "react";
import MainLayout from "./layout/MainLayout";
import TodoListView from "./views/TodoListView";

const TodoApp = () => {
    return (
        <MainLayout>
            <TodoListView list={{name: "Grocery List"}}/>
        </MainLayout>
    );
}

export default TodoApp;