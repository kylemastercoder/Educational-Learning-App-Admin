import React from "react";
import CourseList from "./_components/course-list";
import CourseCreate from "./_components/course-create";
import Link from "next/link";

const Courses = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Courses</h2>
        <Link href="/pages/courses/archived-courses" className="underline">View Archived Course &rarr;</Link>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        <CourseCreate />
        <CourseList />
      </div>
    </div>
  );
};

export default Courses;
