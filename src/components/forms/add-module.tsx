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
import { ModuleSchema } from "@/constants/schema";
import { Button } from "../ui/button";
import { Loader } from "../global/loader";
import { createModule, updateModule } from "@/actions/course";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RichTextEditor from "../global/rich-text-editor";
import MultipleImageUpload from "../global/image-many-upload";

const AddModule = ({
  courseId,
  initialData,
  moduleId,
}: {
  courseId: string;
  initialData?: any;
  moduleId?: string;
}) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ModuleSchema>>({
    resolver: zodResolver(ModuleSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          number: initialData?.moduleNumber || 0,
          name: initialData?.name || "",
          content: initialData?.content || "",
        }
      : {
          number: 0,
          name: "",
          content: "",
          imagesUrl: [],
        },
  });

  const onSubmit = async (values: z.infer<typeof ModuleSchema>) => {
    try {
      setIsPending(true);
      if (initialData) {
        const response = await updateModule(
          values,
          courseId,
          moduleId as string
        );
        if (response.status === 200) {
          toast.success("Topic updated successfully");
          router.push(`/pages/courses/${courseId}`);
          window.location.reload();
        } else if (response.status === 404) {
          toast.error(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await createModule(values, courseId);
        if (response.status === 200) {
          toast.success("Topic Created Successfully");
          router.push(`/pages/courses/${courseId}`);
          window.location.reload();
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
            name="number"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Topic Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-themeBlack border-themeGray text-themeTextGray"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Topic Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-themeBlack border-themeGray text-themeTextGray"
                    placeholder="Introduction To C Language"
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
            name="content"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Topic Content
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
          <FormField
            control={form.control}
            disabled={isPending}
            name="imagesUrl"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Topic Images
                </FormLabel>
                <FormControl>
                  <MultipleImageUpload
                    onImageUpload={(data) => field.onChange(data)}
                    initialImageUrls={initialData?.imageUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            type="submit"
            className="bg-themeBlack mt-2 w-full border-themeGray rounded-xl"
          >
            <Loader loading={isPending}>
              {initialData ? "Save Changes" : "Submit Topic"}
            </Loader>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddModule;
