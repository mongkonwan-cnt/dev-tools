"use client";

type DiffLine =
  | { type: "equal"; lineNumber: number; text: string }
  | { type: "removed"; lineNumber: number; text: string }
  | { type: "added"; lineNumber: number; text: string };

type TextCompareDiffPanelProps = {
  leftText: string;
  rightText: string;
};

function computeDiff(leftText: string, rightText: string): DiffLine[] {
  const leftLines = leftText.split("\n");
  const rightLines = rightText.split("\n");

  // LCS-based diff using dynamic programming
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

  const result: DiffLine[] = [];
  let i = leftLength;
  let j = rightLength;
  let leftLineNumber = leftLength;
  let rightLineNumber = rightLength;

  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      stack.push({ type: "equal", lineNumber: leftLineNumber, text: leftLines[i - 1] });
      i--;
      j--;
      leftLineNumber--;
      rightLineNumber--;
    } else if (j > 0 && (i === 0 || lcsTable[i][j - 1] >= lcsTable[i - 1][j])) {
      stack.push({ type: "added", lineNumber: rightLineNumber, text: rightLines[j - 1] });
      j--;
      rightLineNumber--;
    } else {
      stack.push({ type: "removed", lineNumber: leftLineNumber, text: leftLines[i - 1] });
      i--;
      leftLineNumber--;
    }
  }

  return stack.reverse();
}

export function TextCompareDiffPanel({ leftText, rightText }: TextCompareDiffPanelProps) {
  const diffLines = computeDiff(leftText, rightText);

  console.log({ diffLines });

  const removedCount = diffLines.filter((line) => line.type === "removed").length;
  const addedCount = diffLines.filter((line) => line.type === "added").length;
  const isIdentical = removedCount === 0 && addedCount === 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Diff Result
        </label>
        <div className="flex items-center gap-3 text-xs">
          {isIdentical ? (
            <span className="text-muted-foreground">Texts are identical</span>
          ) : (
            <>
              <span className="text-red-500 dark:text-red-400">− {removedCount} removed</span>
              <span className="text-green-600 dark:text-green-400">+ {addedCount} added</span>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg border overflow-auto max-h-80 bg-muted/30">
        <table className="w-full text-sm font-mono border-collapse">
          <tbody>
            {diffLines.map((line, index) => {
              const isRemoved = line.type === "removed";
              const isAdded = line.type === "added";

              const rowClass = isRemoved
                ? "bg-red-50 dark:bg-red-950/40"
                : isAdded
                ? "bg-green-50 dark:bg-green-950/40"
                : "";

              const prefixClass = isRemoved
                ? "text-red-500 dark:text-red-400 select-none"
                : isAdded
                ? "text-green-600 dark:text-green-400 select-none"
                : "text-muted-foreground select-none";

              const prefix = isRemoved ? "−" : isAdded ? "+" : " ";

              const textClass = isRemoved
                ? "text-red-700 dark:text-red-300"
                : isAdded
                ? "text-green-700 dark:text-green-300"
                : "";

              return (
                <tr key={index} className={rowClass}>
                  <td className={`px-3 py-0.5 w-8 text-right text-xs ${prefixClass}`}>
                    {line.lineNumber}
                  </td>
                  <td className={`px-2 py-0.5 w-4 text-center ${prefixClass}`}>{prefix}</td>
                  <td className={`px-3 py-0.5 whitespace-pre ${textClass}`}>
                    {line.text || " "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
