import React from "react";
import CodeCreate from "./_components/code-create";
import CodeList from "./_components/code-list";
import Link from "next/link";
import { onAuthenticatedUser } from "@/actions/auth";

const CodeChallenges = async () => {
  const user = await onAuthenticatedUser();
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">
          Code Challenges
        </h2>
        {user.isAdmin && (
          <Link
            href="/pages/code-challenges/archived-code"
            className="underline"
          >
            View Archived Code Challenges &rarr;
          </Link>
        )}
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        {user.isAdmin && <CodeCreate />}
        <CodeList user={user} />
      </div>
    </div>
  );
};

export default CodeChallenges;
