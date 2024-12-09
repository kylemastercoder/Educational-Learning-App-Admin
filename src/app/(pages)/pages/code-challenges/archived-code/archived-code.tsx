/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import {
  Edit,
  EllipsisVertical,
  Loader2,
  RotateCcw,
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
import { Modal } from "@/components/ui/modal";
import AlertModal from "@/components/ui/alert-modal";
import ArchiveModal from "@/components/ui/archive-modal";
import parse from "html-react-parser";
import { truncateString } from "@/lib/utils";
import { deleteCode, getArchivedCode, retrieveCode } from "@/actions/code";
import CreateCode from "@/components/forms/add-code";

const ArchivedCodeList = () => {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const { status, codes, message } = await getArchivedCode();
      if (status === 200) {
        if (codes) {
          setCodes(codes);
        }
      } else {
        toast.error(message || "Failed to load archived code challenges.");
      }
      setLoading(false);
    };

    fetchQuizzes();
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
        title="Update Code Challenges"
        description="Update your code challenges for your community"
      >
        <CreateCode initialData={selectedCode} />
      </Modal>
    );
  }

  const onDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteCode(selectedCode.id);
      if (response.status === 200) {
        setDeleteModal(false);
        toast.success("Code challenges deleted successfully");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete code challenges");
      }
    } catch (error) {
      console.error("Error deleting code challenges:", error);
      toast.error("Failed to delete code challenges");
    } finally {
      setLoading(false);
    }
  };

  const onArchive = async () => {
    setLoading(true);
    try {
      const response = await retrieveCode(selectedCode.id);
      if (response.status === 200) {
        setArchiveModal(false);
        toast.success(response.message);
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to retrieve code challenges");
      }
    } catch (error) {
      console.error("Error retrieving code challenges:", error);
      toast.error("Failed to retrieve code challenges");
    } finally {
      setLoading(false);
    }
  };

  if (!codes.length) {
    return (
      <div className="flex items-center">
        <p className="text-lg text-themeTextGray">
          No archived code challenges available
        </p>
      </div>
    );
  }

  return codes.map((code) => (
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
      <div key={code.id}>
        <Card className="bg-transparent dark:border-themeGray border-zinc-300 h-full rounded-xl overflow-hidden">
          <img
            src={code.thumbnail}
            alt="cover"
            className="h-[300px] w-full object-contain opacity-60"
          />
          <div className="flex flex-col justify-center px-5 py-2">
            <div className="flex justify-between items-center pb-3">
              <h2 className="text-lg dark:text-white text-black font-semibold">
                {code.title}
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCode(code); // Set the selected code data
                      setEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCode(code); // Set the selected code data
                      setDeleteModal(true);
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCode(code);
                      setArchiveModal(true);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retrieve
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm dark:text-themeTextGray text-zinc-700">
              {parse(truncateString(code.description))}
            </p>
          </div>
        </Card>
      </div>
    </>
  ));
};

export default ArchivedCodeList;
