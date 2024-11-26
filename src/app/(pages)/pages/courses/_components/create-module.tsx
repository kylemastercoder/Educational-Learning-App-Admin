/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getModules, updateModuleOrder } from "@/actions/course";
import AddModule from "@/components/forms/add-module";
import { GlassModal } from "@/components/global/glass-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type CreateCourseModuleProps = {
  courseId: string;
  user: any;
};

type Module = {
  id: string;
  name: string;
  moduleNumber: number;
};

export const CreateCourseModule = ({
  courseId,
  user,
}: CreateCourseModuleProps) => {
  const [sortedModules, setSortedModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const { status, modules, message } = await getModules(courseId);
        if (status === 200 && Array.isArray(modules)) {
          const validModules = modules.filter(
            (module: any): module is Module =>
              module.id &&
              module.name &&
              typeof module.moduleNumber === "number"
          );
          const sorted = [...validModules].sort(
            (a, b) => a.moduleNumber - b.moduleNumber
          );
          setSortedModules(sorted);
        } else {
          toast.error(message || "Failed to load topics.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching topics.");
      }
      setLoading(false);
    };

    fetchModules();
  }, [courseId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSortedModules((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex).map(
          (module, index) => ({
            ...module,
            moduleNumber: index + 1, // Adjust module numbers based on new order
          })
        );

        // Call Firebase to update the module order
        newOrder.forEach(async (module) => {
          await updateModuleOrder(module.moduleNumber, module.id);
        });

        return newOrder;
      });
    }
  };

  const BASE_URL = `https://educational-learning-app-admin.vercel.app/pages/courses/${courseId}`;

  return (
    <div className="flex flex-col">
      {user.isAdmin && (
        <GlassModal
          className="max-h-screen max-w-full overflow-auto"
          title="Create a new topic for your course"
          description="Topics are a great way to organize your module content."
          trigger={
            <div className="flex flex-col gap-y-2">
              <Button
                variant="outline"
                className="flex items-center bg-themeBlack hover:bg-themeDarkGray"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Topic
              </Button>
            </div>
          }
        >
          <AddModule courseId={courseId} />
        </GlassModal>
      )}
      {loading && (
        <div className="flex items-center m-auto mt-20">
          <Loader2 size={20} className="animate-spin" />
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedModules}
          strategy={verticalListSortingStrategy}
        >
          {sortedModules.map((module) => (
            <SortableModule
              key={module.id}
              module={module}
              href={`${BASE_URL}/modules/${module.id}`}
              isActive={params?.moduleId === module.id}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

type SortableModuleProps = {
  module: Module;
  href: string;
  isActive: boolean;
};

const SortableModule = ({ module, href, isActive }: SortableModuleProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: module.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Link
      href={href}
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center mt-3 bg-themeBlack hover:bg-themeDarkGray justify-center py-2 rounded-md",
        isActive ? "bg-themeDarkGray" : ""
      )}
      {...attributes}
      {...listeners}
    >
      {module.name}
    </Link>
  );
};
