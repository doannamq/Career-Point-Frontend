"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Enter your text...",
  className,
}: {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "my-bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "my-ordered-list",
        },
      }),
      ListItem,
      Bold,
      Italic,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 max-w-none",
        spellcheck: "false",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn("border rounded-xl overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="border-b bg-gradient-to-r from-blue-50/50 to-green-50/50 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-blue-200/60 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive("bold") ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive("italic") ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive("underline") ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-blue-200/60 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive("bulletList") ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive("orderedList") ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-blue-200/60 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Link */}
        <div className="flex gap-1 border-r border-blue-200/60 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`rounded-lg transition-all duration-200 ${
              editor.isActive("link") ? "bg-blue-100 text-blue-600 shadow-sm" : "hover:bg-blue-50"
            }`}>
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded-lg transition-all duration-200 hover:bg-blue-50 disabled:opacity-50">
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded-lg transition-all duration-200 hover:bg-blue-50 disabled:opacity-50">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] bg-white [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-4"
      />

      {/* Custom styles for the editor content */}
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .ProseMirror ul li {
          list-style-type: disc;
        }
        .ProseMirror ol li {
          list-style-type: decimal;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror u {
          text-decoration: underline;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .ProseMirror [data-text-align="center"] {
          text-align: center;
        }
        .ProseMirror [data-text-align="right"] {
          text-align: right;
        }
        .ProseMirror [data-text-align="left"] {
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
