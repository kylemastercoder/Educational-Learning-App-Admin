import React from "react";
import VideoCreate from "./_components/video-create";
import VideoList from "./_components/video-list";
import Link from "next/link";

const Videos = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Video Lectures</h2>
        <Link href="/pages/videos/archived-videos" className="underline">
          View Archived Video Lectures &rarr;
        </Link>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 mt-5 gap-5">
        <VideoCreate />
        <VideoList />
      </div>
    </div>
  );
};

export default Videos;
