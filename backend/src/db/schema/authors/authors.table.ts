import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
/**
 * Authors table with biographic information
 * Indexed by name for search
 */
export const authorsTable = pgTable(
  "authors",
  {
    authorId: uuid("author_id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    secondName: varchar("second_name", { length: 100 }),
    bio: text("bio"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("author_name_idx").on(table.firstName, table.secondName)]
);
