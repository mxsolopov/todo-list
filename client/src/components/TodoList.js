import React from "react"

const TodoList = ({ todos, handleDelete, handleUpdate }) => {

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo._id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => handleUpdate(todo._id, e.target.checked)}
          />
          {todo.title}
          <button onClick={() => handleDelete(todo._id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList
