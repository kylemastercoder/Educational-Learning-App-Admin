import React from "react";
import Link from "next/link";
import ArchivedQuizList from "./archived-quiz";

const ArchivedCourses = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Archived Quizzes</h2>
        <Link href="/pages/quizzes" className="underline">View Quizzes &rarr;</Link>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        <ArchivedQuizList />
      </div>
    </div>
  );
};

export default ArchivedCourses;
