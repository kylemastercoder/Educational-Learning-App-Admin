"use client";

import Heading from "@/components/ui/heading";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getStudents } from "@/actions/students";
import { Loader2 } from "lucide-react";
import { StudentColumn } from "./_components/column";
import StudentClient from "./_components/client";

type Student = {
  id: string;
  name: string;
  email: string;
  profile: string;
  age: string;
  birthdate: string;
  course: string;
  block: string;
  gender: string;
  studentNumber: string;
  username: string;
  status: string;
};

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { status, students, message } = await getStudents();
      if (status === 200) {
        if (students) {
          setStudents(students);
        }
      } else {
        toast.error(message || "Failed to load students.");
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center m-auto mt-20">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );
  }

  const formattedStudents: StudentColumn[] = students.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    profile: item.profile,
    age: item.age,
    birthdate: item.birthdate,
    course: item.course,
    block: item.block,
    gender: item.gender,
    studentNumber: item.studentNumber,
    status: item.status,
    username: item.username,
  }));
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Student Records`}
          description="Here's a list of your students in your application."
        />
      </div>
      <StudentClient data={formattedStudents} />
    </div>
  );
};

export default Students;
