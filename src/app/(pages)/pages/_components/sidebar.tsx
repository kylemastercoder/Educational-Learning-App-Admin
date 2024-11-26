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
        !mobile ? "hidden bg-black md:w-[300px] fixed md:flex" : "w-full flex"
      )}
    >
      <p className="font-bold text-2xl">C-Challenge</p>
      <div className="flex flex-col gap-y-3">
        <p className="text-[10px] text-[#F7ECE9]">MAIN MENU</p>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
            pathname === "/pages/overview"
              ? "text-white bg-themeGray"
              : "text-themeTextGray"
          }`}
          href={`/pages/overview`}
        >
          <LayoutDashboardIcon
            className={`w-5 h-5 ${
              pathname === "/pages/overview"
                ? "text-white"
                : "text-themeTextGray"
            }`}
          />
          Overview
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
            pathname === "/pages/students"
              ? "text-white bg-themeGray"
              : "text-themeTextGray"
          }`}
          href={`/pages/students`}
        >
          <GraduationCapIcon
            className={`w-5 h-5 ${
              pathname === "/pages/students"
                ? "text-white"
                : "text-themeTextGray"
            }`}
          />
          Student Accounts
        </Link>
        {isAdmin && (
          <Link
            className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
              pathname === "/pages/instructors"
                ? "text-white bg-themeGray"
                : "text-themeTextGray"
            }`}
            href={`/pages/instructors`}
          >
            <UsersIcon
              className={`w-5 h-5 ${
                pathname === "/pages/instructors"
                  ? "text-white"
                  : "text-themeTextGray"
              }`}
            />
            Instructor Accounts
          </Link>
        )}
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
            pathname === "/pages/courses"
              ? "text-white bg-themeGray"
              : "text-themeTextGray"
          }`}
          href={`/pages/courses`}
        >
          <BookTextIcon
            className={`w-5 h-5 ${
              pathname === "/pages/courses"
                ? "text-white"
                : "text-themeTextGray"
            }`}
          />
          Modules
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
            pathname === "/pages/videos"
              ? "text-white bg-themeGray"
              : "text-themeTextGray"
          }`}
          href={`/pages/videos`}
        >
          <VideoIcon
            className={`w-5 h-5 ${
              pathname === "/pages/videos" ? "text-white" : "text-themeTextGray"
            }`}
          />
          Video Lectures
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
            pathname === "/pages/quizzes"
              ? "text-white bg-themeGray"
              : "text-themeTextGray"
          }`}
          href={`/pages/quizzes`}
        >
          <BrainIcon
            className={`w-5 h-5 ${
              pathname === "/pages/quizzes"
                ? "text-white"
                : "text-themeTextGray"
            }`}
          />
          Quizzes
        </Link>
        <Link
          className={`flex text-sm gap-x-2 items-center font-semibold rounded-xl hover:bg-themeGray p-2 ${
            pathname === "/pages/code-challenges"
              ? "text-white bg-themeGray"
              : "text-themeTextGray"
          }`}
          href={`/pages/code-challenges`}
        >
          <CodeXml
            className={`w-5 h-5 ${
              pathname === "/pages/code-challenges"
                ? "text-white"
                : "text-themeTextGray"
            }`}
          />
          Code Challenges
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
