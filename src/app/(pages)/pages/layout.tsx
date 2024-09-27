import { onAuthenticatedUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import MobileNav from "./_components/mobile-nav";
const PageLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await onAuthenticatedUser();
  if (!user.clerkId) redirect("/sign-in");
  return (
    <div className="flex h-screen md:pt-5">
      <Sidebar />
      <div className="md:ml-[300px] flex flex-col flex-1 bg-[#101011] md:rounded-tl-xl overflow-y-auto border-l border-t border-[#28282d]">
        <Navbar imageUrl={user.image} username={user.username as string} />
        {children}
        <MobileNav />
      </div>
    </div>
  );
};

export default PageLayout;
