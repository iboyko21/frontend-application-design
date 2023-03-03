import React from "react";
import MainLayout from "./layout/MainLayout";
import TodoListView from "./views/TodoListView";

const TodoApp = () => {
    return (
        <MainLayout>
            <TodoListView />
        </MainLayout>
    );
}

export default TodoApp;