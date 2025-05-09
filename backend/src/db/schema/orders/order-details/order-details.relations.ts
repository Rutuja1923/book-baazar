import { relations } from "drizzle-orm";
import { ordersTable } from "../orders.table";
import { ordersDetailsTable } from "../order-details";
import { booksTable } from "@db/schema/books";

/**
 * Order details belong to:
 * - One order
 * - One book
 */
export const ordersDetailsRelations = relations(
  ordersDetailsTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [ordersDetailsTable.orderId],
      references: [ordersTable.orderId],
    }),
    book: one(booksTable, {
      fields: [ordersDetailsTable.bookIsbn],
      references: [booksTable.isbn],
    }),
  })
);
