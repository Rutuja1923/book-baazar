import {
  pgTable,
  uuid,
  varchar,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customersTable } from "../customers";
import { discountsTable } from "../discounts";
import { shippersTable } from "../shippers";

/**
 * Orders table - tracks customer purchases
 * Indexed by customer and date for reporting
 */
export const ordersTable = pgTable(
  "orders",
  {
    orderId: uuid("order_id").primaryKey().defaultRandom(),
    custId: uuid("cust_id")
      .notNull()
      .references(() => customersTable.custId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    date: date("date").notNull(),
    discountId: uuid("discount_id").references(
      () => discountsTable.discountId,
      {
        onDelete: "set null",
        onUpdate: "cascade",
      }
    ),
    shipperId: uuid("shipper_id")
      .notNull()
      .references(() => shippersTable.shipperId, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    state: varchar("state", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("order_customer_idx").on(table.custId),
    index("order_date_idx").on(table.date),
    index("order_status_idx").on(table.state),
  ]
);
