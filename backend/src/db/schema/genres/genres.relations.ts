import { relations } from "drizzle-orm";
import { genresTable } from "./genres.table";
import { bookGenresTable } from "../junction-tables/book-genres/book-genres.table";

/**
 * Genres can have many books (through book_genres)
 */
export const genresRelations = relations(genresTable, ({ many }) => ({
  books: many(bookGenresTable),
}));
