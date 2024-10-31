/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import CallToAction from "./_components/call-to-action";
import { toast } from "sonner";
import { getCourses } from "@/actions/course";
import { getYouTubeVideoId, truncateString } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Loader2, NotebookIcon } from "lucide-react";
import { getVideos } from "@/actions/video";
import parse from "html-react-parser";

const LandingPage = () => {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [videos, setVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { status, courses, message } = await getCourses();
      if (status === 200 && courses) {
        setCourses(courses);
      } else {
        toast.error(message || "Failed to load courses.");
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  React.useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { status, videos, message } = await getVideos();
      if (status === 200 && videos) {
        setVideos(videos);
      } else {
        toast.error(message || "Failed to load video lectures.");
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);
  return (
    <main className="md:px-10 py-20 flex flex-col gap-36">
      <div>
        <CallToAction />
      </div>
      {/* COURSES */}
      <section>
        <p className="text-3xl font-bold text-center">Modules Offered</p>
        <div>
          {loading ? (
            <Loader2
              size={50}
              className="animate-spin text-center justify-self-center mt-5 flex items-center justify-center mx-auto"
            />
          ) : (
            <div className="grid grid-cols-3 mt-5 gap-5">
              {courses.map((course) => (
                <div key={course.id}>
                  <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt="cover"
                      className="h-[60%] w-full opacity-60"
                    />
                    <div className="h-[40%] flex flex-col justify-center px-5">
                      <h2 className="text-lg text-white font-semibold">
                        {course.name}
                      </h2>
                      <div className="flex items-center gap-1 mt-1 mb-1">
                        <NotebookIcon className="w-4 h-4" />
                        <p className="text-sm text-white ">
                          {course.moduleCount || 0} topics
                        </p>
                      </div>

                      <p className="text-sm text-themeTextGray">
                        {truncateString(course.description)}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* VIDEO LECTURES */}
      <section>
        <p className="text-3xl font-bold text-center">
         Video Lectures
        </p>
        <div>
          {loading ? (
            <Loader2
              size={50}
              className="animate-spin text-center justify-self-center mt-5 flex items-center justify-center mx-auto"
            />
          ) : (
            <div className="grid grid-cols-3 mt-5 gap-5">
              {videos.map((video) => (
                <div key={video.id}>
                  <Card className="bg-transparent border-themeGray h-[400px] rounded-xl overflow-hidden">
                    {/* Video Player */}
                    <div className="h-[70%]">
                      {video.method === "local" ? (
                        <video
                          controls
                          className="w-full h-full"
                          src={video.videoUrl}
                        />
                      ) : (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                            video.videoUrl
                          )}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                    <div className="h-[30%] flex flex-col justify-center px-5">
                      <h2 className="text-lg text-white font-semibold">
                        {video.name}
                      </h2>
                      <p className="text-sm text-themeTextGray">
                        {parse(truncateString(video.description))}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
