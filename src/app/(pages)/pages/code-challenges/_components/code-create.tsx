"use client";
import CreateCode from "@/components/forms/add-code";
import { GlassModal } from "@/components/global/glass-modal";
import { Card, CardContent } from "@/components/ui/card";
import { BadgePlus } from "lucide-react";

const CodeCreate = () => {
  return (
    <GlassModal
      title="Create a new code challenge"
      description="Add a new form for your community"
      trigger={
        <span>
          <Card className="dark:bg-[#101011] bg-zinc-100 dark:border-themeGray border-zinc-300 dark:hover:bg-themeBlack hover:bg-zinc-300 transition duration-100 cursor-pointer border-dashed aspect-square rounded-xl">
            <CardContent className="opacity-20 flex gap-x-2 p-0 justify-center items-center h-full">
              <BadgePlus />
              <p>Create New Code Challenge</p>
            </CardContent>
          </Card>
        </span>
      }
    >
      <CreateCode />
    </GlassModal>
  );
};

export default CodeCreate;
