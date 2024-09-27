import React from "react";
import QuizCreate from "./_components/quiz-create";
import QuizList from "./_components/quiz-list";

const Quizzes = () => {
  return (
    <div className="container grid lg:grid-cols-2 2xl:grid-cols-3 py-10 gap-5">
      <QuizCreate />
      <QuizList />
    </div>
  );
};

export default Quizzes;
