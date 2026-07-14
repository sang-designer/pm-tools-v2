"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, X, Eye } from "lucide-react";
import Link from "next/link";

export default function ManageWatchlistsPage() {
  const [watchlists, setWatchlists] = useState([
    { id: "wl-1", name: "watchedlist", itemCount: 12 },
  ]);
  const [newName, setNewName] = useState("");

  const addWatchlist = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      setWatchlists((prev) => [...prev, { id: `wl-${Date.now()}`, name: trimmed, itemCount: 0 }]);
      setNewName("");
    }
  };

  const removeWatchlist = (id: string) => {
    setWatchlists((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="size-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Manage Watchlists</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your watchlists to track changes to specific locations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Watchlists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="New watchlist name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWatchlist()}
                className="max-w-sm"
              />
              <Button onClick={addWatchlist}>
                <Plus className="size-4 mr-1.5" /> Add
              </Button>
            </div>

            <Separator />

            {watchlists.length > 0 ? (
              <div className="space-y-2">
                {watchlists.map((wl) => (
                  <div key={wl.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Eye className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{wl.name}</span>
                      <Badge variant="secondary" className="text-xs">{wl.itemCount} items</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeWatchlist(wl.id)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Eye className="size-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No watchlists yet. Create one to start tracking locations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
