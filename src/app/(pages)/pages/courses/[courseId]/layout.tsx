import { onAuthenticatedUser } from "@/actions/auth";
import { CreateCourseModule } from "../_components/create-module";

type CourseLayoutProps = {
  params: {
    courseId: string;
  };
  children: React.ReactNode;
};

const CourseLayout = async ({ params, children }: CourseLayoutProps) => {
  const user = await onAuthenticatedUser();
  return (
    <>
      <div className="grid grid-cols-1 h-full lg:grid-cols-4 overflow-hidden">
        <div className="dark:bg-themeBlack bg-zinc-200 p-5 overflow-y-auto">
          <CreateCourseModule user={user} courseId={params.courseId} />
        </div>
        <div className="lg:col-span-3 max-h-full h-full pb-10 overflow-y-auto dark:bg-[#101011]/90 bg-white/90">
          {children}
        </div>
      </div>
    </>
  );
};

export default CourseLayout;
