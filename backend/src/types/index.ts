export interface Book {
  id: string;
  google_books_id: string;
  title: string;
  authors: string[];
  description: string | null;
  thumbnail_url: string | null;
  categories: string[];
  published_date: string | null;
  page_count: number | null;
  isbn: string | null;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    publishedDate?: string;
    pageCount?: number;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
