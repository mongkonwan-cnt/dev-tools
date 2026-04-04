"use client";

type DiffLine =
  | { type: "equal"; leftLineNumber: number; rightLineNumber: number; text: string }
  | { type: "removed"; leftLineNumber: number; text: string; wordDiff?: WordChunk[] }
  | { type: "added"; rightLineNumber: number; text: string; wordDiff?: WordChunk[] };

type WordChunk = { text: string; changed: boolean };

type SideBySideRow =
  | { kind: "equal"; leftLineNumber: number; rightLineNumber: number; text: string }
  | {
      kind: "changed";
      leftLineNumber: number;
      rightLineNumber: number;
      leftText: string;
      rightText: string;
      leftWordDiff?: WordChunk[];
      rightWordDiff?: WordChunk[];
    }
  | { kind: "removed"; leftLineNumber: number; text: string; wordDiff?: WordChunk[] }
  | { kind: "added"; rightLineNumber: number; text: string; wordDiff?: WordChunk[] };

type TextCompareDiffPanelProps = {
  leftText: string;
  rightText: string;
};

function computeWordDiff(leftText: string, rightText: string): { leftChunks: WordChunk[]; rightChunks: WordChunk[] } {
  const leftChars = Array.from(leftText);
  const rightChars = Array.from(rightText);
  const leftLen = leftChars.length;
  const rightLen = rightChars.length;

  const lcsTable = Array.from({ length: leftLen + 1 }, () => new Array(rightLen + 1).fill(0));
  for (let i = 1; i <= leftLen; i++) {
    for (let j = 1; j <= rightLen; j++) {
      if (leftChars[i - 1] === rightChars[j - 1]) {
        lcsTable[i][j] = lcsTable[i - 1][j - 1] + 1;
      } else {
        lcsTable[i][j] = Math.max(lcsTable[i - 1][j], lcsTable[i][j - 1]);
      }
    }
  }

  let i = leftLen;
  let j = rightLen;
  const leftStack: WordChunk[] = [];
  const rightStack: WordChunk[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftChars[i - 1] === rightChars[j - 1]) {
      leftStack.push({ text: leftChars[i - 1], changed: false });
      rightStack.push({ text: rightChars[j - 1], changed: false });
      i--; j--;
    } else if (j > 0 && (i === 0 || lcsTable[i][j - 1] >= lcsTable[i - 1][j])) {
      rightStack.push({ text: rightChars[j - 1], changed: true });
      j--;
    } else {
      leftStack.push({ text: leftChars[i - 1], changed: true });
      i--;
    }
  }

  return {
    leftChunks: mergeAdjacentChunks(leftStack.reverse()),
    rightChunks: mergeAdjacentChunks(rightStack.reverse()),
  };
}

function mergeAdjacentChunks(chunks: WordChunk[]): WordChunk[] {
  if (chunks.length === 0) return [];
  const merged: WordChunk[] = [{ ...chunks[0] }];
  for (let i = 1; i < chunks.length; i++) {
    const previous = merged[merged.length - 1];
    const current = chunks[i];
    if (previous.changed === current.changed) {
      previous.text += current.text;
    } else {
      merged.push({ ...current });
    }
  }
  return merged;
}

function computeDiff(leftText: string, rightText: string): DiffLine[] {
  const leftLines = leftText.split("\n");
  const rightLines = rightText.split("\n");
  const leftLength = leftLines.length;
  const rightLength = rightLines.length;

  const lcsTable = Array.from({ length: leftLength + 1 }, () =>
    new Array(rightLength + 1).fill(0)
  );
  for (let i = 1; i <= leftLength; i++) {
    for (let j = 1; j <= rightLength; j++) {
      if (leftLines[i - 1] === rightLines[j - 1]) {
        lcsTable[i][j] = lcsTable[i - 1][j - 1] + 1;
      } else {
        lcsTable[i][j] = Math.max(lcsTable[i - 1][j], lcsTable[i][j - 1]);
      }
    }
  }

  let i = leftLength;
  let j = rightLength;
  let leftLineNumber = leftLength;
  let rightLineNumber = rightLength;
  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      stack.push({ type: "equal", leftLineNumber, rightLineNumber, text: leftLines[i - 1] });
      i--; j--; leftLineNumber--; rightLineNumber--;
    } else if (j > 0 && (i === 0 || lcsTable[i][j - 1] >= lcsTable[i - 1][j])) {
      stack.push({ type: "added", rightLineNumber, text: rightLines[j - 1] });
      j--; rightLineNumber--;
    } else {
      stack.push({ type: "removed", leftLineNumber, text: leftLines[i - 1] });
      i--; leftLineNumber--;
    }
  }

  const diffLines = stack.reverse();

  // Pair adjacent removed+added lines for word-level diff
  for (let idx = 0; idx < diffLines.length - 1; idx++) {
    const current = diffLines[idx];
    const next = diffLines[idx + 1];
    if (current.type === "removed" && next.type === "added") {
      const { leftChunks, rightChunks } = computeWordDiff(current.text, next.text);
      (current as Extract<DiffLine, { type: "removed" }>).wordDiff = leftChunks;
      (next as Extract<DiffLine, { type: "added" }>).wordDiff = rightChunks;
      idx++;
    }
  }

  return diffLines;
}

