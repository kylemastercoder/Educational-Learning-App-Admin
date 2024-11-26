"use client";

import Heading from "@/components/ui/heading";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InstructorColumn } from "./_components/column";
import InstructorClient from "./_components/client";
import { getInstructors } from "@/actions/instructors";

type Instructor = {
  id: string;
  username: string;
  image: string;
};

const Instructors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      const { status, instructors, message } = await getInstructors();
      if (status === 200) {
        if (instructors) {
          setInstructors(instructors);
        }
      } else {
        toast.error(message || "Failed to load instructors.");
      }
      setLoading(false);
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center m-auto mt-20">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );
  }

  const formattedInstructors: InstructorColumn[] = instructors.map((item) => ({
    id: item.id,
    name: item.username,
    image: item.image,
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Instructor Records`}
          description="Here's a list of your instructors in your application."
        />
      </div>
      <InstructorClient data={formattedInstructors} />
    </div>
  );
};

export default Instructors;
