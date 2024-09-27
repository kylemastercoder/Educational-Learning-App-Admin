import React from "react";
import CourseList from "./_components/course-list";
import CourseCreate from "./_components/course-create";

const Courses = () => {
  return (
    <div className="container grid lg:grid-cols-2 2xl:grid-cols-3 py-10 gap-5">
      <CourseCreate />
      <CourseList />
    </div>
  );
};

export default Courses;
