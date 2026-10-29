"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TablePagination } from "@/components/ui/table-pagination";
import { ChevronRight, Link2 } from "lucide-react";
import { type ChainDetail, type ChainTranslation, getChainDetail } from "@/lib/chain-data";

type ChangeType = "Added" | "Removed" | "Modified";

interface ChainChange {
  type: ChangeType;
  country: string;
  property: string;
  oldValue: string;
  newValue: string;
}

interface ChainEdit {
  id: string;
  date: string;
  time: string;
  changes: ChainChange[];
  submittingUsers: string[];
}

const CHANGE_TYPE_CONFIG: Record<ChangeType, string> = {
  Added: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Removed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Modified: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

function findTranslation(translations: ChainTranslation[], lang: string): string | undefined {
  return translations.find((t) => t.lang === lang)?.name;
}

function buildChainHistory(chain: ChainDetail): ChainEdit[] {
  const domain = `http://www.${chain.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/`;
  const primaryCategory = chain.categories[0]?.name ?? "Category";
  const secondaryCategory = chain.categories[1]?.name ?? "Category";
  const jaName = findTranslation(chain.translations, "ja");
  const koName = findTranslation(chain.translations, "ko");
  const zhName = findTranslation(chain.translations, "zh");

  return [
    {
      id: "edit-1",
      date: "October 23, 2026",
      time: "10:14 AM",
      changes: [
        { type: "Removed", country: "United States", property: "mutations", oldValue: "None", newValue: "None" },
        { type: "Removed", country: "United States", property: "mutations", oldValue: "None", newValue: "None" },
        { type: "Removed", country: "United States", property: "validations", oldValue: "url matches '.+'", newValue: "None" },
        { type: "Removed", country: "United States", property: "validations", oldValue: "categories is equal to '[\"4bf58dd8d48988d1ca941735\"]'", newValue: "None" },
      ],
      submittingUsers: ["Mykhailo D.", "Bart V."],
    },
    {
      id: "edit-2",
      date: "August 26, 2026",
      time: "02:57 PM",
      changes: [
        { type: "Removed", country: "United States", property: "validations", oldValue: `url is equal to '${domain}'`, newValue: "None" },
        { type: "Added", country: "United States", property: "validations", oldValue: "None", newValue: "url matches '.+'" },
      ],
      submittingUsers: ["Sam Taylor"],
    },
    {
      id: "edit-3",
      date: "July 2, 2026",
      time: "04:27 PM",
      changes: [
        { type: "Added", country: "United States", property: "mutations", oldValue: "None", newValue: "None" },
        { type: "Added", country: "United States", property: "mutations", oldValue: "None", newValue: "None" },
        { type: "Added", country: "United States", property: "validations", oldValue: "None", newValue: `url is equal to '${domain}'` },
        { type: "Added", country: "United States", property: "validations", oldValue: "None", newValue: "categories is equal to '[\"4bf58dd8d48988d1ca941735\"]'" },
      ],
      submittingUsers: ["Jordan Lee"],
    },
    {
      id: "edit-4",
      date: "April 26, 2026",
      time: "10:16 PM",
      changes: [
        { type: "Added", country: "—", property: "fsqCategoryIds", oldValue: "None", newValue: primaryCategory },
        { type: "Removed", country: "—", property: "fsqCategoryIds", oldValue: secondaryCategory, newValue: "None" },
      ],
      submittingUsers: ["Priya Patel"],
    },
    ...(jaName
      ? [
          {
            id: "edit-5",
            date: "February 11, 2026",
            time: "09:03 AM",
            changes: [
              { type: "Modified" as ChangeType, country: "Japan", property: "name", oldValue: chain.name, newValue: jaName },
            ],
            submittingUsers: ["Elena Kim", "Alex Chen"],
          },
        ]
      : []),
    ...(koName
      ? [
          {
            id: "edit-6",
            date: "December 30, 2025",
            time: "06:48 PM",
            changes: [
              { type: "Added" as ChangeType, country: "South Korea", property: "validations", oldValue: "None", newValue: `name matches '${koName}.*'` },
            ],
            submittingUsers: ["David Park"],
          },
        ]
      : []),
    {
      id: "edit-7",
      date: "November 9, 2025",
      time: "01:22 PM",
      changes: [
        { type: "Modified", country: "United States", property: "hours", oldValue: "Monday 6:00 AM–11:00 PM", newValue: "Monday 24 hours" },
        { type: "Modified", country: "United States", property: "hours", oldValue: "Tuesday 6:00 AM–11:00 PM", newValue: "Tuesday 24 hours" },
      ],
      submittingUsers: ["Maria Rodriguez"],
    },
    ...(zhName
      ? [
          {
            id: "edit-8",
            date: "September 14, 2025",
            time: "08:15 AM",
            changes: [
              { type: "Removed" as ChangeType, country: "China", property: "mutations", oldValue: `name matches '${zhName}.*'`, newValue: "None" },
            ],
            submittingUsers: ["Mykhailo D."],
          },
        ]
      : []),
    {
      id: "edit-9",
      date: "June 1, 2025",
      time: "03:40 PM",
      changes: [
        { type: "Added", country: "Saudi Arabia", property: "validations", oldValue: "None", newValue: "categories is equal to '[\"4bf58dd8d48988d16e941735\"]'" },
        { type: "Added", country: "Saudi Arabia", property: "validations", oldValue: "None", newValue: "url matches '.+'" },
      ],
      submittingUsers: ["Bart V."],
    },
    {
      id: "edit-10",
      date: "March 19, 2025",
      time: "11:57 AM",
      changes: [
        { type: "Modified", country: "United States", property: "phone", oldValue: "None", newValue: "+18002447727" },
      ],
      submittingUsers: ["Sam Taylor"],
    },
  ];
}

const PAGE_SIZE = 4;

export default function ChainHistoryPage() {
  const params = useParams();
  const chainId = params.chainId as string;
  const chain = getChainDetail(chainId);
  const chainHistory = useMemo(() => buildChainHistory(chain), [chain]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(chainHistory.length / PAGE_SIZE));
  const pageEdits = chainHistory.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 if the chain changes without a full page remount.
  useEffect(() => {
    setPage(1);
  }, [chainId]);

  const handleCopyLink = (editId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/admin/chains/${chainId}/history#${editId}`);
    toast.success("Link copied");
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link href="/admin/chains" className="hover:text-foreground transition-colors">Chains</Link>
            <ChevronRight className="size-3" />
            <Link href={`/admin/chains/${chainId}`} className="hover:text-foreground transition-colors">{chain.name}</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">Edit history</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Edit history: {chain.name}</h1>
            {chain.categories[0] && (
              <p className="text-sm text-muted-foreground mt-1">{chain.categories[0].name}</p>
            )}
          </div>

          {/* Edit entries */}
          <div className="space-y-6">
            {pageEdits.map((edit) => (
              <Card key={edit.id} id={edit.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-foreground">
                      Edit on {edit.date} at {edit.time}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => handleCopyLink(edit.id)}>
                        <Link2 className="size-3.5" /> Copy link
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[110px]">Type of Change</TableHead>
                          <TableHead className="w-[140px]">Country</TableHead>
                          <TableHead className="w-[140px]">Affected Property</TableHead>
                          <TableHead>Old Value</TableHead>
                          <TableHead>New Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {edit.changes.map((change, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Badge className={`text-[11px] font-medium border-0 ${CHANGE_TYPE_CONFIG[change.type]}`}>
                                {change.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{change.country}</TableCell>
                            <TableCell className="text-sm font-medium text-foreground">{change.property}</TableCell>
                            <TableCell className={`text-sm ${change.oldValue === "None" ? "italic text-muted-foreground" : "text-foreground"}`}>
                              {change.oldValue}
                            </TableCell>
                            <TableCell className={`text-sm ${change.newValue === "None" ? "italic text-muted-foreground" : "text-foreground"}`}>
                              {change.newValue.startsWith("http") ? (
                                <a href={change.newValue} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                  {change.newValue}
                                </a>
                              ) : (
                                change.newValue
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Submitting users */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Submitting Users</span>
                    <div className="flex -space-x-2">
                      {edit.submittingUsers.map((user) => (
                        <Tooltip key={user}>
                          <TooltipTrigger asChild>
                            <Avatar className="size-8 border-2 border-background">
                              <AvatarFallback className="text-[11px] font-medium">
                                {user.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </TooltipProvider>
  );
}
