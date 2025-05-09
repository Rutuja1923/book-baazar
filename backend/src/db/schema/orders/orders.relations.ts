import { relations } from "drizzle-orm";
import { ordersTable } from "../orders";
import { ordersDetailsTable } from "./order-details";
import { customersTable } from "../customers";
import { discountsTable } from "../discounts";
import { shippersTable } from "../shippers";

/**
 * Orders belong to:
 * - One customer
 * - One shipper
 * - Optional discount
 * And have many:
 * - Order details (line items)
 */
export const ordersRelations = relations(ordersTable, ({ many, one }) => ({
  customer: one(customersTable, {
    fields: [ordersTable.custId],
    references: [customersTable.custId],
  }),
  shipper: one(shippersTable, {
    fields: [ordersTable.shipperId],
    references: [shippersTable.shipperId],
  }),
  discount: one(discountsTable, {
    fields: [ordersTable.discountId],
    references: [discountsTable.discountId],
  }),
  details: many(ordersDetailsTable),
}));
