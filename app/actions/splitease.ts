"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SpliteaseFriend = { id: string; name: string };
export type SpliteaseTransaction = {
  id: string;
  description: string;
  amount: number;
  paid_by: string;
  split_type: "equal" | "custom";
  split_among: string[];
  custom_splits: Record<string, number>;
  date: string;
  user_id?: string;
  created_by?: string; // display_name of creator (when different from current user)
};

export async function searchFriendSuggestions(
  query: string
): Promise<{ name: string; source: "friend" | "user" }[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !query.trim()) return [];

  const q = query.trim().toLowerCase();
  const results: { name: string; source: "friend" | "user" }[] = [];

  // 1. Current user's friends that match
  const { data: friends } = await supabase
    .from("splitease_friends")
    .select("name")
    .eq("user_id", user.id)
    .ilike("name", `%${q}%`)
    .limit(5);

  if (friends) {
    friends.forEach((f) => results.push({ name: f.name, source: "friend" }));
  }

  // 2. Other app users (profiles) that match - exclude self
  const { data: profiles } = await supabase
    .from("profiles")
    .select("display_name")
    .ilike("display_name", `%${q}%`)
    .neq("user_id", user.id)
    .limit(5);

  if (profiles && profiles.length > 0) {
    const existingNames = new Set(results.map((r) => r.name.toLowerCase()));
    profiles.forEach((p) => {
      if (p.display_name && !existingNames.has(p.display_name.toLowerCase())) {
        results.push({ name: p.display_name, source: "user" });
        existingNames.add(p.display_name.toLowerCase());
      }
    });
  }

  return results.slice(0, 8);
}

export async function getFriends(): Promise<SpliteaseFriend[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("splitease_friends")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function addFriend(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("splitease_friends").insert({
    user_id: user.id,
    name: name.trim(),
  });

  if (error) throw error;
  revalidatePath("/apps/splitease");
}

export async function removeFriend(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("splitease_friends")
    .delete()
    .eq("user_id", user.id)
    .eq("name", name);

  if (error) throw error;
  revalidatePath("/apps/splitease");
}

export async function getTransactions(): Promise<SpliteaseTransaction[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // RLS allows: own transactions + transactions where user is in paid_by or split_among
  const { data, error } = await supabase
    .from("splitease_transactions")
    .select("id, description, amount, paid_by, split_type, split_among, custom_splits, date, user_id")
    .order("date", { ascending: false });

  if (error) throw error;

  // Fetch creator names for transactions from other users
  const otherUserIds = [...new Set((data ?? []).map((r) => r.user_id).filter((id) => id !== user.id))];
  let creatorNames: Record<string, string> = {};
  if (otherUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", otherUserIds);
    if (profiles) {
      profiles.forEach((p) => {
        creatorNames[p.user_id] = p.display_name;
      });
    }
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    paid_by: row.paid_by,
    split_type: row.split_type,
    split_among: (row.split_among as string[]) ?? [],
    custom_splits: (row.custom_splits as Record<string, number>) ?? {},
    date: row.date,
    created_by: row.user_id !== user.id ? creatorNames[row.user_id] : undefined,
  }));
}

export async function addTransaction(tx: Omit<SpliteaseTransaction, "id">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("splitease_transactions").insert({
    user_id: user.id,
    description: tx.description,
    amount: tx.amount,
    paid_by: tx.paid_by,
    split_type: tx.split_type,
    split_among: tx.split_among,
    custom_splits: tx.custom_splits,
    date: tx.date,
  });

  if (error) throw error;
  revalidatePath("/apps/splitease");
}

export async function updateTransaction(
  id: string,
  tx: Omit<SpliteaseTransaction, "id">
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("splitease_transactions")
    .update({
      description: tx.description,
      amount: tx.amount,
      paid_by: tx.paid_by,
      split_type: tx.split_type,
      split_among: tx.split_among,
      custom_splits: tx.custom_splits,
      date: tx.date,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/apps/splitease");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("splitease_transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/apps/splitease");
}
