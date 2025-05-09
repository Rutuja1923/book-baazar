import { relations } from "drizzle-orm";
import { customerDiscountsTable } from "../customer-discounts";
import { customersTable } from "@db/schema/customers";
import { discountsTable } from "@db/schema/discounts";

/**
 * Customer-Discount relationships belong to:
 * - One customer
 * - One discount
 */
export const customerDiscountsRelations = relations(
  customerDiscountsTable,
  ({ one }) => ({
    customer: one(customersTable, {
      fields: [customerDiscountsTable.custId],
      references: [customersTable.custId],
    }),
    discount: one(discountsTable, {
      fields: [customerDiscountsTable.discountId],
      references: [discountsTable.discountId],
    }),
  })
);
