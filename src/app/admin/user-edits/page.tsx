"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface UserEdit {
  id: string;
  user: string;
  date: string;
  editType: string;
  venue: string;
  venueId: string;
  status: "approved" | "pending" | "rejected";
  userSlug: string;
}

const MOCK_USER_EDITS: UserEdit[] = [
  { id: "ue-1", user: "Mykhailo D.", date: "Jul 13, 2026 09:32", editType: "Name change", venue: "Café Тірана", venueId: "v-1", status: "pending", userSlug: "mykhailo-d" },
  { id: "ue-2", user: "Bart V.", date: "Jul 13, 2026 08:15", editType: "Category edit", venue: "Georgioupoli Beach Bar", venueId: "v-2", status: "approved", userSlug: "bart-v" },
  { id: "ue-3", user: "Sam Taylor", date: "Jul 12, 2026 22:45", editType: "Address update", venue: "Tartine Bakery", venueId: "v4", status: "approved", userSlug: "sam-taylor" },
  { id: "ue-4", user: "Maria Rodriguez", date: "Jul 12, 2026 19:12", editType: "Hours update", venue: "Blue Bottle Coffee", venueId: "v5", status: "approved", userSlug: "maria-rodriguez" },
  { id: "ue-5", user: "Jordan Lee", date: "Jul 12, 2026 17:30", editType: "Photo added", venue: "Koffee", venueId: "v1", status: "approved", userSlug: "jordan-lee" },
  { id: "ue-6", user: "Mykhailo D.", date: "Jul 12, 2026 15:22", editType: "Geo translation", venue: "Салоніки Station", venueId: "v-3", status: "pending", userSlug: "mykhailo-d" },
  { id: "ue-7", user: "Bart V.", date: "Jul 12, 2026 14:08", editType: "Merge suggestion", venue: "FamilyMart → FamilyMart Express", venueId: "v-4", status: "rejected", userSlug: "bart-v" },
  { id: "ue-8", user: "Priya Patel", date: "Jul 12, 2026 11:55", editType: "Category edit", venue: "Delfina Restaurant", venueId: "v9", status: "approved", userSlug: "priya-patel" },
  { id: "ue-9", user: "Alex Chen", date: "Jul 11, 2026 23:40", editType: "Location move", venue: "Foreign Cinema", venueId: "v7", status: "approved", userSlug: "alex-chen" },
  { id: "ue-10", user: "Elena Kim", date: "Jul 11, 2026 20:18", editType: "Name change", venue: "Nopa Restaurant", venueId: "v-5", status: "pending", userSlug: "elena-kim" },
  { id: "ue-11", user: "David Park", date: "Jul 11, 2026 18:05", editType: "Hours update", venue: "Philz Coffee", venueId: "v-6", status: "approved", userSlug: "david-park" },
  { id: "ue-12", user: "Bart V.", date: "Jul 11, 2026 16:42", editType: "Address update", venue: "Mont-Saint-Amand Bakery", venueId: "v-7", status: "approved", userSlug: "bart-v" },
  { id: "ue-13", user: "Mykhailo D.", date: "Jul 11, 2026 14:30", editType: "Category edit", venue: "Ханья Beach Club", venueId: "v-8", status: "rejected", userSlug: "mykhailo-d" },
  { id: "ue-14", user: "Sam Taylor", date: "Jul 11, 2026 12:15", editType: "Photo added", venue: "Dandelion Chocolate", venueId: "v-9", status: "approved", userSlug: "sam-taylor" },
  { id: "ue-15", user: "Jordan Lee", date: "Jul 11, 2026 10:00", editType: "Geo translation", venue: "Kabul Province HQ", venueId: "v-10", status: "approved", userSlug: "jordan-lee" },
];

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function UserEditsPage() {
  const [page, setPage] = useState(1);
  const perPage = 15;
  const totalItems = 248;
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="size-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">User Edits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent edits submitted by users across all locations. Total: {totalItems} edits.
          </p>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="size-4" /> Prev
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next <ChevronRight className="size-4" />
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Edit Type</TableHead>
                <TableHead>Venue / Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USER_EDITS.map((edit) => (
                <TableRow key={edit.id}>
                  <TableCell>
                    <Link href={`/admin/user-edits/${edit.userSlug}`} className="text-primary hover:underline text-sm font-medium">{edit.user}</Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{edit.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{edit.editType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/venue/${edit.venueId}`} className="text-sm text-primary hover:underline">
                      {edit.venue}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${STATUS_STYLES[edit.status]}`}>
                      {edit.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
