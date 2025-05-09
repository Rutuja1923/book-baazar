import {
  pgTable,
  uuid,
  varchar,
  numeric,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

/**
 * Discount definitions
 */
export const discountsTable = pgTable(
  "discounts",
  {
    discountId: uuid("discount_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    value: numeric("value", { precision: 5, scale: 2 }).notNull(), // Percentage value (e.g., 10.00 = 10%)
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("discount_date_range_idx").on(table.startDate, table.endDate),
  ]
);
