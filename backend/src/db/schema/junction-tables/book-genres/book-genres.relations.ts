import { relations } from "drizzle-orm";
import { bookGenresTable } from "../book-genres";
import { booksTable } from "@db/schema/books";
import { genresTable } from "@db/schema/genres";

/**
 * Book-Genre relationships belong to:
 * - One book
 * - One genre
 */
export const bookGenresRelations = relations(bookGenresTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [bookGenresTable.bookIsbn],
    references: [booksTable.isbn],
  }),
  genre: one(genresTable, {
    fields: [bookGenresTable.genreId],
    references: [genresTable.genreId],
  }),
}));
