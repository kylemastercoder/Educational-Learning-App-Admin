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

const CreateCode = ({ initialData }: { initialData: any }) => {
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
        }
      : {
          title: "",
          description: "",
          correctOutput: "",
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
                    className="bg-themeBlack border-themeGray text-themeTextGray"
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
                  <Input
                    className="bg-themeBlack border-themeGray text-themeTextGray"
                    placeholder="Hello World"
                    {...field}
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
              {initialData ? "Save Changes" : "Submit Code Challenge"}
            </Loader>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCode;
