import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dashboard, Logout } from "@/icons";
import { onAuthenticatedUser } from "@/actions/auth";

const LandingPageNavbar = async () => {
  const user = await onAuthenticatedUser();
  return (
    <div className="w-full flex justify-between sticky top-0 items-center py-5 z-50">
      <p className="font-bold text-2xl">C-Challenge</p>
      <div className="flex gap-2">
        {user.clerkId ? (
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
            >
              <Dashboard />
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
            >
              <Logout />
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPageNavbar;
