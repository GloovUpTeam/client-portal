
/**
 * Helper utilities for downloading files in the browser.
 * Includes defensive checks and logging for debugging PDF issues.
 */

/**
 * Downloads a Blob object as a file.
 * @param blob The Blob to download
 * @param filename The filename to save as
 */
export function downloadBlob(blob: Blob, filename: string): void {
  console.log(`[Download] Starting download for "${filename}"`);
  console.log(`[Download] Blob size: ${blob.size} bytes`);
  console.log(`[Download] Blob type: ${blob.type}`);

  // Defensive check for empty or corrupted files
  if (blob.size < 100) {
    console.error('[Download] Blob is too small (< 100 bytes). Possible corruption.');
    // We don't block the download but we log the error.
    // In a real app, we might throw or show a toast here.
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}
