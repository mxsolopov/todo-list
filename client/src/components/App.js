import React, { useState, useEffect } from "react"
import TodoList from "./TodoList"
import TodoForm from "./TodoForm"
import axios from "axios"

const App = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await axios.get("/api/todos")
      if (Array.isArray(response.data)) {
        setTodos(response.data)
      } else {
        console.error("Invalid data format: response.data is not an array")
      }
    } catch (error) {
      console.error("Error fetching todos:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      fetchData()
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const handleUpdate = async (id, completed) => {
    try {
      await axios.put(`/api/todos/${id}`, { completed })
      fetchData()
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  return (
    <div>
      <h1>Todo-list</h1>
      <TodoForm fetchData={fetchData} />
      <TodoList
        todos={todos}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    </div>
  )
}

export default App
