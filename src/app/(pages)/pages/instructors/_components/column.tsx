"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export type InstructorColumn = {
  id: string;
  name: string;
  image: string;
};

export const columns: ColumnDef<InstructorColumn>[] = [
  {
    accessorKey: "name",
    header: "Instructor",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <Avatar className="w-10 h-10 object-cover rounded-md">
          <AvatarImage src={row.original.image} alt={row.original.name} />
          <AvatarFallback className="rounded-md">
            {getInitials(row.original.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{row.original.name}</p>
        </div>
      </div>
    ),
  },
];
