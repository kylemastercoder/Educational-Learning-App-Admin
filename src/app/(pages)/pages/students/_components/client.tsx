"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, StudentColumn } from "./column";

interface StudentClientProps {
  data: StudentColumn[];
}

const StudentClient: React.FC<StudentClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default StudentClient;
