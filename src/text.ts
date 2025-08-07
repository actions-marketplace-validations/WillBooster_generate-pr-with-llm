/**
 * Truncate long text.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    const truncated = text.slice(0, maxLength);
    const omitted = text.length - maxLength;
    return `${truncated}\n\n... (${Math.floor(omitted)} characters truncated) ...`;
  }

  return text;
}

/**
 * Removes HTML-style comments from a string.
 *
 * @param markdownContent The string containing markdown content
 * @returns The string with HTML comments removed
 */
export function stripHtmlComments(markdownContent: string): string {
  return markdownContent.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Removes log sections from a PR body markdown.
 *
 * Strips any top-level heading ending with "Log" and the following fenced code block.
 */
export function stripLogSections(markdownContent: string): string {
  return markdownContent.replaceAll(/^# .+ Log\s*[\r\n]+~{3,}[\s\S]*?~{3,}/gm, '').trim();
}
