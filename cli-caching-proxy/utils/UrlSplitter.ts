export function urlSplitter(url: string): Array<string> {
  try {
    return url.split("://");
  } catch (error) {
    console.error("Error: Invalid URL format");
    throw new Error("Invalid URL format");
  }
}
