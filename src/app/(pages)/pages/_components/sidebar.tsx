"use client";

import { onAuthenticatedUser } from "@/actions/auth";
import { cn } from "@/lib/utils";
import {
  BookTextIcon,
  BrainIcon,
  CodeXml,
  GraduationCapIcon,
  LayoutDashboardIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  mobile?: boolean;
};

const Sidebar = ({ mobile }: Props) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await onAuthenticatedUser();
        setIsAdmin(response.isAdmin);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div
      className={cn(
        "h-screen flex-col gap-y-10 sm:px-5",
        !mobile
          ? "hidden dark:bg-black bg-white md:w-[300px] fixed md:flex"
          : "w-full flex"
      )}
    >
      <p className="font-bold text-2xl">C Challenge</p>
      <div className="flex flex-col gap-y-3">
        <p className="text-[10px] dark:text-[#F7ECE9] text-black">MAIN MENU</p>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
            pathname === "/pages/overview"
              ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
              : "dark:text-themeTextGray text-black"
          }`}
          href={`/pages/overview`}
        >
          <LayoutDashboardIcon
            className={`w-5 h-5 ${
              pathname === "/pages/overview"
                ? "dark:text-white text-black"
                : "dark:text-themeTextGray text-black"
            }`}
          />
          Overview
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
            pathname === "/pages/students"
              ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
              : "dark:text-themeTextGray text-black"
          }`}
          href={`/pages/students`}
        >
          <GraduationCapIcon
            className={`w-5 h-5 ${
              pathname === "/pages/students"
                ? "dark:text-white text-black"
                : "dark:text-themeTextGray text-black"
            }`}
          />
          Student Accounts
        </Link>
        {isAdmin && (
          <Link
            className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
              pathname === "/pages/instructors"
                ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
                : "dark:text-themeTextGray text-black"
            }`}
            href={`/pages/instructors`}
          >
            <UsersIcon
              className={`w-5 h-5 ${
                pathname === "/pages/instructors"
                  ? "dark:text-white text-black"
                  : "dark:text-themeTextGray text-black"
              }`}
            />
            Instructor Accounts
          </Link>
        )}
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
            pathname === "/pages/courses"
              ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
              : "dark:text-themeTextGray text-black"
          }`}
          href={`/pages/courses`}
        >
          <BookTextIcon
            className={`w-5 h-5 ${
              pathname === "/pages/courses"
                ? "dark:text-white text-black"
                : "dark:text-themeTextGray text-black"
            }`}
          />
          Modules
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
            pathname === "/pages/videos"
              ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
              : "dark:text-themeTextGray text-black"
          }`}
          href={`/pages/videos`}
        >
          <VideoIcon
            className={`w-5 h-5 ${
              pathname === "/pages/videos"
                ? "dark:text-white text-black"
                : "dark:text-themeTextGray text-black"
            }`}
          />
          Video Lectures
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
            pathname === "/pages/quizzes"
              ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
              : "dark:text-themeTextGray text-black"
          }`}
          href={`/pages/quizzes`}
        >
          <BrainIcon
            className={`w-5 h-5 ${
              pathname === "/pages/quizzes"
                ? "dark:text-white text-black"
                : "dark:text-themeTextGray text-black"
            }`}
          />
          Quizzes
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl dark:hover:bg-themeGray hover:bg-zinc-100 p-2 ${
            pathname === "/pages/code-challenges"
              ? "dark:text-white dark:bg-themeGray text-black bg-zinc-100"
              : "dark:text-themeTextGray text-black"
          }`}
          href={`/pages/code-challenges`}
        >
          <CodeXml
            className={`w-5 h-5 ${
              pathname === "/pages/code-challenges"
                ? "dark:text-white text-black"
                : "dark:text-themeTextGray text-black"
            }`}
          />
          Code Challenges
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
