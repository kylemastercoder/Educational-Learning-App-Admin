"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/db";
import { QuizModal } from "./_components/quiz-modal";

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

interface Students {
  id: string;
  name: string;
}

const Overview = () => {
  const [open, setOpen] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseQuery = query(
          collection(db, "Courses"),
          where("isArchive", "==", false)
        );
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
          console.log("Courses:", courseDocs); // Log courses
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
        const videoQuery = query(
          collection(db, "Videos"),
          where("isArchive", "==", false)
        );
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
        const quizQuery = query(
          collection(db, "Quizzes"),
          where("isArchive", "==", false)
        );
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
        const codesQuery = query(
          collection(db, "CodeChallenges"),
          where("isArchive", "==", false)
        );
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
  const [students, setStudents] = React.useState<Students[]>([]);
  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsQuery = query(collection(db, "Users"));
        const studentsSnapshot = await getDocs(studentsQuery);

        if (!studentsSnapshot.empty) {
          const studentsDocs = await Promise.all(
            studentsSnapshot.docs.map(async (doc) => {
              const studentsData = doc.data();

              return {
                id: doc.id,
                name: studentsData.name,
              };
            })
          );
          setStudents(studentsDocs);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <QuizModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Total Quizzes"
        description=""
      />
      <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 py-10 gap-5">
        <Card className="bg-emerald-950 text-white">
          <CardHeader>
            <CardTitle>Total Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-950 text-white">
          <CardHeader>
            <CardTitle>Total Video Lectures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{videoLectures.length}</p>
          </CardContent>
        </Card>
        <Card onClick={() => setOpen(true)} className="bg-red-950 text-white cursor-pointer">
          <CardHeader>
            <CardTitle>Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{quizzes.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-950 text-white">
          <CardHeader>
            <CardTitle>Total Code Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{codes.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-pink-950 text-white">
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Overview;
