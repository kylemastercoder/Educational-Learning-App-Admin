import React from "react";
import CourseList from "./_components/course-list";
import CourseCreate from "./_components/course-create";
import Link from "next/link";
import { onAuthenticatedUser } from "@/actions/auth";

const Courses = async () => {
  const user = await onAuthenticatedUser();
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Modules</h2>
        {user.isAdmin && (
          <Link href="/pages/courses/archived-courses" className="underline">
            View Archived Modules &rarr;
          </Link>
        )}
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        {user.isAdmin && <CourseCreate />}
        <CourseList user={user} />
      </div>
    </div>
  );
};

export default Courses;