function buildSideBySideRows(diffLines: DiffLine[]): SideBySideRow[] {
  const rows: SideBySideRow[] = [];
  let idx = 0;
  while (idx < diffLines.length) {
    const current = diffLines[idx];
    const next = diffLines[idx + 1];

    if (current.type === "equal") {
      rows.push({ kind: "equal", leftLineNumber: current.leftLineNumber, rightLineNumber: current.rightLineNumber, text: current.text });
      idx++;
    } else if (current.type === "removed" && next?.type === "added") {
      rows.push({
        kind: "changed",
        leftLineNumber: current.leftLineNumber,
        rightLineNumber: next.rightLineNumber,
        leftText: current.text,
        rightText: next.text,
        leftWordDiff: current.wordDiff,
        rightWordDiff: next.wordDiff,
      });
      idx += 2;
    } else if (current.type === "removed") {
      rows.push({ kind: "removed", leftLineNumber: current.leftLineNumber, text: current.text, wordDiff: current.wordDiff });
      idx++;
    } else if (current.type === "added") {
      rows.push({ kind: "added", rightLineNumber: current.rightLineNumber, text: current.text, wordDiff: current.wordDiff });
      idx++;
    } else {
      idx++;
    }
  }
  return rows;
}

function renderChunks(chunks: WordChunk[], isRemoved: boolean) {
  return chunks.map((chunk, index) => {
    if (!chunk.changed) {
      return (
        <span key={index} className="text-foreground/85">
          {chunk.text}
        </span>
      );
    }

    const changedClass = isRemoved
      ? "bg-red-300/50 dark:bg-red-700/40 text-red-950 dark:text-red-100 font-semibold underline decoration-red-500/50 rounded-sm px-0.5"
      : "bg-green-300/50 dark:bg-green-700/40 text-green-950 dark:text-green-100 font-semibold underline decoration-green-500/50 rounded-sm px-0.5";

    return (
      <span key={index} className={changedClass}>
        {chunk.text}
      </span>
    );
  });
}

function getMarker(kind: SideBySideRow["kind"]): string {
  if (kind === "removed") return "-";
  if (kind === "added") return "+";
  if (kind === "changed") return "~";
  return " ";
}

function getRowBackground(kind: SideBySideRow["kind"], side: "left" | "right"): string {
  if (kind === "equal") {
    return "bg-background";
  }

  if (kind === "changed") {
    return side === "left"
      ? "bg-red-50/70 dark:bg-red-950/30"
      : "bg-green-50/70 dark:bg-green-950/30";
  }

  if (kind === "removed") {
    return side === "left"
      ? "bg-red-50/70 dark:bg-red-950/30"
      : "bg-muted/20";
  }

  return side === "left"
    ? "bg-muted/20"
    : "bg-green-50/70 dark:bg-green-950/30";
}

const markerClass =
  "w-8 shrink-0 border-r text-center text-xs select-none flex items-center justify-center";

const lineNumberClass =
  "w-12 shrink-0 border-r px-2 text-right text-xs text-muted-foreground tabular-nums flex items-center justify-end";

const textClass =
  "flex-1 min-w-0 px-3 py-1 whitespace-pre overflow-x-auto font-mono text-sm leading-6";

