"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/db";

interface Course {
  id: string;
  name: string;
  imageUrl: string;
}

interface VideoLectures {
  id: string;
  name: string;
  imageUrl: string;
}

interface Quizzes {
  id: string;
  name: string;
  imageUrl: string;
}

interface Codes {
  id: string;
  name: string;
  imageUrl: string;
}

const Overview = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseQuery = query(collection(db, "Courses"));
        const courseSnapshot = await getDocs(courseQuery);

        if (!courseSnapshot.empty) {
          // Use `Promise.all` to handle multiple async calls to `getModules`
          const courseDocs = await Promise.all(
            courseSnapshot.docs.map(async (doc) => {
              const courseData = doc.data();

              return {
                id: doc.id,
                name: courseData.name,
                imageUrl: courseData.imageUrl,
              };
            })
          );
          setCourses(courseDocs);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  const [videoLectures, setVideoLectures] = React.useState<VideoLectures[]>([]);
  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoQuery = query(collection(db, "Videos"));
        const videoSnapshot = await getDocs(videoQuery);

        if (!videoSnapshot.empty) {
          // Use `Promise.all` to handle multiple async calls to `getModules`
          const videoDocs = await Promise.all(
            videoSnapshot.docs.map(async (doc) => {
              const videoData = doc.data();

              return {
                id: doc.id,
                name: videoData.name,
                imageUrl: videoData.imageUrl,
              };
            })
          );
          setVideoLectures(videoDocs);
        }
      } catch (error) {
        console.error("Error fetching video lectures:", error);
      }
    };

    fetchVideos();
  }, []);
  const [quizzes, setQuizzes] = React.useState<Quizzes[]>([]);
  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizQuery = query(collection(db, "Quizzes"));
        const quizSnapshot = await getDocs(quizQuery);

        if (!quizSnapshot.empty) {
          // Use `Promise.all` to handle multiple async calls to `getModules`
          const quizDocs = await Promise.all(
            quizSnapshot.docs.map(async (doc) => {
              const quizData = doc.data();

              return {
                id: doc.id,
                name: quizData.name,
                imageUrl: quizData.imageUrl,
              };
            })
          );
          setQuizzes(quizDocs);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);
  const [codes, setCodes] = React.useState<Codes[]>([]);
  React.useEffect(() => {
    const fetchCodes = async () => {
      try {
        const codesQuery = query(collection(db, "CodeChallenges"));
        const codesSnapshot = await getDocs(codesQuery);

        if (!codesSnapshot.empty) {
          // Use `Promise.all` to handle multiple async calls to `getModules`
          const codesDocs = await Promise.all(
            codesSnapshot.docs.map(async (doc) => {
              const codesData = doc.data();

              return {
                id: doc.id,
                name: codesData.name,
                imageUrl: codesData.imageUrl,
              };
            })
          );
          setCodes(codesDocs);
        }
      } catch (error) {
        console.error("Error fetching code challenges:", error);
      }
    };

    fetchCodes();
  }, []);
  return (
    <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 py-10 gap-5">
      <Card className="bg-emerald-950">
        <CardHeader>
          <CardTitle>Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{courses.length}</p>
        </CardContent>
      </Card>
      <Card className="bg-amber-950">
        <CardHeader>
          <CardTitle>Total Video Lectures</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{videoLectures.length}</p>
        </CardContent>
      </Card>
      <Card className="bg-red-950">
        <CardHeader>
          <CardTitle>Total Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{quizzes.length}</p>
        </CardContent>
      </Card>
      <Card className="bg-blue-950">
        <CardHeader>
          <CardTitle>Total Code Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{codes.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
