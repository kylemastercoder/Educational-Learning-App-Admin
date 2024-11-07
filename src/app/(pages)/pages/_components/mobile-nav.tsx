
import { onAuthenticatedUser } from "@/actions/auth"
import { Notification } from "@/components/global/notification"
import { UserAvatar } from "@/components/global/user-avatar"
import { Home, Message } from "@/icons"
import Link from "next/link"

const MobileNav = async () => {
  const user = await onAuthenticatedUser();

  return (
    <div className="bg-[#1A1A1D] w-screen py-3 px-11 fixed bottom-0 z-50 md:hidden justify-between items-center flex">
      <Link href={`/group/`}>
        <Home className="h-7 w-7" />
      </Link>
      <Notification />
      <Link href={`/pages/messages`}>
        <Message className="h-7 w-7" />
      </Link>
      <UserAvatar username={user.username} image={user.image as string} />
    </div>
  )
}

export default MobileNav