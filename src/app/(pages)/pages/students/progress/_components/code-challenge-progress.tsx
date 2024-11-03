"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/db";
import { useParams } from "next/navigation";

const CodeChallengeProgress = () => {
  const params = useParams();
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const getViewedCode = async (studentId: string) => {
    try {
      const viewedQuery = query(
        collection(db, "ViewedCode"),
        where("userId", "array-contains", studentId)
      );
      const viewedSnapshot = await getDocs(viewedQuery);

      return viewedSnapshot.docs.map((doc) => doc.data().codeId);
    } catch (error) {
      console.error("Error fetching code challenges:", error);
      return [];
    }
  };

  const fetchCode = async () => {
    try {
      const codeQuery = query(collection(db, "CodeChallenges"));
      const codeSnapshot = await getDocs(codeQuery);

      if (!codeSnapshot.empty) {
        const studentId = Array.isArray(params?.studentId)
          ? params.studentId[0]
          : params?.studentId;

        const viewedCodeIds = await getViewedCode(studentId);
        const totalCode = codeSnapshot.docs.length;

        const viewedCount = codeSnapshot.docs.filter((doc) =>
          viewedCodeIds.includes(doc.id)
        ).length;

        const progress = totalCode > 0 ? (viewedCount / totalCode) * 100 : 0;
        setOverallProgress(progress);
      }
    } catch (error) {
      console.error("Error fetching code challenges:", error);
    }
  };

  useEffect(() => {
    fetchCode();
  }, [params?.studentId]);
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-muted-foreground">
          Code Challenge Completed
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

export default CodeChallengeProgress;
