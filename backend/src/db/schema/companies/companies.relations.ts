import { relations } from "drizzle-orm";
import { companiesTable } from "../companies";
import { authorCompanyAffiliationsTable } from "../junction-tables/author-company-affiliations";

/**
 * Companies can have many author affiliations
 */
export const companiesRelations = relations(companiesTable, ({ many }) => ({
  authors: many(authorCompanyAffiliationsTable),
}));
