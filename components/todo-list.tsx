"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Todo {
  id: number
  text: string
}

function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <h1 className="text-2xl font-bold text-center">Todo List App</h1>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-2 text-center">
      <p>&copy; 2023 Todo List App. All rights reserved.</p>
    </footer>
  )
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo }])
      setNewTodo("")
    }
  }

  const updateTodo = (id: number, newText: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)))
    setEditingId(null)
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Todo List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter a new todo"
              />
              <Button onClick={addTodo}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li key={todo.id} className="flex items-center space-x-2">
                  {editingId === todo.id ? (
                    <Input
                      type="text"
                      value={todo.text}
                      onChange={(e) => updateTodo(todo.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-grow">{todo.text}</span>
                  )}
                  <Button variant="outline" size="icon" onClick={() => setEditingId(todo.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => deleteTodo(todo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export { TodoList }