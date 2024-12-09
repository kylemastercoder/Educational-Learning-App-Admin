"use client";
import CreateCourse from "@/components/forms/add-course";
import { GlassModal } from "@/components/global/glass-modal";
import { Card, CardContent } from "@/components/ui/card";
import { BadgePlus } from "lucide-react";

const CourseCreate = () => {
  return (
    <GlassModal
      title="Create a new module"
      description="Add a new form for your community"
      trigger={
        <span>
          <Card className="dark:bg-[#101011] bg-zinc-100 dark:border-themeGray border-zinc-300 dark:hover:bg-themeBlack hover:bg-zinc-300 transition duration-100 cursor-pointer border-dashed aspect-square rounded-xl">
            <CardContent className="opacity-20 flex gap-x-2 p-0 justify-center items-center h-full">
              <BadgePlus />
              <p className="text-black dark:text-white">Create Module</p>
            </CardContent>
          </Card>
        </span>
      }
    >
      <CreateCourse />
    </GlassModal>
  );
};

export default CourseCreate;
