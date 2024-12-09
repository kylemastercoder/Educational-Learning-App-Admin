"use client";

import GlassSheet from "@/components/global/glass-sheet";
import { Menu } from "lucide-react";
import React from "react";
import Sidebar from "./sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckBadge } from "@/icons";
import { UserWidget } from "@/components/global/user-widget";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";

type NavbarProps = {
  imageUrl: string
  username: string;
}

const Navbar = ({ imageUrl, username }: NavbarProps) => {
  const {theme} = useTheme();
  return (
    <div className="dark:bg-[#1A1A1D] bg-zinc-100 py-2 px-3 md:px-7 md:py-5 flex gap-5 justify-between md:justify-end items-center">
      <GlassSheet trigger={<Menu className="md:hidden cursor-pointer" />}>
        <Sidebar mobile />
      </GlassSheet>
      <Link href={`/`} className="hidden md:inline">
        <Button
          variant="outline"
          className="dark:bg-themeBlack bg-white text-black dark:text-white rounded-2xl flex gap-2 dark:border-themeGray border-zinc-200 dark:hover:bg-themeGray hover:bg-zinc-100"
        >
          <CheckBadge color={theme === "dark" ? "#fff" : "#111"} />
          Dashboard
        </Button>
      </Link>
      <ModeToggle />
      <UserWidget image={imageUrl} username={username} />
    </div>
  );
};

export default Navbar;
