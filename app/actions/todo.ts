"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TodoItem = { id: string; text: string; done: boolean };

export async function getTodos(): Promise<TodoItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("todo_items")
    .select("id, text, done")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    text: row.text,
    done: row.done,
  }));
}

export async function addTodo(text: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("todo_items").insert({
    user_id: user.id,
    text: text.trim(),
    done: false,
  });

  if (error) throw error;
  revalidatePath("/apps/todo");
}

export async function toggleTodo(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: row } = await supabase
    .from("todo_items")
    .select("done")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!row) return;

  const { error } = await supabase
    .from("todo_items")
    .update({ done: !row.done })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/apps/todo");
}

export async function removeTodo(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("todo_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/apps/todo");
}
