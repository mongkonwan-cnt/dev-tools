"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Code2, FileJson, GitBranch, Hash, Home, Settings, Terminal } from "lucide-react";

const navSections = [
  {
    label: "General",
    items: [
      { title: "Home", url: "/", icon: Home },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "JSON Formatter", url: "/json-formatter", icon: FileJson },
      { title: "Base64 Encoder", url: "/base64", icon: Hash },
      { title: "Git Helper", url: "/git-helper", icon: GitBranch },
      { title: "Code Snippet", url: "/snippets", icon: Code2 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Terminal", url: "/terminal", icon: Terminal },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">Dev Tools</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section, index) => (
          <SidebarGroup key={section.label} className={index > 0 ? "mt-3" : ""}>
            <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 px-3 mb-1">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<a href={item.url} />} className="text-sm py-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-3 px-1">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">DV</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Developer</span>
            <span className="text-xs text-muted-foreground mt-1">Local</span>
          </div>
          <a href="/settings" className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
