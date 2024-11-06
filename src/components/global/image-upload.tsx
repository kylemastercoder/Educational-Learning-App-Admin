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
  initialImageUrl = "",
}: {
  onImageUpload: (url: string) => void;
  initialImageUrl?: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] =
    useState<string>(initialImageUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  // Use effect to set the initial image URL if available
  useEffect(() => {
    if (initialImageUrl) {
      setUploadedImageUrl(initialImageUrl);
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
          toast.loading(
            `Uploading ${file.name}: ${Math.round(progressPercent)}%`
          );
        },
        (error) => {
          toast.error(`Error uploading ${file.name}: ${error}`);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.success(`${file.name} uploaded successfully!`);
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
      toast.dismiss();
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false, // Limit to one file
  });

  const removeImage = () => {
    setUploadedImageUrl("");
    onImageUpload("");
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        {...getRootProps()}
        className={`px-5 w-full border border-dashed mt-0.5 rounded-xl cursor-pointer py-8 flex justify-center items-center flex-col ${
          isDragActive ? "bg-zinc-900" : "border-themeGray"
        } text-center cursor-pointer`}
      >
        <input {...getInputProps()} />
        <Inbox className="w-10 h-10" />
        <p>Drag & drop an image, or click to select a file</p>
      </div>

      {uploadedImageUrl && (
        <div className="relative mt-4">
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
      )}
    </div>
  );
};

export default ImageUpload;
