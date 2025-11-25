"use client";

import { Button } from "@/components/ui/button";
import { ImmigrationKanban } from "@/components/immigration/immigration-kanban";
import { Plus } from "lucide-react";

export const ImmigrationTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Immigration Cases</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>
      <div className="rounded-md border p-4">
        <ImmigrationKanban />
      </div>
    </div>
  );
};
