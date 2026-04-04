"use client";

type TextCompareInputPanelProps = {
  leftValue: string;
  rightValue: string;
  onLeftChange: (value: string) => void;
  onRightChange: (value: string) => void;
};

export function TextCompareInputPanel({
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
}: TextCompareInputPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
      <div className="flex flex-col gap-2 min-h-0">
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

      <div className="flex flex-col gap-2 min-h-0">
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
