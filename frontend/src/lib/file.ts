/**
 * Safely extracts the clean, original filename from a full path or URL,
 * stripping any bucket paths, folder prefixes, and unique UUID identifiers.
 *
 * Example input:
 * - "https://bxgexxgzpjjgwtsqajot.supabase.co/storage/v1/object/public/documents/challenges/924822b0-76f3-4edb-a5e5-9a7e89d9d1ee/8c5c0d91-44fd-3b74-8a8a-50a92c7e61f3-Manufacturing_Requirements.pdf"
 * Example output:
 * - "Manufacturing_Requirements.pdf"
 */
export function getOriginalFileName(urlOrPath: string): string {
  if (!urlOrPath) return "";

  let decoded = "";
  try {
    decoded = decodeURIComponent(urlOrPath);
  } catch {
    decoded = urlOrPath;
  }

  // Get the last segment
  const segment = decoded.split('/').pop() || "";

  // Check if it starts with a standard 36-character UUID prefix followed by a hyphen or underscore
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}[-_](.*)$/;
  const match = segment.match(uuidRegex);
  if (match && match[1]) {
    return match[1];
  }

  return segment;
}
