import { FormEvent, useEffect, useState } from "react";
import { supabase } from "./supabase";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at");

    if (error) {
      console.error(error);
      return;
    }

    setTodos(data ?? []);
  }

  async function addTodo(event: FormEvent) {
    event.preventDefault();

    if (!text.trim()) return;

    const { error } = await supabase.from("todos").insert({
      text: text.trim(),
    });

    if (error) {
      console.error(error);
      return;
    }

    setText("");
  }

  async function toggleTodo(todo: Todo) {
    const { error } = await supabase
      .from("todos")
      .update({
        completed: !todo.completed,
      })
      .eq("id", todo.id);

    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTodos();

    const channel = supabase
      .channel("todos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          fetchTodos();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main>
      <h1>Supabase Realtime Todos</h1>

      <form onSubmit={addTodo}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs to be done?"
        />

        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <button
              onClick={() => toggleTodo(todo)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.completed ? "✓" : "○"} {todo.text}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
