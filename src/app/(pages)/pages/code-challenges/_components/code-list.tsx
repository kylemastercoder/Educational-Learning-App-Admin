/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { Loader2, Edit, EllipsisVertical, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { deleteCode, getCodes } from "@/actions/code";
import parse from "html-react-parser";
import { truncateString } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import CreateCode from "@/components/forms/add-code";
import AlertModal from "@/components/ui/alert-modal";

const CodeList = () => {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      const { status, codes, message } = await getCodes();
      if (status === 200) {
        if (codes) {
          setCodes(codes);
        }
      } else {
        toast.error(message || "Failed to load code challenges.");
      }
      setLoading(false);
    };

    fetchCodes();
  }, []);

  const thumbnailUrl =
    "https://picsum.photos/800/600?random=" + Math.floor(Math.random() * 1000);

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
        toast.success("Code challenge deleted successfully");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete code challenge");
      }
    } catch (error) {
      console.error("Error deleting code challenge:", error);
      toast.error("Failed to delete code challenge");
    } finally {
      setLoading(false);
    }
  };

  return codes.map((code) => (
    <>
     <AlertModal
        isOpen={deleteModal}
        loading={loading}
        onClose={() => setDeleteModal(false)}
        onConfirm={onDelete}
      />
      <div key={code.id}>
        <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden">
          {/* Video Player */}
          <div className="">
            <Image
              src={thumbnailUrl}
              alt="Code Challenge Thumbnail"
              width={800}
              height={600}
            />
          </div>
          <div className="flex flex-col justify-center px-5 mt-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-white font-semibold">{code.title}</h2>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-themeTextGray">
              {parse(truncateString(code.description))}
            </p>
          </div>
        </Card>
      </div>
    </>
  ));
};

export default CodeList;
