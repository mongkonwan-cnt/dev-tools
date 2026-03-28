import { Code2, FileJson, GitBranch, Hash, Home, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    label: "General",
    items: [
      { title: "Home", url: "/", icon: Home },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "JSON Formatter", url: "/tools/json-formatter", icon: FileJson },
      { title: "Base64 Encoder", url: "/tools/base64", icon: Hash },
      { title: "Git Helper", url: "/tools/git-helper", icon: GitBranch },
      { title: "Code Snippet", url: "/tools/snippets", icon: Code2 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Terminal", url: "/tools/terminal", icon: Terminal },
    ],
  },
];
