import CreateCourse from "@/components/forms/add-course";

const GroupCreatePage = async () => {
  return (
    <>
      <div className="flex flex-col">
        <h5 className="font-bold text-base text-themeTextWhite">
          Course Details
        </h5>
        <p className="text-themeTextGray leading-tight">
          Create your course by adding essential details, including the course
          title, description, objectives, and content outline.
        </p>
      </div>
      <CreateCourse />
    </>
  );
};

export default GroupCreatePage;
