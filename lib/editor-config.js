export function shouldUseRichEditor() {
  return process.env.NEXT_PUBLIC_ENABLE_RICH_EDITOR === "true";
}

export function getEditorType() {
  return shouldUseRichEditor() ? "rich" : "markdown";
}
