import { relations } from "drizzle-orm";
import { companiesTable } from "@db/schema/companies";
import { authorsTable } from "@db/schema/authors";
import { authorCompanyAffiliationsTable } from "../author-company-affiliations";

/**
 * Author-Company affiliations belong to:
 * - One author
 * - One company
 */
export const authorCompanyAffiliationsRelations = relations(
  authorCompanyAffiliationsTable,
  ({ one }) => ({
    author: one(authorsTable, {
      fields: [authorCompanyAffiliationsTable.authorId],
      references: [authorsTable.authorId],
    }),
    company: one(companiesTable, {
      fields: [authorCompanyAffiliationsTable.companyId],
      references: [companiesTable.companyId],
    }),
  })
);
