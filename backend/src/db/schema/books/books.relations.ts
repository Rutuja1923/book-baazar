import { relations } from "drizzle-orm";
import { booksTable } from "../books";
import { authorsTable } from "../authors";
import { publishersTable } from "../publishers";
import { bookGenresTable } from "../junction-tables/book-genres";
import { reviewsTable } from "../reviews";
import { ordersDetailsTable } from "../orders/order-details";
import { bookDiscountsTable } from "../junction-tables/book-discounts";

/**
 * Books belong to:
 * - One author
 * - One publisher
 * And can have many:
 * - Genres (through book_genres)
 * - Reviews
 * - Orders (through orders_details)
 * - Discounts (through book_discounts)
 */
export const booksRelations = relations(booksTable, ({ many, one }) => ({
  author: one(authorsTable, {
    fields: [booksTable.authorId],
    references: [authorsTable.authorId],
  }),
  publisher: one(publishersTable, {
    fields: [booksTable.publisherId],
    references: [publishersTable.publisherId],
  }),
  genres: many(bookGenresTable),
  reviews: many(reviewsTable),
  orderDetails: many(ordersDetailsTable),
  discounts: many(bookDiscountsTable),
}));
