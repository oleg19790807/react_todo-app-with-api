import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from '../components/TodoItem'; // Import the updated TodoItem

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingTodoId: number | null;
  onToggleComplete: (todo: Todo) => void;
  updatingTodoId: number | null;
  onSave: (id: number, title: string) => Promise<void>;
  onError: (message: string) => void; // Add onError prop
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  deletingTodoId,
  onToggleComplete,
  updatingTodoId,
  onSave,
  onError,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isDeleting={deletingTodoId === todo.id}
        onToggleComplete={onToggleComplete}
        isUpdating={updatingTodoId === todo.id}
        onSave={onSave}
        onError={onError} // Pass the onError prop down to TodoItem
      />
    ))}
  </>
);
