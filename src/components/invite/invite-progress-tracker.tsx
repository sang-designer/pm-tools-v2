"use client";

import { useInvite } from "@/lib/invite-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCw, Ban, UserX, Users } from "lucide-react";
import { MailPlus } from "@/components/ui/icons/mail-plus";
import { UserCheck } from "@/components/ui/icons/user-check";
import { useState } from "react";
import { Invite } from "@/lib/invite-types";
import { toast } from "sonner";

export function InviteProgressTracker() {
  const { totalSent, totalConverted, totalRevoked, recentInvites, resendInvite, revokeInvite } = useInvite();
  const conversionRate = totalSent > 0 ? Math.round((totalConverted / totalSent) * 100) : 0;

  if (recentInvites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 py-6">
        <Users className="size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No invites sent yet</p>
        <p className="text-xs text-muted-foreground/70">Invite friends to start tracking</p>
      </div>
    );
  }

  const handleResend = (inv: Invite) => {
    resendInvite(inv.id);
    toast.success(`Invite resent to ${inv.inviteeName}`);
  };

  const handleRevoke = (inv: Invite) => {
    revokeInvite(inv.id);
    toast("Invite revoked", { description: `${inv.inviteeName} can no longer join via this invite.` });
  };

  return (
    <div className="mt-2 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground">Invite Progress</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <MailPlus className="size-4 shrink-0 text-primary" />
          <div>
            <p className="text-lg font-bold text-foreground">{totalSent}</p>
            <p className="text-[10px] text-muted-foreground">Sent</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <UserCheck className="size-4 shrink-0 text-green-500" />
          <div>
            <p className="text-lg font-bold text-foreground">{totalConverted}</p>
            <p className="text-[10px] text-muted-foreground">Joined</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <UserX className="size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-lg font-bold text-foreground">{totalRevoked}</p>
            <p className="text-[10px] text-muted-foreground">Revoked</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between py-2 text-xs text-muted-foreground">
          <span>Conversion</span>
          <span>{conversionRate}%</span>
        </div>
        <Progress value={conversionRate} className="h-1.5" />
      </div>

      {recentInvites.length > 0 && (
        <div>
          <p className="mb-2 py-2 text-xs font-medium text-muted-foreground">Recent</p>
          <TooltipProvider>
            <div className="space-y-1">
              {recentInvites.slice(0, 5).map((inv) => (
                <InviteRow
                  key={inv.id}
                  invite={inv}
                  onResend={() => handleResend(inv)}
                  onRevoke={() => handleRevoke(inv)}
                />
              ))}
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

function InviteRow({
  invite,
  onResend,
  onRevoke,
}: {
  invite: Invite;
  onResend: () => void;
  onRevoke: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(invite.inviteeName)}`;

  const canActOn = invite.status === "sent" || invite.status === "opened";

  const statusConfig: Record<string, { label: string; className: string }> = {
    sent: { label: "Sent", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    opened: { label: "Opened", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
    converted: { label: "Joined", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
    revoked: { label: "Revoked", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  };

  const cfg = statusConfig[invite.status] || statusConfig.sent;

  return (
    <div className="group flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted/50 sm:py-1.5">
      <Avatar className="size-6 shrink-0">
        {!imgErr && <AvatarImage src={avatarUrl} alt={invite.inviteeName} onError={() => setImgErr(true)} />}
        <AvatarFallback className="text-[10px]">{invite.inviteeName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <span className="block truncate text-xs text-foreground">{invite.inviteeName}</span>
        {invite.resentCount > 0 && (
          <span className="text-[10px] text-muted-foreground">
            Resent {invite.resentCount}×
          </span>
        )}
      </div>

      <Badge variant="secondary" className={`shrink-0 text-[10px] ${cfg.className}`}>
        {cfg.label}
      </Badge>

      {canActOn && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={onResend}
                aria-label={`Resend invite to ${invite.inviteeName}`}
              >
                <RotateCw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Resend invite</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive"
                onClick={onRevoke}
                aria-label={`Revoke invite for ${invite.inviteeName}`}
              >
                <Ban className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Revoke invite</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
