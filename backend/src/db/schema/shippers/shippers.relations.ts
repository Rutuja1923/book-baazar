import { relations } from "drizzle-orm";
import { shippersTable } from "../shippers";
import { ordersTable } from "../orders";

/**
 * Shippers can have many orders
 */
export const shippersRelations = relations(shippersTable, ({ many }) => ({
  orders: many(ordersTable),
}));
