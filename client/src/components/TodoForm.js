import React, { useState } from "react"
import axios from "axios"

const TodoForm = ({ fetchData }) => {
  const [todoText, setTodoText] = useState("")

  const handleInputChange = (event) => {
    setTodoText(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (todoText.trim() === "") {
      return // Не добавляем пустую задачу
    }

    // Создаем новый объект задачи
    const newTodo = {
      title: todoText,
      completed: false,
    }

    // Записываем todo в базу данных
    try {
      await axios.post("/api/todos", newTodo)
      fetchData()
    } catch (error) {
      console.error("Error creating todo:", error)
    }

    // Очищаем поле ввода
    setTodoText("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={todoText}
        onChange={handleInputChange}
        placeholder="Введите задачу"
      />
      <button type="submit">Добавить</button>
    </form>
  )
}

export default TodoForm
