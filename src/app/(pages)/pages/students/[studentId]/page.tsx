/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { getStudentById, getStudents, updateStudent } from "@/actions/students";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateStudentSchema } from "@/constants/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Student = {
  id: string;
  name: string;
  email: string;
  profile: string;
  age: string;
  birthdate: string;
  course: string;
  block: string;
  gender: string;
  studentNumber: string;
  username: string;
  status: string;
};

const StudentPage = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isPending, setIsPending] = useState(false);
  const params = useParams();
  const form = useForm<z.infer<typeof UpdateStudentSchema>>({
    resolver: zodResolver(UpdateStudentSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      birthdate: student?.birthdate || "",
      age: student?.age || "",
      gender: student?.gender || "",
      course: student?.course || "",
      username: student?.username || "",
      status: student?.status || "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    setIsPending(true);
    const fetchStudent = async () => {
      const { status, student, message } = await getStudentById(
        Array.isArray(params?.studentId)
          ? params.studentId[0]
          : params?.studentId
      );

      if (status === 200 && student) {
        setStudent(student);
        reset({
          name: student.name,
          email: student.email,
          birthdate: student.birthdate,
          age: student.age,
          gender: student.gender,
          course: student.course,
          username: student.username,
          status: student.status,
        });
      } else {
        toast.error(message || "Failed to load student.");
      }

      setIsPending(false);
    };

    fetchStudent();
  }, [params?.studentId, reset]);

  const onSubmit = async (values: z.infer<typeof UpdateStudentSchema>) => {
    try {
      setIsPending(true);
      if (student?.id) {
        const response = await updateStudent(values, student.id);
        if (response.status === 200) {
          toast.success("Student updated successfully");
          window.location.assign("/pages/students");
        } else {
          toast.error(response.message || "Failed to update student.");
        }
      } else {
        toast.error("Student ID is missing.");
      }
    } catch (error) {
      toast.error("Oops! something went wrong. Try again");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  if (isPending) {
    return null;
  }
  return (
    <div className="px-5 py-3">
      <Heading
        title={`Update Student Record`}
        description="Please provide all the required fields. This will help us to update the student record."
      />
      <Form {...form}>
        <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Juan Dela Cruz"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                    placeholder="jdelacruz@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="birthdate"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex flex-col gap-2">
                    Birthdate
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                      placeholder="Select birthdate"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex flex-col gap-2">Age</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                      placeholder="Enter age"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="gender"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Gender</FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                    placeholder="Enter gender"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Course</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                    placeholder="Enter course"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Username</FormLabel>
                <FormControl>
                  <Input
                    className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                    placeholder="Enter username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex flex-col gap-2">Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black">
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Student"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentPage;
