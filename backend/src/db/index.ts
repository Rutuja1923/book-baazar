import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "./db-url";
import * as schema from "@db/schema";

const client = postgres(DATABASE_URL);

export const db = drizzle(client, {
  schema: {
    // Customers
    customersTable: schema.customersTable,
    customersRelations: schema.customersRelations,

    // Authors
    authorsTable: schema.authorsTable,
    authorsRelations: schema.authorsRelations,

    // Publishers
    publishersTable: schema.publishersTable,
    publishersRelations: schema.publishersRelations,

    // Shippers
    shippersTable: schema.shippersTable,
    shippersRelations: schema.shippersRelations,

    // Companies
    companiesTable: schema.companiesTable,
    companiesRelations: schema.companiesRelations,

    // Books
    booksTable: schema.booksTable,
    booksRelations: schema.booksRelations,

    // Genres
    genresTable: schema.genresTable,
    genresRelations: schema.genresRelations,

    // Discounts
    discountsTable: schema.discountsTable,
    discountsRelations: schema.discountsRelations,

    // Orders
    ordersTable: schema.ordersTable,
    ordersRelations: schema.ordersRelations,

    // Order Details
    ordersDetailsTable: schema.ordersDetailsTable,
    ordersDetailsRelations: schema.ordersDetailsRelations,

    // Reviews
    reviewsTable: schema.reviewsTable,
    reviewsRelations: schema.reviewsRelations,

    // Junction Tables
    authorCompanyAffiliationsTable: schema.authorCompanyAffiliationsTable,
    authorCompanyAffiliationsRelations:
      schema.authorCompanyAffiliationsRelations,

    bookGenresTable: schema.bookGenresTable,
    bookGenresRelations: schema.bookGenresRelations,

    bookDiscountsTable: schema.bookDiscountsTable,
    bookDiscountsRelations: schema.bookDiscountsRelations,

    customerDiscountsTable: schema.customerDiscountsTable,
    customerDiscountsRelations: schema.customerDiscountsRelations,
  },
  logger: true,
});

export type Database = typeof db;
