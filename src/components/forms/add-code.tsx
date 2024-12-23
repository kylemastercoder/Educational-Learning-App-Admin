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
import { CodeSchema } from "@/constants/schema";
import { Button } from "../ui/button";
import { Loader } from "../global/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RichTextEditor from "../global/rich-text-editor";
import { createCode, updateCode } from "@/actions/code";
import ImageUpload from "../global/image-upload";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CreateCode = ({ initialData }: { initialData?: any }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof CodeSchema>>({
    resolver: zodResolver(CodeSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          title: initialData.title || "",
          description: initialData.description || "",
          correctOutput: initialData.correctOutput || "",
          imageUrl: initialData.imageUrl || "",
        }
      : {
          title: "",
          description: "",
          correctOutput: "",
          imageUrl: "",
          programmingLanguage: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof CodeSchema>) => {
    try {
      setIsPending(true);
      if (initialData) {
        const response = await updateCode(values, initialData.id);
        if (response.status === 200) {
          toast.success("Code Challenge Updated Successfully");
          router.push("/pages/code-challenges");
          window.location.assign("/pages/code-challenges");
        } else if (response.status === 404) {
          toast.error(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await createCode(values);
        if (response.status === 200) {
          toast.success("Code Challenge Created Successfully");
          router.push("/pages/code-challenges");
          window.location.assign("/pages/code-challenges");
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
            name="title"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Title</FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                    placeholder="Print Hello World"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="programmingLanguage"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Programming Language
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black">
                      <SelectValue placeholder="Select a programming language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c">C Language</SelectItem>
                      <SelectItem value="c++">C++ Language</SelectItem>
                      <SelectItem value="c#">C# Language</SelectItem>
                    </SelectContent>
                  </Select>
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
                  Instruction
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
            name="correctOutput"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">
                  Correct Output
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black min-h-32"
                    placeholder="Hello World"
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
                <FormLabel className="flex flex-col gap-2">Thumbnail</FormLabel>
                <FormControl>
                  <ImageUpload
                    onImageUpload={(data) => field.onChange(data)}
                    initialImageUrl={initialData?.imageUrl}
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
              {initialData ? "Save Changes" : "Submit Code Challenge"}
            </Loader>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCode;
