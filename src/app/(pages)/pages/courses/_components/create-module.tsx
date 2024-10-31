/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getModules } from "@/actions/course";
import AddModule from "@/components/forms/add-module";
import { GlassModal } from "@/components/global/glass-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CreateCourseModuleProps = {
  courseId: string;
};

type Module = {
  id: string;
  name: string;
  moduleNumber: number;
};

export const CreateCourseModule = ({ courseId }: CreateCourseModuleProps) => {
  const [sortedModules, setSortedModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const { status, modules, message } = await getModules(courseId);
        if (status === 200 && Array.isArray(modules)) {
          const validModules = modules.filter((module: any): module is Module => 
            module.id && module.name && typeof module.moduleNumber === 'number'
          );
          const sorted = [...validModules].sort((a, b) => {
            if (a.moduleNumber === 1) return -1;
            if (b.moduleNumber === 1) return 1;
            return a.moduleNumber - b.moduleNumber;
          });
          setSortedModules(sorted);
        } else {
          toast.error(message || "Failed to load topics.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching topics.");
      }
      setLoading(false);
    };

    fetchModules();
  }, [courseId]);

  const BASE_URL = `http://localhost:3000/pages/courses/${courseId}`;

  return (
    <div className="flex flex-col">
      <GlassModal
        className="max-h-screen overflow-auto"
        title="Create a new topic for your course"
        description="Topics are a great way to organize your module content."
        trigger={
          <div className="flex flex-col gap-y-2">
            <Button
              variant="outline"
              className="flex items-center bg-themeBlack hover:bg-themeDarkGray"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Topic
            </Button>
          </div>
        }
      >
        <AddModule courseId={courseId} />
      </GlassModal>
      {loading && (
        <div className="flex items-center m-auto mt-20">
          <Loader2 size={20} className="animate-spin" />
        </div>
      )}
      {sortedModules.map((module) => (
        <Link
          key={module.id}
          href={`${BASE_URL}/modules/${module.id}`}
          className={cn(
            "flex items-center mt-3 bg-themeBlack hover:bg-themeDarkGray justify-center py-2 rounded-md",
            // Apply a different background if the current path matches the module
            params?.moduleId === module.id ? "bg-themeDarkGray" : ""
          )}
        >
          {module.name}
        </Link>
      ))}
    </div>
  );
};
