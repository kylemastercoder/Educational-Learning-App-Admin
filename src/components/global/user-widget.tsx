
import { UserAvatar } from "./user-avatar"

type UserWidgetProps = {
  image: string
  username: string
}

export const UserWidget = ({ image, username }: UserWidgetProps) => {
  return (
    <div className="gap-5 items-center hidden md:flex">
      <UserAvatar image={image} username={username} />
    </div>
  )
}