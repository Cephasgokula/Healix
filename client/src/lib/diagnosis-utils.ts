/**
 * Shared utilities for diagnosis pages.
 * Extracted to avoid duplicating risk-color logic across pneumonia, covid, etc.
 */

/** Maps a risk level to a text color class. */
export function getRiskColor(level: string): string {
  switch (level) {
    case "high":
      return "text-destructive";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-secondary";
    default:
      return "text-muted-foreground";
  }
}

/** Maps a risk level to a background + border color class. */
export function getRiskBgColor(level: string): string {
  switch (level) {
    case "high":
      return "bg-destructive/10 border-destructive/20";
    case "medium":
      return "bg-yellow-500/10 border-yellow-500/20";
    case "low":
      return "bg-secondary/10 border-secondary/20";
    default:
      return "bg-muted";
  }
}

/** Max file size for X-ray uploads (10 MB). */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Validates an uploaded image file. Returns an error message or null if valid. */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please upload a valid image file (JPEG, PNG, etc.)";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size must be less than 10 MB";
  }
  return null;
}
