import {
  Chat,
  Courses,
  Document,
  Grid,
  Heart,
  MegaPhone,
  WhiteLabel,
} from "@/icons"

export type CreateGroupPlaceholderProps = {
  id: string
  label: string
  icon: JSX.Element
}

export const CREATE_GROUP_PLACEHOLDER: CreateGroupPlaceholderProps[] = [
  {
    id: "0",
    label: "Highly engaging",
    icon: <MegaPhone />,
  },
  {
    id: "1",
    label: "Easy to setup",
    icon: <Heart />,
  },
  {
    id: "2",
    label: "Interactive discussions",
    icon: <Chat />,
  },
  {
    id: "3",
    label: "Students can view progress",
    icon: <Grid />,
  },
  {
    id: "4",
    label: "Gamification",
    icon: <Document />,
  },
  {
    id: "5",
    label: "Code runner for activities",
    icon: <Courses />,
  },
  {
    id: "6",
    label: "Accessible anywhere",
    icon: <WhiteLabel />,
  },
]
