/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { VideoSchema } from "@/constants/schema";
import { Button } from "../ui/button";
import { Loader } from "../global/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import VideoUpload from "../global/video-upload";
import { createVideo, updateVideo } from "@/actions/video";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import RichTextEditor from "../global/rich-text-editor";
import ImageUpload from "../global/image-upload";

const CreateVideo = ({ initialData }: { initialData?: any }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof VideoSchema>>({
    resolver: zodResolver(VideoSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          name: initialData?.name || "",
          description: initialData?.description || "",
          videoUrl: initialData?.videoUrl || "",
          method: initialData?.method || "local",
          thumbnail: initialData?.thumbnail || "",
        }
      : {
          name: "",
          description: "",
          videoUrl: "",
          method: "local",
          thumbnail: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof VideoSchema>) => {
    try {
      setIsPending(true);
      if (initialData) {
        const response = await updateVideo(values, initialData.id);
        if (response.status === 200) {
          toast.success("Video Lecture Updated Successfully");
          router.push("/pages/videos");
          window.location.assign("/pages/videos");
        } else if (response.status === 404) {
          toast.error(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await createVideo(values);
        if (response.status === 200) {
          toast.success("Video Lecture Created Successfully");
          router.push("/pages/videos");
          window.location.assign("/pages/videos");
        } else if (response.status === 404) {
          toast.error(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Oops! something went wrong. Try again");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form className="mt-5 max-h-[600px] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Name</FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                    placeholder="Fundamentals of C Language"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isPending}
            name="description"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Description
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    description={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mb-3">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Upload Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="local" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Local File
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="youtube" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          YouTube URL
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.getValues("method") === "local" ? (
            <FormField
              control={form.control}
              disabled={isPending}
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex flex-col gap-2">Video</FormLabel>
                  <FormControl>
                    <VideoUpload
                      onVideoUpload={(data) => field.onChange(data)}
                      existingVideoUrl={initialData?.videoUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              disabled={isPending}
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex flex-col gap-2">
                    YouTube Video URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                      placeholder="Paste YouTube URL here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            disabled={isPending}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Thumbnail</FormLabel>
                <FormControl>
                  <ImageUpload
                    onImageUpload={(data) => field.onChange(data)}
                    initialImageUrl={initialData?.videoThumbnail}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            type="submit"
            className="dark:bg-themeBlack bg-white mt-2 w-full border-themeGray rounded-xl"
          >
            <Loader loading={isPending}>
              {initialData ? "Save Changes" : "Upload Video Lecture"}
            </Loader>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateVideo;
