import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

const API_BASE = 'http://localhost:3001';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserAndTodos(token);
    }
  }, []);

  const fetchUserAndTodos = async (token: string) => {
    try {
      // Fetch user info
      const userResponse = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch todos
        const todosResponse = await fetch(`${API_BASE}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (todosResponse.ok) {
          const todosData = await todosResponse.json();
          setTodos(todosData);
        }
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        setUser(null);
        setTodos([]);
      }
    } catch (err) {
      setError('Failed to fetch user data');
      localStorage.removeItem('token');
      setUser(null);
      setTodos([]);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setError('');
        fetchUserAndTodos(data.token);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTodos([]);
  };



  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const todo = await response.json();
        setTodos([...todos, todo]);
        setNewTodo({ title: '', description: '' });
      }
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const updateTodo = async (todo: Todo) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/items/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todo),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
        setEditingTodo(null);
      }
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setTodos(todos.filter(t => t.id !== id));
      }
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const toggleComplete = (todo: Todo) => {
    updateTodo({ ...todo, completed: !todo.completed });
  };

  if (!user) {
    return (
      <div className="App">
        <div className="login-container">
          <h1>Todo App Login</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={login}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>Use: admin / password</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Todo App</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="todo-form">
        <h2>Add New Todo</h2>
        <form onSubmit={createTodo}>
          <input
            type="text"
            placeholder="Todo title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          />
          <button type="submit">Add Todo</button>
        </form>
      </div>

      <div className="todos-list">
        <h2>Your Todos</h2>
        {todos.length === 0 ? (
          <p>No todos yet. Create your first one!</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingTodo?.id === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editingTodo.description}
                    onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                  />
                  <button onClick={() => updateTodo(editingTodo)}>Save</button>
                  <button onClick={() => setEditingTodo(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <small>Created: {new Date(todo.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => toggleComplete(todo)}>
                      {todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => setEditingTodo(todo)}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
