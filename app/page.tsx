import Link from "next/link";
import Image from "next/image";
import { navSections } from "@/app/config/navigation";

export default function HomePage() {
  const toolSections = navSections.filter((section) => section.label !== "General");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome to Dev Tools</h1>
        <p className="text-muted-foreground mt-1">Pick a tool to get started.</p>
      </div>

      {toolSections.map((section) => (
        <div key={section.label}>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            {section.label}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {section.items.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <item.icon className="h-4 w-4 text-foreground" />
                </div>
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
