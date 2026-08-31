import { BookDetailSkeleton } from "@/components/books/BookDetailSkeleton";

export default function BookLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <BookDetailSkeleton />
    </div>
  );
}
