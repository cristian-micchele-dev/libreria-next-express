import { supabaseAdmin } from "../config/supabase.js";

export interface CreateOrderInput {
  orderNumber: string;
  total: number;
  itemCount: number;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  items: {
    bookId: string | null;
    title: string;
    author: string;
    price: number;
    quantity: number;
    thumbnailUrl: string | null;
  }[];
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: userId,
      order_number: input.orderNumber,
      total: input.total,
      item_count: input.itemCount,
      shipping_name: input.shippingName,
      shipping_email: input.shippingEmail,
      shipping_address: input.shippingAddress,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    book_id: item.bookId,
    title: item.title,
    author: item.author,
    price: item.price,
    quantity: item.quantity,
    thumbnail_url: item.thumbnailUrl,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

export async function getOrders(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
