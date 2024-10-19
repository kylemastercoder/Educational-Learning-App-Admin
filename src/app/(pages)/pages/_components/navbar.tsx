import GlassSheet from "@/components/global/glass-sheet";
import { Menu } from "lucide-react";
import React from "react";
import Sidebar from "./sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckBadge } from "@/icons";
import { UserWidget } from "@/components/global/user-widget";

type NavbarProps = {
  imageUrl: string
  username: string;
}

const Navbar = ({ imageUrl, username }: NavbarProps) => {
  return (
    <div className="bg-[#1A1A1D] py-2 px-3 md:px-7 md:py-5 flex gap-5 justify-between md:justify-end items-center">
      <GlassSheet trigger={<Menu className="md:hidden cursor-pointer" />}>
        <Sidebar mobile />
      </GlassSheet>
      <Link href={`/`} className="hidden md:inline">
        <Button
          variant="outline"
          className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
        >
          <CheckBadge />
          Dashboard
        </Button>
      </Link>
      <UserWidget image={imageUrl} username={username} />
    </div>
  );
};

export default Navbar;
