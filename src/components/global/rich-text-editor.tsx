import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Toolbar from "./tool-bar";
import Heading from "@tiptap/extension-heading";

const RichTextEditor = ({
  description,
  onChange,
  className,
}: {
  description: string;
  onChange: (richText: string) => void;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2],
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: `rounded-md w-full dark:bg-themeBlack bg-white dark:border-themeGray dark:text-themeTextGray border-zinc-100 text-black border h-[100px] ${className} overflow-hidden overflow-wrap-break-word whitespace-normal border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-1 text-sm shadow-sm`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return (
    <div className="flex flex-col justify-stretch">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
