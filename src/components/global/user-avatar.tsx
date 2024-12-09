"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Logout } from "@/icons"
import { useClerk } from "@clerk/nextjs"
import { DropDown } from "./drop-down"
import { useTheme } from "next-themes"

type UserWidgetProps = {
  image: string
  username: string
}

export const UserAvatar = ({ image, username }: UserWidgetProps) => {
  const { signOut } = useClerk()
  const {theme} = useTheme();

  const onLogout = async () => {
    signOut({ redirectUrl: "/" })
  }

  return (
    <DropDown
      title="Account"
      trigger={
        <Avatar className="cursor-pointer">
          <AvatarImage src={image} alt="user" />
          <AvatarFallback>{username?.charAt(0)}</AvatarFallback>
        </Avatar>
      }
    >
      <Button
        onClick={onLogout}
        variant="ghost"
        className="flex gap-x-3 px-2 justify-start w-full"
      >
        <Logout color={theme === "dark" ? "#F7ECE9" : "#111"} />
        Logout
      </Button>
    </DropDown>
  )
}