const HTTPS_REGEX = /^https?:\/\//i;

export const sanitizeAndValidateUrl = (rawUrl: string): URL => {
  const trimmed = rawUrl.trim();
  let decodedUrl: string;

  try {
    decodedUrl = decodeURIComponent(trimmed);
  } catch {
    decodedUrl = trimmed;
  }

  if (!HTTPS_REGEX.test(decodedUrl)) {
    decodedUrl = `https://${decodedUrl}`;
  }

  try {
    return new URL(decodedUrl);
  } catch {
    throw new Error(`Invalid URL: ${decodedUrl}`);
  }
};

export const extractContentType = (headers: Headers): string => {
  const contentType = headers.get("Content-Type");
  return contentType ? contentType : "application/octet-stream";
};
