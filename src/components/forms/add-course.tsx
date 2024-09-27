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
import { CourseSchema } from "@/constants/schema";
import { Button } from "../ui/button";
import { Loader } from "../global/loader";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../global/image-upload";
import { createCourse, updateCourse } from "@/actions/course";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateCourse = ({ initialData }: { initialData?: any }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof CourseSchema>>({
    resolver: zodResolver(CourseSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          name: initialData?.name || "",
          description: initialData?.description || "",
          imageUrl: initialData?.imageUrl || "",
        }
      : {
          name: initialData?.name || "",
          description: initialData?.description || "",
          imageUrl: initialData?.imageUrl || "",
        },
  });

  const onSubmit = async (values: z.infer<typeof CourseSchema>) => {
    try {
      setIsPending(true);
      if (initialData) {
        const response = await updateCourse(values, initialData.id);
        if (response.status === 200) {
          toast.success("Course Updated Successfully");
          router.push("/pages/courses");
          window.location.assign("/pages/courses");
        } else if (response.status === 404) {
          toast.error(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await createCourse(values);
        if (response.status === 200) {
          toast.success("Course Created Successfully");
          router.push("/pages/courses");
          window.location.assign("/pages/courses");
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
      <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Course Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-themeBlack border-themeGray text-themeTextGray"
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
                  Course Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-themeBlack border-themeGray text-themeTextGray"
                    placeholder="Enter Course Description"
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Course Thumbnail
                </FormLabel>
                <FormControl>
                  <ImageUpload
                    onImageUpload={(data) => field.onChange(data)}
                    initialImageUrl={initialData?.imageUrl} // Pass existing image URL
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!initialData && (
            <Link
              className="text-sm text-themeTextGray hover:underline"
              href={"/pages/courses"}
            >
              Skip for now
            </Link>
          )}
          <Button
            variant="outline"
            type="submit"
            className="bg-themeBlack mt-2 w-full border-themeGray rounded-xl"
          >
            <Loader loading={isPending}>
              {initialData ? "Save Changes" : "Get Started"}
            </Loader>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourse;
