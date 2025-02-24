/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  onToggleComplete: (todo: Todo) => void;
  isUpdating: boolean;
  onSave: (id: number, title: string) => Promise<void>;
  onError: (message: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  isDeleting,
  onToggleComplete,
  isUpdating,
  onSave,
  onError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
        setIsEditing(false); // Close only on successful deletion
      } catch (error: unknown) {
        console.error('Error deleting todo:', error);
        onError('Unable to delete a todo');
        setIsEditing(true); // Ensure edit mode stays active on failure
        setEditTitle(''); // Reflect the empty state
        // Keep input focused after failure
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }, 0);
      } finally {
        setIsLoading(false); // Hide loader regardless of success or failure
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);
    try {
      await onSave(todo.id, trimmedTitle);
      setIsEditing(false); // Close on successful save
    } catch (error: unknown) {
      console.error('Error saving todo:', error);
      onError('Unable to update a todo');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      setIsLoading(false); // Hide loader regardless of success or failure
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          disabled={isUpdating}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={handleInputChange}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          ref={inputRef}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting || isUpdating || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
