import React from "react";
import Link from "next/link";
import ArchivedCourseList from "./archived-course";

const ArchivedCourses = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-themeText font-semibold">Archived Modules</h2>
        <Link href="/pages/courses" className="underline">View Modules &rarr;</Link>
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
        <ArchivedCourseList />
      </div>
    </div>
  );
};

export default ArchivedCourses;