function EmptyCell() {
  return (
    <div className="flex flex-1 min-w-0 items-center">
      <span className={markerClass} />
      <span className={lineNumberClass} />
      <span className={`${textClass} text-muted-foreground/30 italic`}>·</span>
    </div>
  );
}

function DiffCell(props: {
  side: "left" | "right";
  rowKind: SideBySideRow["kind"];
  lineNumber?: number;
  text?: string;
  chunks?: WordChunk[];
  isRemoved?: boolean;
}) {
  const { side, rowKind, lineNumber, text, chunks, isRemoved } = props;

  const marker =
    rowKind === "equal"
      ? " "
      : rowKind === "changed"
      ? "~"
      : rowKind === "removed" && side === "left"
      ? "-"
      : rowKind === "added" && side === "right"
      ? "+"
      : " ";

  const markerColor =
    marker === "-"
      ? "text-red-500"
      : marker === "+"
      ? "text-green-600"
      : marker === "~"
      ? "text-amber-500"
      : "text-muted-foreground/40";

  return (
    <div className="flex flex-1 min-w-0 items-stretch">
      <span className={`${markerClass} ${markerColor}`}>{marker}</span>
      <span className={lineNumberClass}>{lineNumber ?? ""}</span>
      <span className={textClass}>
        {chunks ? renderChunks(chunks, Boolean(isRemoved)) : (text || " ")}
      </span>
    </div>
  );
}

export function TextCompareDiffPanel({ leftText, rightText }: TextCompareDiffPanelProps) {
  const diffLines = computeDiff(leftText, rightText);
  const rows = buildSideBySideRows(diffLines);
  const removedCount = diffLines.filter((line) => line.type === "removed").length;
  const addedCount = diffLines.filter((line) => line.type === "added").length;
  const isIdentical = removedCount === 0 && addedCount === 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Diff Result
        </label>

        <div className="flex items-center gap-3 text-xs">
          {isIdentical ? (
            <span className="text-muted-foreground">Texts are identical</span>
          ) : (
            <>
              <span className="text-red-500">− {removedCount} removed</span>
              <span className="text-green-600">+ {addedCount} added</span>
            </>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="grid grid-cols-2 border-b bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div className="border-r px-4 py-2">Original</div>
          <div className="px-4 py-2">Modified</div>
        </div>

        <div className="max-h-[32rem] overflow-auto">
          {rows.map((row, index) => {
            return (
              <div
                key={index}
                className="flex border-b last:border-b-0"
              >
                <div className={`flex flex-1 min-w-0 border-r ${getRowBackground(row.kind, "left")}`}>
                  {row.kind === "equal" && (
                    <DiffCell
                      side="left"
                      rowKind="equal"
                      lineNumber={row.leftLineNumber}
                      text={row.text}
                    />
                  )}

                  {row.kind === "changed" && (
                    <DiffCell
                      side="left"
                      rowKind="changed"
                      lineNumber={row.leftLineNumber}
                      text={row.leftText}
                      chunks={row.leftWordDiff}
                      isRemoved={true}
                    />
                  )}

                  {row.kind === "removed" && (
                    <DiffCell
                      side="left"
                      rowKind="removed"
                      lineNumber={row.leftLineNumber}
                      text={row.text}
                      chunks={row.wordDiff}
                      isRemoved={true}
                    />
                  )}

                  {row.kind === "added" && <EmptyCell />}
                </div>

                <div className={`flex flex-1 min-w-0 ${getRowBackground(row.kind, "right")}`}>
                  {row.kind === "equal" && (
                    <DiffCell
                      side="right"
                      rowKind="equal"
                      lineNumber={row.rightLineNumber}
                      text={row.text}
                    />
                  )}

                  {row.kind === "changed" && (
                    <DiffCell
                      side="right"
                      rowKind="changed"
                      lineNumber={row.rightLineNumber}
                      text={row.rightText}
                      chunks={row.rightWordDiff}
                      isRemoved={false}
                    />
                  )}

                  {row.kind === "added" && (
                    <DiffCell
                      side="right"
                      rowKind="added"
                      lineNumber={row.rightLineNumber}
                      text={row.text}
                      chunks={row.wordDiff}
                      isRemoved={false}
                    />
                  )}

                  {row.kind === "removed" && <EmptyCell />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}