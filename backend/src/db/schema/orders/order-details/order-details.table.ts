import {
  pgTable,
  varchar,
  integer,
  numeric,
  uuid,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { ordersTable } from "../orders.table";
import { booksTable } from "@db/schema/books";

/**
 * Order details - line items for each order
 * Composite primary key on orderId + bookIsbn
 */
export const ordersDetailsTable = pgTable(
  "orders_details",
  {
    bookIsbn: varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => ordersTable.orderId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    amount: integer("amount").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(), // Added to preserve historical price
  },
  (table) => [
    primaryKey({ columns: [table.orderId, table.bookIsbn] }),
    index("order_detail_book_idx").on(table.bookIsbn),
  ]
);
