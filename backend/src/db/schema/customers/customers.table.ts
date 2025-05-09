import { pgTable, varchar, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Customers table with authentication and address information
 * Indexes added for email (unique) and searchable fields
 */
export const customersTable = pgTable(
  "customers",
  {
    custId: uuid("cust_id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    passwordHash: varchar("passwordhash", { length: 100 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 15 }).notNull(), // Increased length for international numbers
    city: varchar("city", { length: 100 }).notNull(),
    street: varchar("street", { length: 100 }),
    buildingNo: varchar("building_no", { length: 5 }),
    flatNo: varchar("flat_no", { length: 5 }),
    postalCode: varchar("postal_code", { length: 10 }), // Increased length for international formats
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    sql`CHECK (${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')`,
    index("customer_email_idx").on(table.email),
    index("customer_name_idx").on(table.lastName, table.firstName),
    index("customer_city_idx").on(table.city),
  ]
);
