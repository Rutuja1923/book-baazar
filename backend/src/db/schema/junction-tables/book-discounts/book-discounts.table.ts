import { pgTable, varchar, uuid, index, primaryKey } from "drizzle-orm/pg-core";
import { booksTable } from "@db/schema/books";
import { discountsTable } from "@db/schema/discounts";

/**
 * Junction table for many-to-many relationship between books and discounts
 */
export const bookDiscountsTable = pgTable(
  "book_discounts",
  {
    bookIsbn: varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discountsTable.discountId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.bookIsbn, table.discountId] }),
    index("book_discount_book_idx").on(table.bookIsbn),
    index("book_discount_discount_idx").on(table.discountId),
  ]
);
