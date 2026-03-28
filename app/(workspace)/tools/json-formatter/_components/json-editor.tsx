"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type JsonEditorProps = {
  inputValue: string;
  outputValue: string;
  copied: boolean;
  onInputChange: (value: string) => void;
  onCopyOutput: () => void;
};

export function JsonEditor({ inputValue, outputValue, copied, onInputChange, onCopyOutput }: JsonEditorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
      <div className="flex flex-col gap-2 min-h-0">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Input
        </label>
        <textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste your JSON here..."
          className="flex-1 resize-none rounded-lg border bg-muted/30 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground/50"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col gap-2 min-h-0">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Output
          </label>
          {outputValue && (
            <Button onClick={onCopyOutput} variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
              <Copy className="h-3.5 w-3.5 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
        </div>
        <textarea
          value={outputValue}
          readOnly
          placeholder="Formatted output will appear here..."
          className="flex-1 resize-none rounded-lg border bg-muted/30 px-4 py-3 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
