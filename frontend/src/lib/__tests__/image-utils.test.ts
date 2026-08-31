import { describe, it, expect } from "vitest";
import { getHighResBookCover } from "../image-utils";

describe("getHighResBookCover", () => {
  it("should return null for null input", () => {
    expect(getHighResBookCover(null)).toBeNull();
  });

  it("should return null for no_cover placeholder", () => {
    expect(getHighResBookCover("https://books.google.com/no_cover.jpg")).toBeNull();
  });

  it("should return null for notavailable placeholder", () => {
    expect(getHighResBookCover("https://books.google.com/notavailable")).toBeNull();
  });

  it("should return null for img/UQ/ placeholder", () => {
    expect(getHighResBookCover("https://books.google.com/img/UQ/placeholder")).toBeNull();
  });

  it("should return null for non-Google Books URLs", () => {
    expect(getHighResBookCover("https://example.com/cover.jpg")).toBeNull();
  });

  it("should extract book ID and return high-res URL", () => {
    const url = "https://books.google.com/books/content?id=ABC123&printsec=frontcover&img=1&zoom=1";
    const result = getHighResBookCover(url);

    expect(result).toBe(
      "https://books.google.com/books/publisher/content/images/frontcover/ABC123?fife=w400-h600&source=gbs_api"
    );
  });

  it("should fallback to https and remove edge=curl when no ID found", () => {
    const url = "http://books.google.com/some/path&edge=curl";
    const result = getHighResBookCover(url);

    expect(result).toBe("https://books.google.com/some/path");
  });
});
