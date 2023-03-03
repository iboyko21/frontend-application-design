import React from 'react';

const TodoListView = ({list}) => {
    return (
            <h2>
                {/* List is not defined */}
                {!list && "No List Selected"}

                {/* List is defined */}
                {list && list.name}
            </h2>
    );
}

export default TodoListView;