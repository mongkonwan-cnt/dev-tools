"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type JsonActionBarProps = {
  onFormat: () => void;
  onMinify: () => void;
  onLoadExample: () => void;
  onClear: () => void;
};

export function JsonActionBar({ onFormat, onMinify, onLoadExample, onClear }: JsonActionBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={onFormat} size="sm">
        Format
      </Button>
      <Button onClick={onMinify} variant="secondary" size="sm">
        Minify
      </Button>
      <Button onClick={onLoadExample} variant="outline" size="sm">
        Load Example
      </Button>
      <Button onClick={onClear} variant="ghost" size="sm" className="ml-auto text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
        Clear
      </Button>
    </div>
  );
}
