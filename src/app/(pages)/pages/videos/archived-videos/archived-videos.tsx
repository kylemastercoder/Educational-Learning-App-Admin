/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import { truncateString } from "@/lib/utils";
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
import { deleteVideo, getArchivedVideos, retrieveVideo } from "@/actions/video";
import CreateVideo from "@/components/forms/add-video";
import Image from "next/image";
import parse from "html-react-parser";

const ArchivedVideoList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { status, videos, message } = await getArchivedVideos();
      if (status === 200) {
        if (videos) {
          setVideos(videos);
        }
      } else {
        toast.error(message || "Failed to load videos.");
      }
      setLoading(false);
    };

    fetchVideos();
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
        title="Update Video"
        description="Update your video for your community"
      >
        <CreateVideo initialData={selectedVideo} />
      </Modal>
    );
  }

  const onDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteVideo(selectedVideo.id);
      if (response.status === 200) {
        setDeleteModal(false);
        toast.success("Video deleted successfully");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  const onArchive = async () => {
    setLoading(true);
    try {
      const response = await retrieveVideo(selectedVideo.id);
      if (response.status === 200) {
        setArchiveModal(false);
        toast.success(response.message);
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to retrieve video");
      }
    } catch (error) {
      console.error("Error retrieving video:", error);
      toast.error("Failed to retrieve video");
    } finally {
      setLoading(false);
    }
  };

  if (!videos.length) {
    return (
      <div className="flex items-center">
        <p className="text-lg text-themeTextGray">
          No archived videos available
        </p>
      </div>
    );
  }

  return videos.map((video) => (
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
      <div key={video.id}>
        <Card className="bg-transparent dark:border-themeGray border-zinc-300 h-full rounded-xl overflow-hidden">
          {/* Video Player */}
          <div className="h-4/6 relative w-full">
            <Image
              src={video.thumbnail}
              alt="Quiz Thumbnail"
              fill
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-2/6 flex flex-col justify-center px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg dark:text-white text-black font-semibold">{video.name}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedVideo(video); // Set the selected video data
                      setEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedVideo(video); // Set the selected video data
                      setDeleteModal(true);
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedVideo(video);
                      setArchiveModal(true);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm dark:text-themeTextGray text-zinc-700">
              {parse(truncateString(video.description))}
            </p>
          </div>
        </Card>
      </div>
    </>
  ));
};

export default ArchivedVideoList;
