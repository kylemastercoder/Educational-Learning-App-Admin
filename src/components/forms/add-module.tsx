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
import { createModule } from "@/actions/course";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RichTextEditor from "../global/rich-text-editor";

const AddModule = ({ courseId }: { courseId: string }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ModuleSchema>>({
    resolver: zodResolver(ModuleSchema),
    mode: "onChange",
    defaultValues: {
      number: 0,
      name: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ModuleSchema>) => {
    try {
      setIsPending(true);
      const response = await createModule(values, courseId);
      if (response.status === 200) {
        toast.success("Module Created Successfully");
        router.push(`/pages/courses/${courseId}`);
        window.location.reload();
      } else if (response.status === 404) {
        toast.error(response.message);
      } else {
        toast.error(response.message);
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
                  Module Number
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
                  Module Name
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
                  Module Content
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
          <Button
            variant="outline"
            type="submit"
            className="bg-themeBlack mt-2 w-full border-themeGray rounded-xl"
          >
            <Loader loading={isPending}>Submit Module</Loader>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddModule;
