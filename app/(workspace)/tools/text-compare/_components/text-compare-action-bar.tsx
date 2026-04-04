"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type TextCompareActionBarProps = {
  onCompare: () => void;
  onLoadExample: () => void;
  onClear: () => void;
};

export function TextCompareActionBar({ onCompare, onLoadExample, onClear }: TextCompareActionBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={onCompare} size="sm">
        Compare
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
