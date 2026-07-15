"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";

interface Override {
  geoid: string;
  lang: string;
  name: string;
  date: string;
  user: string;
}

const MOCK_OVERRIDES: Override[] = [
  { geoid: "72057594041111811", lang: "uk", name: "Тірана", date: "Jul 13, 2026 09:32:33", user: "Mykhailo D." },
  { geoid: "72057594038662011", lang: "pl", name: "Saloniki", date: "Jul 13, 2026 09:25:12", user: "Mykhailo D." },
  { geoid: "72057594044625737", lang: "uk", name: "Центральна Македонія", date: "Jul 13, 2026 09:24:44", user: "Mykhailo D." },
  { geoid: "72057594038662011", lang: "uk", name: "Салоніки", date: "Jul 13, 2026 09:24:26", user: "Mykhailo D." },
  { geoid: "72057594046061768", lang: "uk", name: "Санторіні", date: "Jul 13, 2026 09:21:00", user: "Mykhailo D." },
  { geoid: "72057594038188032", lang: "uk", name: "Ханья", date: "Jul 13, 2026 08:52:34", user: "Mykhailo D." },
  { geoid: "72057594038188050", lang: "uk", name: "Ханья", date: "Jul 13, 2026 08:52:22", user: "Mykhailo D." },
  { geoid: "72057594041050712", lang: "nl", name: "l'Estartit", date: "Jun 18, 2026 15:27:28", user: "Bart V." },
  { geoid: "72057594041050712", lang: "es", name: "Estartit", date: "Jun 18, 2026 15:27:16", user: "Bart V." },
  { geoid: "72057594041050712", lang: "ca", name: "l'Estartit", date: "Jun 18, 2026 15:26:41", user: "Bart V." },
  { geoid: "72057594040714679", lang: "fr", name: "Mont-Saint-Amand", date: "Jun 13, 2026 22:55:47", user: "Bart V." },
  { geoid: "72057594040714679", lang: "nl", name: "Sint-Amandsberg", date: "Jun 13, 2026 22:55:06", user: "Bart V." },
  { geoid: "72057594044620633", lang: "nl", name: "Georgioupoli", date: "Jun 7, 2026 21:02:45", user: "Bart V." },
  { geoid: "72057594044620633", lang: "de", name: "Georgioupoli", date: "Jun 7, 2026 21:02:28", user: "Bart V." },
  { geoid: "72057594039066894", lang: "nl", name: "Kaboel", date: "Jun 7, 2026 20:56:42", user: "Bart V." },
  { geoid: "72057594039066893", lang: "nl", name: "Provincie Kaboel", date: "Jun 7, 2026 20:56:29", user: "Bart V." },
  { geoid: "72057594039066893", lang: "fr", name: "Province de Kaboul", date: "Jun 7, 2026 20:55:48", user: "Bart V." },
  { geoid: "72057594039066893", lang: "es", name: "Provincia de Kabul", date: "Jun 7, 2026 20:55:19", user: "Bart V." },
  { geoid: "72057594039066893", lang: "de", name: "Provinz Kabul", date: "Jun 7, 2026 20:55:01", user: "Bart V." },
  { geoid: "72057594039066893", lang: "en", name: "Kabul Province", date: "Jun 7, 2026 20:53:39", user: "Bart V." },
];

const TOTAL = 14021;
const PER_PAGE = 20;

export default function GeonameOverridesPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(TOTAL / PER_PAGE);

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
          <h1 className="text-2xl font-bold text-foreground">Geoname Overrides</h1>
          <p className="mt-1 text-sm text-muted-foreground">Total: {TOTAL.toLocaleString()}</p>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">geoid</TableHead>
                <TableHead className="w-[60px]">lang</TableHead>
                <TableHead>name</TableHead>
                <TableHead className="w-[200px]">date</TableHead>
                <TableHead className="w-[120px]">user</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_OVERRIDES.map((override, i) => (
                <TableRow key={`${override.geoid}-${override.lang}-${i}`} className={i === 0 ? "bg-primary/5" : ""}>
                  <TableCell className="font-mono text-sm">{override.geoid}</TableCell>
                  <TableCell className="font-medium">{override.lang}</TableCell>
                  <TableCell className="font-medium">{override.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{override.date}</TableCell>
                  <TableCell>
                    <a href="#" className="text-primary hover:underline text-sm">{override.user}</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
