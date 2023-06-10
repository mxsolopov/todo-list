import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

dotenv.config()
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mongoose.Promise = global.Promise
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URI, {})
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to the database")
})
mongoose.connection.on("error", () => {
  throw new Error(`Unable to connect to database`)
})

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
})

const Todo = mongoose.model("Todo", todoSchema)

app.use(express.json())
app.use(cors())

// Получение всех задач
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find()
    res.json(todos)
  } catch (error) {
    console.error("Error getting todos:", error)
    res.status(500).json({ error: "Error getting todos" })
  }
})

// Создание новой задачи
app.post("/api/todos", async (req, res) => {
  const { title, completed } = req.body

  try {
    const todo = new Todo({
      title,
      completed,
    })

    const savedTodo = await todo.save()
    res.json(savedTodo)
  } catch (error) {
    console.error("Error creating todo:", error)
    res.status(500).json({ error: "Error creating todo" })
  }
})

// Обновление задачи
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params
  const { title, completed } = req.body

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    )
    res.json(updatedTodo)
  } catch (error) {
    console.error("Error updating todo:", error)
    res.status(500).json({ error: "Error updating todo" })
  }
})

// Удаление задачи
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params

  try {
    await Todo.findByIdAndDelete(id)
    res.json({ message: "Todo deleted" })
  } catch (error) {
    console.error("Error deleting todo:", error)
    res.status(500).json({ error: "Error deleting todo" })
  }
})

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
