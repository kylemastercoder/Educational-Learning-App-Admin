/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { archiveCourse, deleteCourse, getCourses } from "@/actions/course";
import { Card } from "@/components/ui/card";
import { truncateString } from "@/lib/utils";
import {
  ArchiveRestore,
  Edit,
  EllipsisVertical,
  Loader2,
  Notebook,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateCourse from "@/components/forms/add-course";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import AlertModal from "@/components/ui/alert-modal";
import ArchiveModal from "@/components/ui/archive-modal";

const CourseList = ({ user }: { user: any }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { status, courses, message } = await getCourses();
      if (status === 200) {
        if (courses) {
          console.log(courses);
          setCourses(courses);
        }
      } else {
        toast.error(message || "Failed to load module.");
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="flex items-center m-auto mt-20">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );

  if (editModal) {
    return (
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Update Module"
        description="Update your module for your community"
      >
        <CreateCourse initialData={selectedCourse} /> {/* Pass isEditMode */}
      </Modal>
    );
  }

  const onDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteCourse(selectedCourse.id);
      if (response.status === 200) {
        setDeleteModal(false);
        toast.success("Module deleted successfully");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete module");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Failed to delete module");
    } finally {
      setLoading(false);
    }
  };

  const onArchive = async () => {
    setLoading(true);
    try {
      const response = await archiveCourse(selectedCourse.id);
      if (response.status === 200) {
        setArchiveModal(false);
        toast.success(response.message);
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error archiving course:", error);
      toast.error("Failed to archive course");
    } finally {
      setLoading(false);
    }
  };

  return courses.map((course) => (
    <>
      <AlertModal
        isOpen={deleteModal}
        loading={loading}
        onClose={() => setDeleteModal(false)}
        onConfirm={onDelete}
      />
      <ArchiveModal
        isOpen={archiveModal}
        loading={loading}
        onClose={() => setArchiveModal(false)}
        onConfirm={onArchive}
      />
      <div key={course.id}>
        <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden">
          <img
            src={course.imageUrl}
            alt="cover"
            className="h-4/6 w-full opacity-60"
          />
          <div className="h-2/6 flex flex-col justify-center px-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-white font-semibold">
                {course.name}
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin ? (
                    <>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/pages/courses/${course.id}`)
                        }
                      >
                        <Notebook className="w-4 h-4 mr-2" />
                        Create Topic
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCourse(course); // Set the selected course data
                          setEditModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCourse(course); // Set the selected course data
                          setDeleteModal(true);
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCourse(course);
                          setArchiveModal(true);
                        }}
                      >
                        <ArchiveRestore className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push(`/pages/courses/${course.id}`)}
                    >
                      <Notebook className="w-4 h-4 mr-2" />
                      View Topics
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-themeTextGray">
              {truncateString(course.description)}
            </p>
          </div>
        </Card>
      </div>
    </>
  ));
};

export default CourseList;
