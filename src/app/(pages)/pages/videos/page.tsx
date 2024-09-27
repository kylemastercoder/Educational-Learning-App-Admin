import React from "react";
import VideoCreate from "./_components/video-create";
import VideoList from "./_components/video-list";

const Videos = () => {
  return (
    <div className="container grid lg:grid-cols-2 2xl:grid-cols-3 py-5 gap-5">
      <VideoCreate />
      <VideoList />
    </div>
  );
};

export default Videos;
