"use client";

import Link from "next/link";
import { Vote, MapPin, Megaphone, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/lib/notification-data";

export const NOTIFICATION_TYPE_ICON: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  vote_status: Vote,
  new_location: MapPin,
  product_news: Megaphone,
  leaderboard: TrendingUp,
};

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  vote_status: "Vote/Review status",
  new_location: "New location",
  product_news: "Product news",
  leaderboard: "Leaderboard",
};

function getIcon(notification: AppNotification) {
  if (notification.type === "vote_status") {
    if (notification.status === "approved") return CheckCircle2;
    if (notification.status === "rejected") return XCircle;
    if (notification.status === "pending") return Clock;
  }
  return NOTIFICATION_TYPE_ICON[notification.type];
}

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function NotificationRow({
  notification,
  onRead,
  compact = true,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
  compact?: boolean;
}) {
  const Icon = getIcon(notification);
  const content = (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
        !notification.read && "bg-primary/5"
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
        <Icon className="size-4 text-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{notification.title}</p>
        <p className={cn("mt-0.5 text-xs text-muted-foreground", compact && "line-clamp-2")}>
          {notification.body}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
    </div>
  );

  if (notification.href) {
    return (
      <Link href={notification.href} className="block">
        {content}
      </Link>
    );
  }
  return <button className="block w-full">{content}</button>;
}
