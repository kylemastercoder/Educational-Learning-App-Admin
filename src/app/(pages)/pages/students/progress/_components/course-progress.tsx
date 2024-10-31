"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/db";
import { useParams } from "next/navigation";

const CourseProgress = () => {
  const params = useParams();
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const getModules = async (courseId: string) => {
    try {
      const q = query(
        collection(db, "Modules"),
        where("courseId", "==", courseId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => doc.id);
    } catch (error) {
      console.error("Error fetching modules:", error);
      return [];
    }
  };

  const getViewedCourses = async (studentId: string) => {
    try {
      const viewedQuery = query(
        collection(db, "ViewedCourse"),
        where("userId", "array-contains", studentId)
      );
      const viewedSnapshot = await getDocs(viewedQuery);

      return viewedSnapshot.docs.map((doc) => doc.data().courseId);
    } catch (error) {
      console.error("Error fetching viewed courses:", error);
      return [];
    }
  };

  const fetchCourses = async () => {
    try {
      const courseQuery = query(collection(db, "Courses"));
      const courseSnapshot = await getDocs(courseQuery);

      if (!courseSnapshot.empty) {
        const studentId = Array.isArray(params?.studentId)
          ? params.studentId[0]
          : params?.studentId;

        const viewedCourseIds = await getViewedCourses(studentId); // Fetch viewed course IDs
        let totalProgress = 0;

        const courseDocs = await Promise.all(
          courseSnapshot.docs.map(async (doc) => {
            const courseData = doc.data();
            const courseId = doc.id;

            // Fetch all modules and viewed modules
            const totalModules = await getModules(courseId);
            const viewedModules = viewedCourseIds.includes(courseId)
              ? totalModules.length // All modules are considered viewed if courseId is in viewedCourseIds
              : 0;

            // Calculate progress for this course
            const moduleProgress =
              totalModules.length > 0
                ? (viewedModules / totalModules.length) * 100
                : 0;

            totalProgress += moduleProgress;

            return {
              id: courseId,
              name: courseData.name,
              imageUrl: courseData.imageUrl,
              moduleCount: totalModules.length,
              progress: moduleProgress,
            };
          })
        );

        // Calculate the average progress across all courses
        const averageProgress =
          courseDocs.length > 0 ? totalProgress / courseDocs.length : 0;
        setOverallProgress(averageProgress);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [params?.studentId]);
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-muted-foreground">
          Modules Completed
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

export default CourseProgress;
