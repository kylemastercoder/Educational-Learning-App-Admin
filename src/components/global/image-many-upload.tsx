/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "../ui/button";
import { Inbox } from "lucide-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/db";
import { toast } from "sonner";

const MultipleImageUpload = ({
  onImageUpload,
  initialImageUrls = [],
}: {
  onImageUpload: (urls: string[]) => void;
  initialImageUrls?: string[];
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] =
    useState<string[]>(initialImageUrls);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);

  // Use effect to set the initial image URLs if available
  useEffect(() => {
    if (initialImageUrls.length) {
      setUploadedImageUrls(initialImageUrls); // Set existing image URLs
    }
  }, [initialImageUrls]);

  const uploadImageToFirebase = async (file: File, index: number) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `courses/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress((prev) => {
            const updatedProgress = [...prev];
            updatedProgress[index] = Math.round(progressPercent);
            return updatedProgress;
          });
          toast.loading(
            `Uploading ${file.name}: ${Math.round(progressPercent)}%`,
            {
              id: `uploadProgress-${index}`,
            }
          );
        },
        (error) => {
          toast.error(`Error uploading ${file.name}: ${error}`);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.success(`${file.name} uploaded successfully!`, {
              id: `uploadProgress-${index}`,
            });
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setSelectedImages(acceptedFiles);
      setUploading(true);
      setProgress(Array(acceptedFiles.length).fill(0));

      const urls: string[] = [];
      try {
        for (let i = 0; i < acceptedFiles.length; i++) {
          const imageUrl = await uploadImageToFirebase(acceptedFiles[i], i);
          urls.push(imageUrl);
        }
        setUploadedImageUrls((prev) => [...prev, ...urls]);
        onImageUpload([...uploadedImageUrls, ...urls]);
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error(`Error uploading images: ${error}`);
      }
      setUploading(false);
      toast.dismiss();
    },
    [onImageUpload, uploadedImageUrls]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const updatedUrls = [...uploadedImageUrls];
    updatedUrls.splice(index, 1);
    setUploadedImageUrls(updatedUrls);
    onImageUpload(updatedUrls);
    setProgress([]);
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
        <p>Drag & drop images, or click to select files</p>
      </div>

      {uploadedImageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {uploadedImageUrls.map((url, index) => (
            <div key={index} className="relative">
              <Image
                src={url}
                alt={`Uploaded image ${index + 1}`}
                width={200}
                height={200}
                className="rounded-md"
              />
              <Button
                onClick={() => removeImage(index)}
                variant="outline"
                className="absolute bg-themeBlack border-themeGray text-themeTextGray hover:bg-themeGray top-2 right-2"
              >
                Remove
              </Button>
              {uploading && progress[index] !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-themeGray h-2.5 rounded-full"
                    style={{ width: `${progress[index]}%` }}
                  ></div>
                  <p className="text-center text-sm mt-2">{progress[index]}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
