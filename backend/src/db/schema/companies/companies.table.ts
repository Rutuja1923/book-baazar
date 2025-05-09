import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  text,
} from "drizzle-orm/pg-core";

/**
 * Companies that authors may be affiliated with
 */
export const companiesTable = pgTable(
  "companies",
  {
    companyId: uuid("company_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    website: varchar("website", { length: 255 }),
    location: varchar("location", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("company_name_idx").on(table.name),
    index("company_location_idx").on(table.location),
  ]
);
