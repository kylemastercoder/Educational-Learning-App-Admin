import React from "react";
import Link from "next/link";
import ArchivedVideoList from "./archived-videos";

const ArchivedVideos = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Archived Videos</h2>
        <Link href="/pages/videos" className="underline">View Videos &rarr;</Link>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        <ArchivedVideoList />
      </div>
    </div>
  );
};

export default ArchivedVideos;
