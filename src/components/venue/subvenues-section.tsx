"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface Subvenue {
  id: string;
  name: string;
  rating: number;
  address: string;
  crossStreet: string;
  image: string;
}

const MOCK_SUBVENUES: Record<string, Subvenue[]> = {
  v41: [
    { id: "sv-1", name: "Blue Bottle Coffee", rating: 8.4, address: "900 North Point St", crossStreet: "", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop" },
    { id: "sv-2", name: "Ghirardelli Ice Cream & Chocolate Shop", rating: 8.9, address: "900 North Point St #200", crossStreet: "Larkin St", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=120&h=120&fit=crop" },
    { id: "sv-3", name: "The Pub at Ghirardelli", rating: 7.6, address: "900 North Point St #105", crossStreet: "Polk St", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop" },
    { id: "sv-4", name: "Wattle Creek Winery", rating: 8.1, address: "900 North Point St #112", crossStreet: "Larkin St", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=120&h=120&fit=crop" },
    { id: "sv-5", name: "Crown & Crumpet Tea Salon", rating: 9.0, address: "900 North Point St #300", crossStreet: "Polk St", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=120&h=120&fit=crop" },
    { id: "sv-6", name: "Lori's Diner", rating: 7.8, address: "900 North Point St #106", crossStreet: "Beach St", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=120&h=120&fit=crop" },
    { id: "sv-7", name: "Biscoff Coffee Corner", rating: 8.7, address: "900 North Point St #108", crossStreet: "", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=120&fit=crop" },
    { id: "sv-8", name: "The San Francisco Brewing Co.", rating: 7.2, address: "900 North Point St #115", crossStreet: "Larkin St", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=120&h=120&fit=crop" },
  ],
};

function getRatingColor(rating: number): string {
  if (rating >= 9.0) return "bg-green-600 text-white";
  if (rating >= 7.0) return "bg-green-500 text-white";
  if (rating >= 5.0) return "bg-yellow-500 text-white";
  return "bg-red-500 text-white";
}

interface SubvenuesSectionProps {
  venueId: string;
  venueName: string;
}

export function SubvenuesSection({ venueId, venueName }: SubvenuesSectionProps) {
  const subvenues = MOCK_SUBVENUES[venueId];
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Subvenue[]>([]);

  if (!subvenues || subvenues.length === 0) return null;

  const startEdit = () => {
    setEditData(subvenues.map((s) => ({ ...s })));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData([]);
  };

  const updateField = (index: number, field: "address" | "crossStreet", value: string) => {
    setEditData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  if (editMode) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Edit Subvenue Addresses
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={cancelEdit}>
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Place</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Cross street</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editData.map((sub, i) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <Link
                      href={`/venue/${sub.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {sub.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={sub.address}
                      onChange={(e) => updateField(i, "address", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={sub.crossStreet}
                      onChange={(e) => updateField(i, "crossStreet", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Places inside {venueName}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Highest rated ({subvenues.length} places)
          </p>
        </div>
        <Button variant="outline" onClick={startEdit}>
          <Pencil className="size-3.5 mr-1.5" /> Edit Addresses
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subvenues.map((sub) => (
          <Link
            key={sub.id}
            href={`/venue/${sub.id}`}
            className="flex items-center gap-3 rounded-lg border border-border p-2.5 hover:bg-muted/40 transition-colors group"
          >
            <div className="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
              <img
                src={sub.image}
                alt={sub.name}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {sub.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground truncate">
                  {sub.address}
                  {sub.crossStreet && ` (${sub.crossStreet})`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
