"use client";

import { useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { TextCompareActionBar } from "./_components/text-compare-action-bar";
import { TextCompareInputPanel } from "./_components/text-compare-input-panel";
import { TextCompareDiffPanel } from "./_components/text-compare-diff-panel";

const EXAMPLE_LEFT = `The quick brown fox jumps over the lazy dog.
Hello, World!
This is the original text.
Line four stays the same.
This line will be removed.`;

const EXAMPLE_RIGHT = `The quick brown fox jumps over the lazy dog.
Hello, World!
This is the modified text.
Line four stays the same.
This line was added instead.`;

export default function TextComparePage() {
  const [leftValue, setLeftValue] = useState("");
  const [rightValue, setRightValue] = useState("");
  const [diffLeft, setDiffLeft] = useState("");
  const [diffRight, setDiffRight] = useState("");
  const [hasCompared, setHasCompared] = useState(false);

  function compare() {
    setDiffLeft(leftValue);
    setDiffRight(rightValue);
    setHasCompared(true);
  }

  function clearAll() {
    setLeftValue("");
    setRightValue("");
    setDiffLeft("");
    setDiffRight("");
    setHasCompared(false);
  }

  function loadExample() {
    setLeftValue(EXAMPLE_LEFT);
    setRightValue(EXAMPLE_RIGHT);
    setDiffLeft("");
    setDiffRight("");
    setHasCompared(false);
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GitCompareArrows className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-none">Text Compare</h1>
          <p className="text-sm text-muted-foreground mt-1">Compare two pieces of text side by side</p>
        </div>
      </div>

      {hasCompared && (
        <TextCompareDiffPanel leftText={diffLeft} rightText={diffRight} />
      )}

      <TextCompareActionBar
        onCompare={compare}
        onLoadExample={loadExample}
        onClear={clearAll}
      />

      <TextCompareInputPanel
        leftValue={leftValue}
        rightValue={rightValue}
        onLeftChange={setLeftValue}
        onRightChange={setRightValue}
      />

    </div>
  );
}
