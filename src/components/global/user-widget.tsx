import { Message } from "@/icons"
import Link from "next/link"
import { Notification } from "./notification"
import { UserAvatar } from "./user-avatar"

type UserWidgetProps = {
  image: string
  username: string
}

export const UserWidget = ({ image, username }: UserWidgetProps) => {
  return (
    <div className="gap-5 items-center hidden md:flex">
      <Notification />
      <Link href={`/pages/messages`}>
        <Message />
      </Link>
      <UserAvatar image={image} username={username} />
    </div>
  )
}