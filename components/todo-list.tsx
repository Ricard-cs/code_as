"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"

interface Todo {
  id: string
  text: string
  createdAt?: Date
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    setIsLoading(true)
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const todosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[]
        setTodos(todosData)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching todos:", error)
        setError("Failed to load todos")
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        setError(null)
        await addDoc(collection(db, "todos"), {
          text: newTodo,
          createdAt: new Date()
        })
        setNewTodo("")
      } catch (error) {
        setError("Failed to add todo")
        console.error("Error adding todo:", error)
      }
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const updateTodo = async (id: string) => {
    if (editText.trim() === "") return
    
    try {
      setError(null)
      const todoRef = doc(db, "todos", id)
      await updateDoc(todoRef, {
        text: editText,
        updatedAt: new Date()
      })
      setEditingId(null)
    } catch (error) {
      setError("Failed to update todo")
      console.error("Error updating todo:", error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id))
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
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
            {error && (
              <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter a new todo"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                disabled={isLoading}
              />
              <Button onClick={addTodo} disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <ul className="space-y-2">
                {todos.length === 0 ? (
                  <li className="text-center text-gray-500">No todos yet. Add one above!</li>
                ) : (
                  todos.map((todo) => (
                    <li key={todo.id} className="flex items-center space-x-2">
                      {editingId === todo.id ? (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault()
                            updateTodo(todo.id)
                          }}
                          className="flex-grow flex gap-2"
                        >
                          <Input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setEditingId(null)
                              }
                            }}
                            autoFocus
                          />
                          <Button type="submit" size="sm">Save</Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span className="flex-grow">{todo.text}</span>
                      )}
                      <Button variant="outline" size="icon" onClick={() => startEditing(todo)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export { TodoList }