import React from "react";
import QuizCreate from "./_components/quiz-create";
import QuizList from "./_components/quiz-list";
import Link from "next/link";

const Quizzes = async () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Quizzes</h2>
        <Link href="/pages/quizzes/archived-quizzes" className="underline">
            View Archived Quizzes &rarr;
          </Link>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        <QuizCreate />
        <QuizList />
      </div>
    </div>
  );
};

export default Quizzes;
