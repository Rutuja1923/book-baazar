import { pgTable, uuid, index, primaryKey } from "drizzle-orm/pg-core";
import { customersTable } from "@db/schema/customers";
import { discountsTable } from "@db/schema/discounts";

/**
 * Junction table for many-to-many relationship between customers and discounts
 */
export const customerDiscountsTable = pgTable(
  "customer_discounts",
  {
    custId: uuid("cust_id")
      .notNull()
      .references(() => customersTable.custId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discountsTable.discountId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.custId, table.discountId] }),
    index("customer_discount_customer_idx").on(table.custId),
    index("customer_discount_discount_idx").on(table.discountId),
  ]
);
