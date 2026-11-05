"use client";

import { useMemo, useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/ui/table-pagination";
import { CheckCheck } from "lucide-react";
import { useNotifications } from "@/lib/notification-context";
import { NotificationRow, NOTIFICATION_TYPE_LABEL } from "@/components/notifications/notification-row";
import type { NotificationType } from "@/lib/notification-data";

const FILTERS: Array<{ value: NotificationType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "vote_status", label: NOTIFICATION_TYPE_LABEL.vote_status },
  { value: "new_location", label: NOTIFICATION_TYPE_LABEL.new_location },
  { value: "leaderboard", label: NOTIFICATION_TYPE_LABEL.leaderboard },
  { value: "product_news", label: NOTIFICATION_TYPE_LABEL.product_news },
];

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
    return list;
  }, [notifications, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Updates on your votes and reviews, new places in your area, and product news.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllAsRead}>
              <CheckCheck className="size-3.5" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs
          value={filter}
          onValueChange={(v) => {
            setFilter(v as NotificationType | "all");
            setPage(1);
          }}
          className="mb-4"
        >
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="p-0">
            {pageItems.length === 0 ? (
              <p className="px-4 py-12 text-center text-sm text-muted-foreground">No notifications here.</p>
            ) : (
              <div className="divide-y divide-border">
                {pageItems.map((n) => (
                  <NotificationRow key={n.id} notification={n} onRead={markAsRead} compact={false} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
