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
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
