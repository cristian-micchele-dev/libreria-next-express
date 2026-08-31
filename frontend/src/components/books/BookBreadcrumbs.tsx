import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface BookBreadcrumbsProps {
  searchQuery?: string;
}

export function BookBreadcrumbs({ searchQuery }: BookBreadcrumbsProps) {
  const items = [];

  if (searchQuery) {
    items.push({
      label: `"${searchQuery}"`,
      href: `/buscar?q=${encodeURIComponent(searchQuery)}`,
    });
  } else {
    items.push({
      label: "Catalogo",
      href: "/buscar",
    });
  }

  items.push({ label: "Detalle del libro" });

  return <Breadcrumbs items={items} />;
}
