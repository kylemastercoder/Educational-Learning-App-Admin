"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, InstructorColumn } from "./column";

interface InstructorClientProps {
  data: InstructorColumn[];
}

const InstructorClient: React.FC<InstructorClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default InstructorClient;
