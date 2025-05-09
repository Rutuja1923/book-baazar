import { relations } from "drizzle-orm";
import { bookDiscountsTable } from "../book-discounts";
import { booksTable } from "@db/schema/books";
import { discountsTable } from "@db/schema/discounts";

/**
 * Book-Discount relationships belong to:
 * - One book
 * - One discount
 */
export const bookDiscountsRelations = relations(
  bookDiscountsTable,
  ({ one }) => ({
    book: one(booksTable, {
      fields: [bookDiscountsTable.bookIsbn],
      references: [booksTable.isbn],
    }),
    discount: one(discountsTable, {
      fields: [bookDiscountsTable.discountId],
      references: [discountsTable.discountId],
    }),
  })
);
