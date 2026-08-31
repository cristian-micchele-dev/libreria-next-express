"use client";

import { useAuth } from "@/hooks/useAuth";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { API_URL } from "@/lib/api";

interface OrderItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  thumbnail_url: string | null;
}

interface Order {
  id: string;
  order_number: string;
  total: number;
  item_count: number;
  shipping_name: string;
  shipping_address: string;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const { user, session, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.access_token) return;

    fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => res.json())
      .then((res) => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [session?.access_token]);

  if (loading || fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center text-center py-16 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tus pedidos
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Inicia sesion para ver el historial de tus compras.
        </p>
        <Link href="/auth/login" className={buttonVariants({ size: "lg" })}>
          Ingresar
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          No tenes pedidos aun
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Cuando realices una compra, vas a poder ver el detalle aca.
        </p>
        <Link href="/buscar" className={buttonVariants({ size: "lg" })}>
          Explorar libros
        </Link>
      </div>
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {orders.map((order) => {
        const isExpanded = expandedId === order.id;

        return (
          <div
            key={order.id}
            className="paper-texture rounded-xl border border-border/40 overflow-hidden"
          >
            {/* Order header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                    {order.order_number}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(order.created_at)} · {order.item_count} {order.item_count === 1 ? "libro" : "libros"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  ${order.total.toFixed(2)}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Order details (expandable) */}
            {isExpanded && (
              <div className="border-t border-border/40 p-5 space-y-4 animate-fade-in">
                {/* Items */}
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm book-shadow">
                        {item.thumbnail_url ? (
                          <Image
                            src={item.thumbnail_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="h-full w-full bg-secondary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.author}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="border-t border-border/40 pt-3 text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Envio:</span> {order.shipping_address}</p>
                  <p><span className="font-medium text-foreground">Nombre:</span> {order.shipping_name}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
