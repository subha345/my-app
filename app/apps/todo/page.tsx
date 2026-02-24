"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getTodos,
  addTodo as addTodoAction,
  toggleTodo as toggleTodoAction,
  removeTodo as removeTodoAction,
  type TodoItem,
} from "@/app/actions/todo";

export default function TodoPage() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await getTodos();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const add = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    try {
      await addTodoAction(trimmed);
      setInput("");
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add task");
    }
  };

  const toggle = async (id: string) => {
    try {
      await toggleTodoAction(id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const remove = async (id: string) => {
    try {
      await removeTodoAction(id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Todo List</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Add a task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              onClick={add}
              className="rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-light"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-4 py-3"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggle(item.id)}
                  className="h-4 w-4 rounded accent-accent"
                />
                <span
                  className={`flex-1 ${item.done ? "text-muted line-through" : "text-foreground"}`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  className="rounded p-1 text-muted hover:bg-red-500/20 hover:text-red-400"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {items.length === 0 && (
            <p className="text-center text-sm text-muted">No tasks yet. Add one above!</p>
          )}
        </div>
      </main>
    </div>
  );
}
