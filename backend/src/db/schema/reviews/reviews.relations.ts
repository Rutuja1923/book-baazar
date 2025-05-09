import { relations } from "drizzle-orm";
import { reviewsTable } from "../reviews";
import { booksTable } from "../books";
import { customersTable } from "../customers";

/**
 * Reviews belong to:
 * - One book
 * - One customer
 */
export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [reviewsTable.bookIsbn],
    references: [booksTable.isbn],
  }),
  customer: one(customersTable, {
    fields: [reviewsTable.customerId],
    references: [customersTable.custId],
  }),
}));
