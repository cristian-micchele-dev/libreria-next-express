export function getHighResBookCover(url: string | null): string | null {
  if (!url) return null;

  // Google Books placeholder images (no real cover available)
  if (
    url.includes("no_cover") ||
    url.includes("notavailable") ||
    url.includes("img/UQ/") ||
    !url.includes("books.google")
  ) {
    return null;
  }

  // Extract the book ID from the thumbnail URL and request a larger image
  const idMatch = url.match(/id=([^&]+)/);
  if (idMatch) {
    return `https://books.google.com/books/publisher/content/images/frontcover/${idMatch[1]}?fife=w400-h600&source=gbs_api`;
  }

  return url
    .replace("http://", "https://")
    .replace("&edge=curl", "");
}
