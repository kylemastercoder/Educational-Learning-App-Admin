import React from "react";
import CodeCreate from "./_components/code-create";
import CodeList from "./_components/code-list";

const CodeChallenges = () => {
  return (
    <div className="container grid lg:grid-cols-2 2xl:grid-cols-3 py-10 gap-5">
      <CodeCreate />
      <CodeList />
    </div>
  );
};

export default CodeChallenges;
