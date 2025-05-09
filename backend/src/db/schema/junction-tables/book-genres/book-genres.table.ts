import { pgTable, varchar, uuid, index, primaryKey } from "drizzle-orm/pg-core";
import { booksTable } from "@db/schema/books";
import { genresTable } from "@db/schema/genres";

/**
 * Junction table for many-to-many relationship between books and genres
 */
export const bookGenresTable = pgTable(
  "book_genres",
  {
    bookIsbn: varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    genreId: uuid("genre_id")
      .notNull()
      .references(() => genresTable.genreId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.bookIsbn, table.genreId] }),
    index("book_genre_book_idx").on(table.bookIsbn),
    index("book_genre_genre_idx").on(table.genreId),
  ]
);
