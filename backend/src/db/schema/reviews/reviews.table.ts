import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  index,
  text,
  numeric,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { customersTable } from "../customers";
import { booksTable } from "../books";

/**
 * Customer reviews of books
 * Includes rating constraint (1-5 stars)
 */
export const reviewsTable = pgTable(
  "reviews",
  {
    reviewId: uuid("review_id").primaryKey().defaultRandom(),
    bookIsbn: varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customersTable.custId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    review: text("review").notNull(),
    stars: numeric("stars", { precision: 2, scale: 1 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    sql`CHECK (${table.stars} >= 1 AND ${table.stars} <= 5)`,
    index("review_book_idx").on(table.bookIsbn),
    index("review_customer_idx").on(table.customerId),
    index("review_stars_idx").on(table.stars),
  ]
);
