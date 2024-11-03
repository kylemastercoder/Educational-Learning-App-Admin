"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/db";
import { useParams } from "next/navigation";

const QuizzesProgress = () => {
  const params = useParams();
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const getViewedQuizzes = async (studentId: string) => {
    try {
      const viewedQuery = query(
        collection(db, "ViewedQuiz"),
        where("userId", "array-contains", studentId)
      );
      const viewedSnapshot = await getDocs(viewedQuery);

      return viewedSnapshot.docs.map((doc) => doc.data().quizId);
    } catch (error) {
      console.error("Error fetching viewed quizzes:", error);
      return [];
    }
  };

  const fetchQuizzes = async () => {
    try {
      const quizQuery = query(collection(db, "Quizzes"));
      const quizSnapshot = await getDocs(quizQuery);

      if (!quizSnapshot.empty) {
        const studentId = Array.isArray(params?.studentId)
          ? params.studentId[0]
          : params?.studentId;

        const viewedQuizIds = await getViewedQuizzes(studentId);
        const totalQuizzes = quizSnapshot.docs.length;

        const viewedCount = quizSnapshot.docs.filter((doc) =>
          viewedQuizIds.includes(doc.id)
        ).length;

        // Calculate progress as the percentage of viewed videos
        const progress =
          totalQuizzes > 0 ? (viewedCount / totalQuizzes) * 100 : 0;
        setOverallProgress(progress);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [params?.studentId]);
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-muted-foreground">
          Quizzes Completed
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

export default QuizzesProgress;
