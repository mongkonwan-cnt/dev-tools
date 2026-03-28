type JsonErrorPanelProps = {
  message: string;
};

export function JsonErrorPanel({ message }: JsonErrorPanelProps) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
      <p className="text-sm font-medium text-destructive">Parse error</p>
      <p className="text-sm text-destructive/80 mt-0.5 font-mono">{message}</p>
    </div>
  );
}
