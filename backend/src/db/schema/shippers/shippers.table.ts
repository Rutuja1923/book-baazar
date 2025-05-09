import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Shipping providers table
 */
export const shippersTable = pgTable(
  "shippers",
  {
    shipperId: uuid("shipper_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 15 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("shipper_name_idx").on(table.name)]
);
