export function shouldUseRichEditor() {
  return process.env.ENABLE_RICH_EDITOR === "true";
}

export function getEditorType() {
  return shouldUseRichEditor() ? "rich" : "markdown";
}
