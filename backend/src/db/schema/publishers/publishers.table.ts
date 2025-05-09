import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Publishers table with contact information
 */
export const publishersTable = pgTable(
  "publishers",
  {
    publisherId: uuid("publisher_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 15 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("publisher_name_idx").on(table.name)]
);
