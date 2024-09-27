

import {
  onCreateCourseModule,
  onCreateModuleSection,
  onGetCourseModules,
  onGetSectionInfo,
  onUpdateCourseSectionContent,
  onUpdateModule,
  onUpdateSection,
} from "@/actions/course";
import { CourseContentSchema } from "@/constants/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";

export const useCreateModule = (courseId: string) => {
  const client = useQueryClient();

  const { mutate, variables, isPending } = useMutation({
    mutationKey: ["create-module"],
    mutationFn: (data: { courseId: string; title: string; moduleId: string }) =>
      onCreateCourseModule(data.courseId, data.title, data.moduleId),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["course-modules"],
      });
    },
  });
  const onCreateModule = () =>
    mutate({
      courseId,
      title: "New Module",
      moduleId: v4(),
    });

  return { variables, isPending, onCreateModule };
};

export const useCourseModule = (courseId: string) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLAnchorElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sectionInputRef = useRef<HTMLInputElement | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [editSection, setEditSection] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | undefined>(
    undefined
  );
  const [moduleId, setModuleId] = useState<string | undefined>(undefined);

  const { data } = useQuery({
    queryKey: ["course-modules"],
    queryFn: () => onGetCourseModules(courseId),
  });

  const pathname = usePathname();

  const client = useQueryClient();

  const { variables, mutate, isPending } = useMutation({
    mutationFn: (data: { type: "NAME" | "DATA"; content: string }) =>
      onUpdateModule(moduleId!, data.type, data.content),
    onMutate: () => setEdit(false),
    onSuccess: (data) => {
      toast(data?.status === 200 ? "Success" : "Error", {
        description: data?.message,
      });
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["course-modules"],
      });
    },
  });

  const {
    mutate: updateSection,
    isPending: sectionUpdatePending,
    variables: updateVariables,
  } = useMutation({
    mutationFn: (data: { type: "NAME"; content: string }) =>
      onUpdateSection(activeSection!, data.type, data.content),
    onMutate: () => setEditSection(false),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["course-modules"],
      });
    },
  });

  const {
    mutate: mutateSection,
    variables: sectionVariables,
    isPending: pendingSection,
  } = useMutation({
    mutationFn: (data: { moduleid: string; sectionid: string }) =>
      onCreateModuleSection(data.moduleid, data.sectionid),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["course-modules"],
      });
    },
  });

  const onEditModuleName = (event: Event) => {
    if (inputRef.current && triggerRef.current) {
      if (
        !inputRef.current.contains(event.target as Node | null) &&
        !triggerRef.current.contains(event.target as Node | null)
      ) {
        if (inputRef.current.value) {
          mutate({
            type: "NAME",
            content: inputRef.current.value,
          });
        } else {
          setEdit(false);
        }
      }
    }
  };

  const onEditSectionName = (event: Event) => {
    if (sectionInputRef.current && contentRef.current) {
      if (
        !sectionInputRef.current.contains(event.target as Node | null) &&
        !contentRef.current.contains(event.target as Node | null)
      ) {
        if (sectionInputRef.current.value) {
          updateSection({
            type: "NAME",
            content: sectionInputRef.current.value,
          });
        } else {
          setEditSection(false);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", onEditModuleName, false);
    return () => {
      document.removeEventListener("click", onEditModuleName, false);
    };
  }, [moduleId]);

  useEffect(() => {
    document.addEventListener("click", onEditSectionName, false);
    return () => {
      document.removeEventListener("click", onEditSectionName, false);
    };
  }, [activeSection]);

  const onEditModule = (id: string) => {
    setEdit(true);
    setModuleId(id);
  };

  const onEditSection = () => setEditSection(true);

  return {
    data,
    onEditModule,
    edit,
    triggerRef,
    inputRef,
    variables,
    isPending,
    pathname,
    sectionVariables,
    mutateSection,
    pendingSection,
    setActiveSection,
    activeSection,
    onEditSection,
    sectionInputRef,
    contentRef,
    editSection,
    sectionUpdatePending,
    updateVariables,
  };
};

export const useSectionNavBar = (sectionid: string) => {
  const { data } = useQuery({
    queryKey: ["section-info"],
    queryFn: () => onGetSectionInfo(sectionid),
  })

  const client = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: () => onUpdateSection(sectionid, "COMPLETE", ""),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["course-modules"],
      })
    },
  })

  return { data, mutate, isPending }
}

export const useCourseSectionInfo = (sectionId: string) => {
  const { data } = useQuery({
    queryKey: ["section-info"],
    queryFn: () => onGetSectionInfo(sectionId),
  })

  return { data }
}

export const useCourseContent = (
  sectionId: string,
  description: string | null,
  jsonDescription: string | null,
  htmlDescription: string | null,
) => {
  const jsonContent =
    jsonDescription !== null ? JSON.parse(jsonDescription as string) : undefined

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    description || undefined,
  )

  const [onHtmlDescription, setOnHtmlDescription] = useState<
    string | undefined
  >(htmlDescription || undefined)

  const editor = useRef<HTMLFormElement | null>(null)
  const [onEditDescription, setOnEditDescription] = useState<boolean>(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<z.infer<typeof CourseContentSchema>>({
    resolver: zodResolver(CourseContentSchema),
  })

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsoncontent", JsonContent)
    setValue("content", onDescription)
    setValue("htmlcontent", onHtmlDescription)
  }

  useEffect(() => {
    onSetDescriptions()
    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const onEditTextEditor = (event: Event) => {
    if (editor.current) {
      !editor.current.contains(event.target as Node | null)
        ? setOnEditDescription(false)
        : setOnEditDescription(true)
    }
  }

  useEffect(() => {
    document.addEventListener("click", onEditTextEditor, false)
    return () => {
      document.removeEventListener("click", onEditTextEditor, false)
    }
  }, [])

  const client = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { values: z.infer<typeof CourseContentSchema> }) =>
      onUpdateCourseSectionContent(
        sectionId,
        data.values.htmlcontent!,
        data.values.jsoncontent!,
        data.values.content!,
      ),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["section-info"],
      })
    },
  })

  const onUpdateContent = handleSubmit(async (values) => {
    mutate({ values })
  })

  return {
    register,
    errors,
    onUpdateContent,
    setJsonDescription,
    setOnDescription,
    onJsonDescription,
    onDescription,
    onEditDescription,
    setOnHtmlDescription,
    editor,
    isPending,
  }
}
