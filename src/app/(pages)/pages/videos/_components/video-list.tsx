/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { archiveVideo, deleteVideo, getVideos } from "@/actions/video";
import { Card } from "@/components/ui/card";
import { truncateString } from "@/lib/utils";
import {
  Loader2,
  Edit,
  EllipsisVertical,
  Trash,
  ArchiveRestore,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import parse from "html-react-parser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import CreateVideo from "@/components/forms/add-video";
import AlertModal from "@/components/ui/alert-modal";
import ArchiveModal from "@/components/ui/archive-modal";
import { Button } from "@/components/ui/button";

const VideoList = ({ user }: { user: any }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videoModal, setVideoModal] = useState(false);
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { status, videos, message } = await getVideos();
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
        title="Update Video Lectures"
        className='max-h-[600px] overflow-y-auto'
        description="Update your course for your community"
      >
        <CreateVideo initialData={selectedVideo} />
      </Modal>
    );
  }

  const generateEmbedUrl = (url: string): string => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (videoModal) {
    return (
      <Modal
        isOpen={videoModal}
        onClose={() => setVideoModal(false)}
        title="Watch Video Lectures"
        description={selectedVideo.name}
      >
        <iframe
          className="w-full h-96"
          src={generateEmbedUrl(selectedVideo.videoUrl)}
          title={selectedVideo.name}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </Modal>
    );
  }

  const onDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteVideo(selectedVideo.id);
      if (response.status === 200) {
        setDeleteModal(false);
        toast.success("Video lecture deleted successfully");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete video lecture");
      }
    } catch (error) {
      console.error("Error deleting video lecture:", error);
      toast.error("Failed to delete video lecture");
    } finally {
      setLoading(false);
    }
  };

  const onArchive = async () => {
    setLoading(true);
    try {
      const response = await archiveVideo(selectedVideo.id);
      if (response.status === 200) {
        setArchiveModal(false);
        toast.success(response.message);
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete video lectures");
      }
    } catch (error) {
      console.error("Error archiving video lectures:", error);
      toast.error("Failed to archive video lectures");
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="bg-transparent relative dark:border-themeGray border-zinc-300 h-full rounded-xl overflow-hidden">
          <img
            src={video.thumbnail}
            alt="cover"
            className="h-4/6 w-full opacity-60"
          />
          <Button
            onClick={() => {
              setSelectedVideo(video);
              setVideoModal(true);
            }}
            size="icon"
            className="absolute top-3 right-3"
          >
            <Play className="w-5 h-5" />
          </Button>
          <div className="h-2/6 flex flex-col justify-center px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg dark:text-white text-black font-semibold">
                {video.name}
              </h2>
              {user.isAdmin && (
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
                      <ArchiveRestore className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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

export default VideoList;
