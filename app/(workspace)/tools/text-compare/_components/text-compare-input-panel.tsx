"use client";

import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";

type TextCompareInputPanelProps = {
  leftValue: string;
  rightValue: string;
  onLeftChange: (value: string) => void;
  onRightChange: (value: string) => void;
  onCompare: () => void;
};

export function TextCompareInputPanel({
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
  onCompare,
}: TextCompareInputPanelProps) {
  return (
    <div className="flex gap-3 flex-1 min-h-0">
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Original
        </label>
        <textarea
          value={leftValue}
          onChange={(e) => onLeftChange(e.target.value)}
          placeholder="Paste original text here..."
          className="flex-1 resize-none rounded-lg border bg-muted/30 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground/50"
          spellCheck={false}
        />
      </div>

      {/* Center Compare button */}
      <div className="flex flex-col items-center justify-center gap-2 pt-6 shrink-0">
        <Button onClick={onCompare} size="sm" className="flex flex-col h-auto py-3 px-3 gap-1.5">
          <GitCompareArrows className="h-4 w-4" />
          <span className="text-xs">Compare</span>
        </Button>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Modified
        </label>
        <textarea
          value={rightValue}
          onChange={(e) => onRightChange(e.target.value)}
          placeholder="Paste modified text here..."
          className="flex-1 resize-none rounded-lg border bg-muted/30 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground/50"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
