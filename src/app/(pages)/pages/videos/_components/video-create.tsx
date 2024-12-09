"use client";
import CreateVideo from "@/components/forms/add-video";
import { GlassModal } from "@/components/global/glass-modal";
import { Card, CardContent } from "@/components/ui/card";
import { BadgePlus } from "lucide-react";

const VideoCreate = () => {
  return (
    <GlassModal
      title="Create a new video lectures"
      description="Add a new form for your community"
      trigger={
        <span>
          <Card className="dark:bg-[#101011] bg-zinc-100 dark:border-themeGray border-zinc-300 dark:hover:bg-themeBlack hover:bg-zinc-300 transition duration-100 cursor-pointer border-dashed aspect-square rounded-xl">
            <CardContent className="opacity-20 flex gap-x-2 p-0 justify-center items-center h-full">
              <BadgePlus />
              <p className="text-black dark:text-white">Create Video Lectures</p>
            </CardContent>
          </Card>
        </span>
      }
    >
      <CreateVideo />
    </GlassModal>
  );
};

export default VideoCreate;
