import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Inbox } from "lucide-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/db";
import { toast } from "sonner";

const VideoUpload = ({
  onVideoUpload,
  existingVideoUrl, // New prop for existing video URL
}: {
  onVideoUpload: (url: string) => void;
  existingVideoUrl?: string; // Optional prop
}) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadVideoToFirebase = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `videos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progressPercent));
          toast.loading(`Uploading: ${Math.round(progressPercent)}%`, {
            id: "uploadProgress",
          });
        },
        (error) => {
          toast.error(`Error uploading video: ${error}`);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.success("Video uploaded successfully!", {
              id: "uploadProgress",
            });
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setSelectedVideo(file);
      setUploading(true);
      setProgress(0);
      try {
        const videoUrl = await uploadVideoToFirebase(file);
        onVideoUpload(videoUrl);
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error(`Error uploading video: ${error}`);
      }
      setUploading(false);
      toast.dismiss("uploadProgress");
    },
    [onVideoUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    multiple: false,
  });

  const removeVideo = () => {
    setSelectedVideo(null);
    onVideoUpload(""); // Notify the parent component that the video is removed
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!selectedVideo && !existingVideoUrl ? (
        <div
          {...getRootProps()}
          className={`px-5 w-full border border-dashed mt-0.5 rounded-xl cursor-pointer py-8 flex justify-center items-center flex-col ${
            isDragActive ? "bg-zinc-900" : "border-themeGray"
          } text-center cursor-pointer`}
        >
          <input {...getInputProps()} />
          <Inbox className="w-10 h-10" />
          <p>Drag & drop a video, or click to select one</p>
        </div>
      ) : (
        <div className="relative">
          {existingVideoUrl ||
          (selectedVideo && URL.createObjectURL(selectedVideo)) ? (
            <video
              controls
              src={
                existingVideoUrl ||
                (selectedVideo ? URL.createObjectURL(selectedVideo) : undefined)
              }
              className="rounded-md w-48 h-48"
            />
          ) : null}
          {(existingVideoUrl || selectedVideo) && (
            <Button
              onClick={removeVideo}
              variant="outline"
              className="absolute bg-themeBlack border-themeGray text-themeTextGray hover:bg-themeGray top-2 right-2"
            >
              Remove
            </Button>
          )}
        </div>
      )}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-themeGray h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-center text-sm mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
