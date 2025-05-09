import {
  pgTable,
  varchar,
  integer,
  numeric,
  date,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { authorsTable } from "../authors";
import { publishersTable } from "../publishers";

/**
 * Books table - core product entity
 * Indexed by title and author for search
 */
export const booksTable = pgTable(
  "books",
  {
    isbn: varchar("book_isbn", { length: 13 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(), // Increased length for long titles
    publicationDate: date("publication_date"),
    edition: integer("edition"),
    availableQuantity: integer("available_quantity").notNull().default(0),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Increased precision
    authorId: uuid("author_id")
      .references(() => authorsTable.authorId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    publisherId: uuid("publisher_id")
      .references(() => publishersTable.publisherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("book_title_idx").on(table.title),
    index("book_author_idx").on(table.authorId),
    index("book_publisher_idx").on(table.publisherId),
  ]
);
