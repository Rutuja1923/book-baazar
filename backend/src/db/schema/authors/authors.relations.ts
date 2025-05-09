import { relations } from "drizzle-orm";
import { booksTable } from "../books";
import { authorsTable } from "../authors";
import { authorCompanyAffiliationsTable } from "../junction-tables/author-company-affiliations";

/**
 * Authors can have many:
 * - Books
 * - Company affiliations
 */
export const authorsRelations = relations(authorsTable, ({ many }) => ({
  books: many(booksTable),
  companies: many(authorCompanyAffiliationsTable),
}));
