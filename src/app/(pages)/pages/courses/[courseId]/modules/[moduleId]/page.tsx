/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { deleteModule, getModules } from "@/actions/course";
import { Empty } from "@/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import parse from "html-react-parser";
import { Edit, EllipsisVertical, Loader2, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import AddModule from "@/components/forms/add-module";
import AlertModal from "@/components/ui/alert-modal";

type ModulePageProps = {
  params: {
    courseId: string;
    moduleId: string;
  };
};

const ModulePage = ({ params }: ModulePageProps) => {
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      try {
        const { status, modules } = await getModules(params.courseId);
        if (status === 200) {
          const selectedModule = modules?.find(
            (mod: any) => mod.id === params.moduleId
          );
          setModule(selectedModule || null);
        } else {
          toast.error("Failed to load module.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the module.");
      }
      setLoading(false);
    };

    fetchModule();
  }, [params.courseId, params.moduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center m-auto h-screen">
        <Loader2 size={100} className="animate-spin" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex justify-center h-full items-center">
        <Empty />
      </div>
    );
  }

  if (editModal) {
    return (
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Update Module"
        description="Update your module for your community"
      >
        <AddModule
          courseId={params.courseId}
          initialData={selectedModule}
          moduleId={params.moduleId}
        />
      </Modal>
    );
  }

  const onDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteModule(selectedModule.id);
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

  return (
    <>
      <AlertModal
        isOpen={deleteModal}
        loading={loading}
        onClose={() => setDeleteModal(false)}
        onConfirm={onDelete}
      />
      <div className="flex p-5 flex-col">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">{module.name}</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedModule(module);
                  setEditModal(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedModule(module);
                  setDeleteModal(true);
                }}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3">{parse(module.content)}</div>
      </div>
    </>
  );
};

export default ModulePage;
