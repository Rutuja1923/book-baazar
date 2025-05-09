import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { authorsTable } from "@db/schema/authors";
import { companiesTable } from "@db/schema/companies";

/**
 * Junction table for many-to-many relationship between authors and companies
 */
export const authorCompanyAffiliationsTable = pgTable(
  "author_company_affiliations",
  {
    affiliationId: uuid("affiliation_id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authorsTable.authorId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companiesTable.companyId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("affiliation_author_idx").on(table.authorId),
    index("affiliation_company_idx").on(table.companyId),
  ]
);
