/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "../ui/button";
import { Inbox } from "lucide-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/db";
import { toast } from "sonner";

const ImageUpload = ({
  onImageUpload,
  initialImageUrl, // New prop for existing image URL
}: {
  onImageUpload: (url: string) => void;
  initialImageUrl?: string; // Optional prop for initial image URL
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Use effect to set the initial image URL if available
  useEffect(() => {
    if (initialImageUrl) {
      setUploadedImageUrl(initialImageUrl); // Set existing image URL
    }
  }, [initialImageUrl]);

  const uploadImageToFirebase = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `courses/${file.name}`);
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
          toast.error(`Error uploading image: ${error}`);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.success("Image uploaded successfully!", {
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
      setSelectedImage(file);
      setUploading(true);
      setProgress(0);
      try {
        const imageUrl = await uploadImageToFirebase(file);
        setUploadedImageUrl(imageUrl);
        onImageUpload(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(`Error uploading image: ${error}`);
      }
      setUploading(false);
      toast.dismiss("uploadProgress");
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const removeImage = () => {
    setSelectedImage(null);
    setUploadedImageUrl(null);
    onImageUpload("");
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!uploadedImageUrl ? (
        <div
          {...getRootProps()}
          className={`px-5 w-full border border-dashed mt-0.5 rounded-xl cursor-pointer py-8 flex justify-center items-center flex-col ${
            isDragActive ? "bg-zinc-900" : "border-themeGray"
          } text-center cursor-pointer`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <>
              <Inbox className="w-10 h-10" />
              <p>Drag & drop an image, or click to select one</p>
            </>
          ) : (
            <>
              <Inbox className="w-10 h-10" />
              <p>Drag & drop an image, or click to select one</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <Image
            src={uploadedImageUrl}
            alt="Uploaded image"
            width={200}
            height={200}
            className="rounded-md"
          />
          <Button
            onClick={removeImage}
            variant="outline"
            className="absolute bg-themeBlack border-themeGray text-themeTextGray hover:bg-themeGray top-2 right-2"
          >
            Remove
          </Button>
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

export default ImageUpload;
