"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getFriends as fetchFriends,
  getTransactions as fetchTransactions,
  addFriend as addFriendAction,
  removeFriend as removeFriendAction,
  addTransaction as addTransactionAction,
  updateTransaction as updateTransactionAction,
  deleteTransaction as deleteTransactionAction,
  searchFriendSuggestions,
  type SpliteaseTransaction,
} from "@/app/actions/splitease";
import { getProfile, setProfile } from "@/app/actions/profile";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitType: "equal" | "custom";
  splitAmong: string[];
  customSplits: Record<string, number>;
  date: string;
  createdBy?: string;
};

function toTransaction(t: SpliteaseTransaction): Transaction {
  return {
    id: t.id,
    description: t.description,
    amount: t.amount,
    paidBy: t.paid_by,
    splitType: t.split_type,
    splitAmong: t.split_among,
    customSplits: t.custom_splits,
    date: t.date,
    createdBy: t.created_by,
  };
}

const AVATAR_COLORS = [
  "#5b4cdb",
  "#e74c8b",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function computeBalances(
  friends: string[],
  transactions: Transaction[]
): Record<string, number> {
  const balances: Record<string, number> = {};
  friends.forEach((f) => {
    balances[f] = 0;
  });

  transactions.forEach((tx) => {
    const { paidBy, amount, splitAmong, splitType, customSplits } = tx;

    if (splitType === "custom") {
      splitAmong.forEach((person) => {
        const share = customSplits[person] || 0;
        if (person === paidBy) {
          balances[paidBy] += amount - share;
        } else {
          balances[paidBy] += share;
          balances[person] -= share;
        }
      });
    } else {
      const share = amount / splitAmong.length;
      splitAmong.forEach((person) => {
        if (person === paidBy) return;
        balances[paidBy] += share;
        balances[person] -= share;
      });
    }
  });

  return balances;
}

function computeSettlements(balances: Record<string, number>) {
  const debtors: { name: string; amount: number }[] = [];
  const creditors: { name: string; amount: number }[] = [];

  Object.entries(balances).forEach(([name, bal]) => {
    if (bal > 0.01) creditors.push({ name, amount: bal });
    else if (bal < -0.01) debtors.push({ name, amount: -bal });
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: { from: string; to: string; amount: number }[] = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    if (amount > 0.01) {
      settlements.push({
        from: debtors[i].name,
        to: creditors[j].name,
        amount: Math.round(amount * 100) / 100,
      });
    }
    debtors[i].amount -= amount;
    creditors[j].amount -= amount;
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
}

export default function SplitEasePage() {
  const [friends, setFriends] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [newFriend, setNewFriend] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; source: "friend" | "user" }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profileSetup, setProfileSetup] = useState<"loading" | "prompt" | "done">("loading");
  const [profileInput, setProfileInput] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [friendsData, txData, profile] = await Promise.all([
        fetchFriends(),
        fetchTransactions(),
        getProfile(),
      ]);
      setFriends(friendsData.map((f) => f.name));
      setTransactions(txData.map(toTransaction));
      setDisplayName(profile);
      setProfileSetup(profile ? "done" : "prompt");
    } catch (err) {
      console.error(err);
      setProfileSetup("done");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Search suggestions when user types
  useEffect(() => {
    if (!newFriend.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const results = await searchFriendSuggestions(newFriend);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [newFriend]);

  const addFriend = async () => {
    const trimmed = newFriend.trim();
    if (!trimmed) return;
    if (friends.some((f) => f.toLowerCase() === trimmed.toLowerCase())) {
      alert("Friend already exists!");
      return;
    }
    try {
      await addFriendAction(trimmed);
      setNewFriend("");
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add friend");
    }
  };

  const removeFriend = async (name: string) => {
    const usedInTx = transactions.some(
      (tx) => tx.paidBy === name || tx.splitAmong.includes(name)
    );
    if (usedInTx) {
      alert(
        `Cannot remove "${name}" — they are part of existing transactions. Delete those transactions first.`
      );
      return;
    }
    try {
      await removeFriendAction(name);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove friend");
    }
  };

  const saveTx = async (tx: Transaction) => {
    const payload = {
      description: tx.description,
      amount: tx.amount,
      paid_by: tx.paidBy,
      split_type: tx.splitType,
      split_among: tx.splitAmong,
      custom_splits: tx.customSplits,
      date: tx.date,
    };
    try {
      if (editingTx) {
        await updateTransactionAction(tx.id, payload);
      } else {
        await addTransactionAction(payload);
      }
      setEditingTx(null);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save transaction");
    }
  };

  const deleteTx = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransactionAction(id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete transaction");
    }
  };

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const participants = [...new Set([...friends, ...transactions.flatMap((t) => [t.paidBy, ...t.splitAmong])])];
  const balances = computeBalances(participants, transactions);
  const settlements = computeSettlements(balances);

  const saveProfile = async () => {
    const name = profileInput.trim();
    if (!name) return;
    setProfileSaving(true);
    try {
      await setProfile(name);
      setDisplayName(name);
      setProfileSetup("done");
      setProfileInput("");
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save. Run migration 002 if you haven't.");
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (profileSetup === "prompt") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
              ← Back
            </Link>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">SplitEase</h1>
            <div className="w-14 sm:w-20" />
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="mb-2 text-xl font-semibold text-foreground">Set your display name</h2>
            <p className="mb-6 text-sm text-muted">
              This name is used when others add you to transactions. You can change it later.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={profileInput}
                onChange={(e) => setProfileInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                placeholder="e.g. Subha"
                className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <button
                onClick={saveProfile}
                disabled={profileSaving || !profileInput.trim()}
                className="rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
              >
                {profileSaving ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setProfileSetup("done")}
                className="text-sm text-muted hover:text-foreground"
              >
                Skip for now
              </button>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/apps"
            className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent"
          >
            ← Back
          </Link>
          <div className="text-center flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground sm:text-xl">SplitEase</h1>
            <p className="text-xs text-muted truncate">
              Split expenses with friends
            </p>
          </div>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      {(friends.length > 0 || transactions.length > 0) && (
        <div className="mx-auto flex max-w-4xl justify-center gap-4 sm:gap-8 border-b border-border bg-surface/30 px-4 py-4 sm:px-6">
          <div className="text-center">
            <span className="block text-xl font-bold text-accent">
              {friends.length}
            </span>
            <span className="text-xs text-muted">Friends</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-accent">
              {transactions.length}
            </span>
            <span className="text-xs text-muted">Transactions</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-accent">
              ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-muted">Total Spent</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
          {/* Friends sidebar */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </span>
              Friends
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                {friends.length}
              </span>
            </h2>
            <div className="relative mb-4 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search or add friend..."
                  value={newFriend}
                  onChange={(e) => setNewFriend(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addFriend();
                    if (e.key === "Escape") setShowSuggestions(false);
                  }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg">
                    {suggestions.map((s) => (
                      <li key={s.name}>
                        <button
                          type="button"
                          onClick={async () => {
                            setShowSuggestions(false);
                            setNewFriend("");
                            if (friends.some((f) => f.toLowerCase() === s.name.toLowerCase())) return;
                            try {
                              await addFriendAction(s.name);
                              await loadData();
                            } catch {
                              // Already exists or error
                              await loadData();
                            }
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-accent/10"
                        >
                          <span>{s.name}</span>
                          {s.source === "user" && (
                            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                              App user
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={addFriend}
                disabled={!newFriend.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {friends.length === 0 ? (
              <p className="text-sm text-muted">Add friends to start splitting!</p>
            ) : (
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li
                    key={friend}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
                      style={{ background: getColor(friend) }}
                    >
                      {friend.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm text-foreground">
                      {friend}
                    </span>
                    <button
                      onClick={() => removeFriend(friend)}
                      className="rounded p-1 text-muted hover:bg-red-500/20 hover:text-red-400"
                      title="Remove friend"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-6">
            <AddTransactionForm
              friends={friends}
              onSave={saveTx}
              editingTx={editingTx}
              onCancelEdit={() => setEditingTx(null)}
            />
            <BalanceSummary balances={balances} settlements={settlements} />
            <TransactionList
              transactions={transactions}
              onEdit={setEditingTx}
              onDelete={deleteTx}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function AddTransactionForm({
  friends,
  onSave,
  editingTx,
  onCancelEdit,
}: {
  friends: string[];
  onSave: (tx: Transaction) => void;
  editingTx: Transaction | null;
  onCancelEdit: () => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTx) {
      setDescription(editingTx.description);
      setAmount(String(editingTx.amount));
      setPaidBy(editingTx.paidBy);
      setSplitType(editingTx.splitType || "equal");
      setSplitAmong(editingTx.splitAmong);
      const cs: Record<string, string> = {};
      Object.entries(editingTx.customSplits || {}).forEach(([k, v]) => {
        cs[k] = String(v);
      });
      setCustomSplits(cs);
    }
  }, [editingTx]);

  useEffect(() => {
    if (!editingTx && friends.length > 0 && !paidBy) setPaidBy(friends[0]);
  }, [friends, editingTx, paidBy]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy(friends[0] || "");
    setSplitType("equal");
    setSplitAmong([]);
    setCustomSplits({});
  };

  const toggleFriend = (friend: string) => {
    setSplitAmong((prev) =>
      prev.includes(friend) ? prev.filter((f) => f !== friend) : [...prev, friend]
    );
  };

  const selectAll = () => {
    setSplitAmong(splitAmong.length === friends.length ? [] : [...friends]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !paidBy || splitAmong.length === 0) {
      alert("Please fill all fields and select at least one person to split with.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (splitType === "custom") {
      const total = splitAmong.reduce(
        (sum, f) => sum + (parseFloat(customSplits[f]) || 0),
        0
      );
      if (Math.abs(total - parsedAmount) > 0.01) {
        alert(
          `Custom splits must add up to ₹${parsedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}. Current total: ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
        );
        return;
      }
    }
    const customSplitsNum: Record<string, number> = {};
    if (splitType === "custom") {
      splitAmong.forEach((f) => {
        customSplitsNum[f] = parseFloat(customSplits[f]) || 0;
      });
    }
    const tx: Transaction = {
      id: editingTx ? editingTx.id : crypto.randomUUID(),
      description: description.trim(),
      amount: parsedAmount,
      paidBy,
      splitType,
      splitAmong: [...splitAmong],
      customSplits: customSplitsNum,
      date: editingTx ? editingTx.date : new Date().toISOString(),
    };
    onSave(tx);
    resetForm();
  };

  if (friends.length < 2) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Add Transaction
        </h2>
        <p className="text-muted">Add at least 2 friends to start adding transactions.</p>
      </div>
    );
  }

  const equalShare =
    splitAmong.length > 0 ? (parseFloat(amount) || 0) / splitAmong.length : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {editingTx ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted">Description</label>
            <input
              type="text"
              placeholder="e.g. Dinner, Uber..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Paid by</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none"
          >
            {friends.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted">Split type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSplitType("equal")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                splitType === "equal"
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              Equal
            </button>
            <button
              type="button"
              onClick={() => setSplitType("custom")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                splitType === "custom"
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              Custom
            </button>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-muted">Split among</label>
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-accent hover:underline"
            >
              {splitAmong.length === friends.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {friends.map((friend) => (
              <div
                key={friend}
                className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 ${
                  splitAmong.includes(friend)
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background/50"
                }`}
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={splitAmong.includes(friend)}
                    onChange={() => toggleFriend(friend)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">{friend}</span>
                </label>
                {splitType === "custom" && splitAmong.includes(friend) && (
                  <input
                    type="number"
                    placeholder="0"
                    step="0.01"
                    className="w-20 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
                    value={customSplits[friend] || ""}
                    onChange={(e) =>
                      setCustomSplits((p) => ({ ...p, [friend]: e.target.value }))
                    }
                  />
                )}
                {splitType === "equal" &&
                  splitAmong.includes(friend) &&
                  amount && (
                    <span className="text-xs text-accent">
                      ₹{equalShare.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {editingTx && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light"
          >
            {editingTx ? "Update" : "Add"} Transaction
          </button>
        </div>
      </form>
    </div>
  );
}

function BalanceSummary({
  balances,
  settlements,
}: {
  balances: Record<string, number>;
  settlements: { from: string; to: string; amount: number }[];
}) {
  const entries = Object.entries(balances);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Balances & Settlements
      </h2>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([name, bal]) => {
          const isPositive = bal > 0.01;
          const isNegative = bal < -0.01;
          return (
            <div
              key={name}
              className={`rounded-lg border p-3 ${
                isPositive
                  ? "border-green-500/30 bg-green-500/10"
                  : isNegative
                    ? "border-red-500/30 bg-red-500/10"
                    : "border-border bg-background/50"
              }`}
            >
              <span className="block text-sm font-medium text-foreground">
                {name}
              </span>
              <span
                className={`text-lg font-bold ${
                  isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-muted"
                }`}
              >
                {isPositive && "+"}₹{Math.abs(bal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="block text-xs text-muted">
                {isPositive ? "gets back" : isNegative ? "owes" : "settled"}
              </span>
            </div>
          );
        })}
      </div>
      {settlements.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Suggested Settlements
          </h3>
          <ul className="space-y-2">
            {settlements.map((s, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-4 py-3"
              >
                <span className="text-foreground">{s.from}</span>
                <span className="flex items-center gap-1 text-accent">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  ₹{s.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-foreground">{s.to}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted">Everyone is settled up!</p>
      )}
    </div>
  );
}

function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Transactions
        </h2>
        <p className="text-muted">No transactions yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Transactions ({transactions.length})
      </h2>
      <ul className="space-y-3">
        {sorted.map((tx) => {
          const splitInfo =
            tx.splitType === "equal"
              ? `Split equally among ${tx.splitAmong.length}`
              : `Custom split among ${tx.splitAmong.length}`;
          return (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/50 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {tx.description}
                  </span>
                  <span className="font-semibold text-accent">
                    ₹{tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Paid by <strong>{tx.paidBy}</strong> · {splitInfo} ·{" "}
                  {formatDate(tx.date)}
                  {tx.createdBy && (
                    <span className="ml-1 rounded bg-accent/10 px-1.5 py-0.5 text-accent">
                      Added by {tx.createdBy}
                    </span>
                  )}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tx.splitAmong.map((n) => (
                    <span
                      key={n}
                      className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              {!tx.createdBy && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(tx)}
                    className="rounded p-2 text-muted hover:bg-accent/20 hover:text-accent"
                    title="Edit"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="rounded p-2 text-muted hover:bg-red-500/20 hover:text-red-400"
                    title="Delete"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
