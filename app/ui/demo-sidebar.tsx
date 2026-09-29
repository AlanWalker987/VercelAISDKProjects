"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Braces,
  ChevronRight,
  Image,
  ListChecks,
  ListFilter,
  MessageCircle,
  MessagesSquare,
  Mic,
  Sparkles,
  Waves,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type DemotabsType = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};
const demoTabs: DemotabsType[] = [
  {
    label: "Chat",
    href: "/ui/chat",
    description: "Have a real-time conversation with an AI assistant.",
    icon: MessageCircle,
  },
  {
    label: "Stream",
    href: "/ui/stream",
    description: "Watch an AI response appear progressively as it streams.",
    icon: Waves,
  },
  {
    label: "Completion",
    href: "/ui/completion",
    description: "Generate a complete AI response from a text prompt.",
    icon: Sparkles,
  },
  {
    label: "Structured Data",
    href: "/ui/structuredData",
    description:
      "Generate a recipe as structured data with ingredients and steps.",
    icon: Braces,
  },
  {
    label: "Structured Array",
    href: "/ui/structuredArray",
    description: "Generate a structured list of Pokémon and their abilities.",
    icon: ListChecks,
  },
  {
    label: "Structured Enum",
    href: "/ui/structuredEnum",
    description: "Classify text sentiment as positive, negative, or neutral.",
    icon: ListFilter,
  },
  {
    label: "Multi-Modal Chat",
    href: "/ui/multiModalChat",
    description: "Chat with AI about text, images, and PDF attachments.",
    icon: MessagesSquare,
  },
  {
    label: "Image Generation",
    href: "/ui/generateImage",
    description: "Create an image from a written prompt.",
    icon: Image,
  },
  {
    label: "Audio Transcription",
    href: "/ui/transcribeAudio",
    description: "Upload audio and get its transcript and detected language.",
    icon: Mic,
  },
  {
    label: "Speech Generation",
    href: "/ui/generateSpeech",
    description: "Convert text to speech and play the generated audio.",
    icon: AudioLines,
  },
  {
    label: "Tools",
    href: "/ui/tools",
    description: "Use tools to chat with LLM",
    icon: Wrench,
  },
  {
    label: "Mutiple Tools",
    href: "/ui/multipleTools",
    description: "Use multiple tools to chat with LLM",
    icon: Workflow,
  },
  {
    label: "API Tools",
    href: "/ui/apiTools",
    description: "Use real world weather api tools to chat with LLM",
    icon: Workflow,
  },
];

export default function DemoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="ai-panel app-scrollbar min-w-0 rounded-[28px] p-4 sm:p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
      <nav className="app-scrollbar flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
        {demoTabs.map(({ label, href, description, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "group flex min-w-[220px] max-w-[280px] flex-1 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200 lg:mb-3 lg:max-w-none",
                isActive
                  ? "border-[#2b6ea8] bg-[#0d2f4a] shadow-[inset_0_0_0_1px_rgba(59,179,255,0.1),0_10px_30px_rgba(23,90,145,0.25)]"
                  : "border-[#1a3b5d] bg-[#091d2f] hover:border-[#2c6fa8] hover:bg-[#0d2942]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                  isActive
                    ? "border-[#2c7fcd] bg-[#1d5c96] text-white"
                    : "border-[#1f4167] bg-[#102e47] text-[#9ed7ff]",
                ].join(" ")}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-white">
                  {label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-[#a7bdd6]">
                  {description}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={[
                  "transition-transform duration-200",
                  isActive
                    ? "text-[#bfe6ff]"
                    : "text-[#82a9cb] group-hover:translate-x-0.5",
                ].join(" ")}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
