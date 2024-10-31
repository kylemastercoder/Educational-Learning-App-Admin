"use client";

import { getStudentById } from "@/actions/students";
import Heading from "@/components/ui/heading";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CourseProgress from "../_components/course-progress";
import VideoLectureProgress from "../_components/video-lecture-progress";
import QuizzesProgress from "../_components/quizzes-progress";
import CodeChallengeProgress from "../_components/code-challenge-progress";

type Student = {
  id: string;
  name: string;
  email: string;
  profile: string;
  age: string;
  birthdate: string;
  course: string;
  block: string;
  gender: string;
  studentNumber: string;
  username: string;
};

const ViewProgress = () => {
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const { status, student, message } = await getStudentById(
        Array.isArray(params?.studentId)
          ? params.studentId[0]
          : params?.studentId
      );

      if (status === 200 && student) {
        setStudent(student);
      } else {
        toast.error(message || "Failed to load student.");
      }
    };

    fetchStudent();
  }, [params?.studentId]);

  return (
    <div className="px-5 py-5">
      <Heading
        title={student?.name || ""}
        description={student?.course || ""}
      />
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mt-5">
        <CourseProgress />
        <VideoLectureProgress />
        <QuizzesProgress />
        <CodeChallengeProgress />
      </div>
    </div>
  );
};

export default ViewProgress;
