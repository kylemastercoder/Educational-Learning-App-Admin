/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { getModules } from "@/actions/course";
import { Empty } from "@/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import parse from "html-react-parser";
import { Loader2 } from "lucide-react";

type ModulePageProps = {
  params: {
    courseId: string;
    moduleId: string;
  };
};

const ModulePage = ({ params }: ModulePageProps) => {
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      try {
        const { status, modules } = await getModules(params.courseId);
        if (status === 200) {
          const selectedModule = modules?.find(
            (mod: any) => mod.id === params.moduleId
          );
          setModule(selectedModule || null);
        } else {
          toast.error("Failed to load module.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the module.");
      }
      setLoading(false);
    };

    fetchModule();
  }, [params.courseId, params.moduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center m-auto h-screen">
        <Loader2 size={100} className="animate-spin" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex justify-center h-full items-center">
        <Empty />
      </div>
    );
  }

  return (
    <div className="flex p-5 flex-col">
      <p className="text-2xl font-bold">{module.name}</p>
      <div className="mt-3">{parse(module.content)}</div>
    </div>
  );
};

export default ModulePage;
