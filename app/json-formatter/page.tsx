"use client";

import { useState } from "react";
import { CheckCircle, FileJson, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JsonActionBar } from "./_components/json-action-bar";
import { JsonEditor } from "./_components/json-editor";
import { JsonErrorPanel } from "./_components/json-error-panel";

const PLACEHOLDER_JSON = `{
  "name": "dev-tools",
  "version": "1.0.0",
  "features": ["json-formatter", "base64", "git-helper"],
  "config": {
    "theme": "dark",
    "autoFormat": true
  }
}`;

type ValidationState = "idle" | "valid" | "invalid";

export default function JsonFormatterPage() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [validationState, setValidationState] = useState<ValidationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  function formatJson() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    try {
      const parsed = JSON.parse(trimmed);
      setOutputValue(JSON.stringify(parsed, null, 2));
      setValidationState("valid");
      setErrorMessage("");
    } catch (error) {
      setOutputValue("");
      setValidationState("invalid");
      setErrorMessage((error as Error).message);
    }
  }

  function minifyJson() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    try {
      const parsed = JSON.parse(trimmed);
      setOutputValue(JSON.stringify(parsed));
      setValidationState("valid");
      setErrorMessage("");
    } catch (error) {
      setOutputValue("");
      setValidationState("invalid");
      setErrorMessage((error as Error).message);
    }
  }

  function clearAll() {
    setInputValue("");
    setOutputValue("");
    setValidationState("idle");
    setErrorMessage("");
  }

  async function copyOutput() {
    if (!outputValue) return;
    await navigator.clipboard.writeText(outputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function loadExample() {
    setInputValue(PLACEHOLDER_JSON);
    setOutputValue("");
    setValidationState("idle");
    setErrorMessage("");
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileJson className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">JSON Formatter</h1>
            <p className="text-sm text-muted-foreground mt-1">Format, validate and minify JSON</p>
          </div>
        </div>

        {validationState !== "idle" && (
          <Badge
            variant={validationState === "valid" ? "default" : "destructive"}
            className="flex items-center gap-1.5"
          >
            {validationState === "valid" ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {validationState === "valid" ? "Valid JSON" : "Invalid JSON"}
          </Badge>
        )}
      </div>

      <JsonActionBar
        onFormat={formatJson}
        onMinify={minifyJson}
        onLoadExample={loadExample}
        onClear={clearAll}
      />

      <JsonEditor
        inputValue={inputValue}
        outputValue={outputValue}
        copied={copied}
        onInputChange={setInputValue}
        onCopyOutput={copyOutput}
      />

      {validationState === "invalid" && errorMessage && (
        <JsonErrorPanel message={errorMessage} />
      )}
    </div>
  );
}
