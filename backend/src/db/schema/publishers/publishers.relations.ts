import { relations } from "drizzle-orm";
import { booksTable } from "../books";
import { publishersTable } from "../publishers";

/**
 * Publishers can have many books
 */
export const publishersRelations = relations(publishersTable, ({ many }) => ({
  books: many(booksTable),
}));
