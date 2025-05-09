import { relations } from "drizzle-orm";
import { customersTable } from "../customers";
import { ordersTable } from "../orders";
import { reviewsTable } from "../reviews";
import { customerDiscountsTable } from "../junction-tables/customer-discounts";

/**
 * Customers can have many:
 * - Orders
 * - Reviews
 * - Discounts (through customer_discounts)
 */
export const customersRelations = relations(customersTable, ({ many }) => ({
  orders: many(ordersTable),
  reviews: many(reviewsTable),
  discounts: many(customerDiscountsTable),
}));
