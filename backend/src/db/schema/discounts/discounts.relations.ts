import { relations } from "drizzle-orm";
import { discountsTable } from "../discounts";
import { bookDiscountsTable } from "../junction-tables/book-discounts";
import { customerDiscountsTable } from "../junction-tables/customer-discounts";

/**
 * Discounts can be applied to:
 * - Many books (through book_discounts)
 * - Many customers (through customer_discounts)
 */
export const discountsRelations = relations(discountsTable, ({ many }) => ({
  bookDiscounts: many(bookDiscountsTable),
  customerDiscounts: many(customerDiscountsTable),
}));
