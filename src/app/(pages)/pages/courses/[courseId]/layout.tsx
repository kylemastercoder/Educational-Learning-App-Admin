"use client";

import { CreateCourseModule } from "../_components/create-module";

type CourseLayoutProps = {
  params: {
    courseId: string;
  };
  children: React.ReactNode;
};

const CourseLayout = ({ params, children }: CourseLayoutProps) => {
  return (
    <>
      <div className="grid grid-cols-1 h-full lg:grid-cols-4 overflow-hidden">
        <div className="bg-themeBlack p-5 overflow-y-auto">
          <CreateCourseModule courseId={params.courseId} />
        </div>
        <div className="lg:col-span-3 max-h-full h-full pb-10 overflow-y-auto bg-[#101011]/90">
          {children}
        </div>
      </div>
    </>
  );
};

export default CourseLayout;
