import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GlassModalProps = {
  trigger?: JSX.Element;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

export const GlassModal = ({
  trigger,
  children,
  title,
  description,
  className
}: GlassModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn("dark:bg-clip-padding dark:backdrop-filter dark:backdrop--blur__safari dark:backdrop-blur-3xl dark:bg-opacity-20 dark:bg-themeGray dark:border-themeGray bg-zinc-200 border-zinc-300", className)}>
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">{title}</DialogTitle>
          <DialogDescription className="text-black dark:text-white">{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
