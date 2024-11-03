"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/db";
import { useParams } from "next/navigation";

const VideoLectureProgress = () => {
  const params = useParams();
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const getViewedVideos = async (studentId: string) => {
    try {
      const viewedQuery = query(
        collection(db, "ViewedVideo"),
        where("userId", "array-contains", studentId)
      );
      const viewedSnapshot = await getDocs(viewedQuery);

      return viewedSnapshot.docs.map((doc) => doc.data().videoId);
    } catch (error) {
      console.error("Error fetching viewed video lectures:", error);
      return [];
    }
  };

  const fetchVideos = async () => {
    try {
      const videoQuery = query(collection(db, "Videos"));
      const videoSnapshot = await getDocs(videoQuery);
  
      if (!videoSnapshot.empty) {
        const studentId = Array.isArray(params?.studentId)
          ? params.studentId[0]
          : params?.studentId;
  
        const viewedVideoIds = await getViewedVideos(studentId);
        const totalVideos = videoSnapshot.docs.length;
  
        // Count the number of videos that the student has viewed
        const viewedCount = videoSnapshot.docs.filter((doc) =>
          viewedVideoIds.includes(doc.id)
        ).length;
  
        // Calculate progress as the percentage of viewed videos
        const progress = totalVideos > 0 ? (viewedCount / totalVideos) * 100 : 0;
        setOverallProgress(progress);
      }
    } catch (error) {
      console.error("Error fetching video lectures:", error);
    }
  };
  

  useEffect(() => {
    fetchVideos();
  }, [params?.studentId]);

  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-muted-foreground">
          Video Lectures Completed
        </p>
        <p className="text-2xl font-black">{overallProgress.toFixed(2)}%</p>
        <div className="w-full h-2 bg-gray-500 rounded-full mt-2">
          <div
            className="h-full bg-green-600 rounded-full"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoLectureProgress;
