import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

/**
 * Customers table with authentication and address information
 * Indexes added for email (unique) and searchable fields
 */
export const customersTable = p.pgTable(
  "customers",
  {
    custId: p.uuid("cust_id").primaryKey().defaultRandom(),
    firstName: p.varchar("first_name", { length: 100 }).notNull(),
    lastName: p.varchar("last_name", { length: 100 }).notNull(),
    email: p.varchar("email", { length: 100 }).unique().notNull(),
    passwordHash: p.varchar("passwordhash", { length: 100 }).notNull(),
    phoneNumber: p.varchar("phone_number", { length: 15 }).notNull(), // Increased length for international numbers
    city: p.varchar("city", { length: 100 }).notNull(),
    street: p.varchar("street", { length: 100 }),
    buildingNo: p.varchar("building_no", { length: 5 }),
    flatNo: p.varchar("flat_no", { length: 5 }),
    postalCode: p.varchar("postal_code", { length: 10 }), // Increased length for international formats
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
    updatedAt: p
      .timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    sql`CHECK (${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')`,
    p.index("customer_email_idx").on(table.email),
    p.index("customer_name_idx").on(table.lastName, table.firstName),
    p.index("customer_city_idx").on(table.city),
  ]
);

/**
 * Authors table with biographic information
 * Indexed by name for search
 */
export const authorsTable = p.pgTable(
  "authors",
  {
    authorId: p.uuid("author_id").primaryKey().defaultRandom(),
    firstName: p.varchar("first_name", { length: 100 }).notNull(),
    secondName: p.varchar("second_name", { length: 100 }),
    bio: p.text("bio"),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
    updatedAt: p
      .timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [p.index("author_name_idx").on(table.firstName, table.secondName)]
);

/**
 * Publishers table with contact information
 */
export const publishersTable = p.pgTable(
  "publishers",
  {
    publisherId: p.uuid("publisher_id").primaryKey().defaultRandom(),
    name: p.varchar("name", { length: 100 }).notNull(),
    phoneNumber: p.varchar("phone_number", { length: 15 }),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
    updatedAt: p
      .timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [p.index("publisher_name_idx").on(table.name)]
);

/**
 * Shipping providers table
 */
export const shippersTable = p.pgTable(
  "shippers",
  {
    shipperId: p.uuid("shipper_id").primaryKey().defaultRandom(),
    name: p.varchar("name", { length: 100 }).notNull(),
    phoneNumber: p.varchar("phone_number", { length: 15 }),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [p.index("shipper_name_idx").on(table.name)]
);

/**
 * Companies that authors may be affiliated with
 */
export const companiesTable = p.pgTable(
  "companies",
  {
    companyId: p.uuid("company_id").primaryKey().defaultRandom(),
    name: p.varchar("name", { length: 100 }).notNull(),
    description: p.text("description"),
    website: p.varchar("website", { length: 255 }),
    location: p.varchar("location", { length: 100 }).notNull(),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
    updatedAt: p
      .timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    p.index("company_name_idx").on(table.name),
    p.index("company_location_idx").on(table.location),
  ]
);

/**
 * Books table - core product entity
 * Indexed by title and author for search
 */
export const booksTable = p.pgTable(
  "books",
  {
    isbn: p.varchar("book_isbn", { length: 13 }).primaryKey(),
    title: p.varchar("title", { length: 255 }).notNull(), // Increased length for long titles
    publicationDate: p.date("publication_date"),
    edition: p.integer("edition"),
    availableQuantity: p.integer("available_quantity").notNull().default(0),
    price: p.numeric("price", { precision: 10, scale: 2 }).notNull(), // Increased precision
    authorId: p
      .uuid("author_id")
      .references(() => authorsTable.authorId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    publisherId: p
      .uuid("publisher_id")
      .references(() => publishersTable.publisherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
    updatedAt: p
      .timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    p.index("book_title_idx").on(table.title),
    p.index("book_author_idx").on(table.authorId),
    p.index("book_publisher_idx").on(table.publisherId),
  ]
);

/**
 * Junction table for many-to-many relationship between authors and companies
 */
export const authorCompanyAffiliationsTable = p.pgTable(
  "author_company_affiliations",
  {
    affiliationId: p.uuid("affiliation_id").primaryKey().defaultRandom(),
    authorId: p
      .uuid("author_id")
      .notNull()
      .references(() => authorsTable.authorId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    companyId: p
      .uuid("company_id")
      .notNull()
      .references(() => companiesTable.companyId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    p.index("affiliation_author_idx").on(table.authorId),
    p.index("affiliation_company_idx").on(table.companyId),
  ]
);

/**
 * Orders table - tracks customer purchases
 * Indexed by customer and date for reporting
 */
export const ordersTable = p.pgTable(
  "orders",
  {
    orderId: p.uuid("order_id").primaryKey().defaultRandom(),
    custId: p
      .uuid("cust_id")
      .notNull()
      .references(() => customersTable.custId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    date: p.date("date").notNull(),
    discountId: p
      .uuid("discount_id")
      .references(() => discountsTable.discountId, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),
    shipperId: p
      .uuid("shipper_id")
      .notNull()
      .references(() => shippersTable.shipperId, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    state: p.varchar("state", { length: 50 }).notNull(),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
    updatedAt: p
      .timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    p.index("order_customer_idx").on(table.custId),
    p.index("order_date_idx").on(table.date),
    p.index("order_status_idx").on(table.state),
  ]
);

/**
 * Order details - line items for each order
 * Composite primary key on orderId + bookIsbn
 */
export const ordersDetailsTable = p.pgTable(
  "orders_details",
  {
    bookIsbn: p
      .varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    orderId: p
      .uuid("order_id")
      .notNull()
      .references(() => ordersTable.orderId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    amount: p.integer("amount").notNull(),
    unitPrice: p.numeric("unit_price", { precision: 10, scale: 2 }).notNull(), // Added to preserve historical price
  },
  (table) => [
    p.primaryKey({ columns: [table.orderId, table.bookIsbn] }),
    p.index("order_detail_book_idx").on(table.bookIsbn),
  ]
);

/**
 * Book genres/categories
 */
export const genresTable = p.pgTable(
  "genres",
  {
    genreId: p.uuid("genre_id").primaryKey().defaultRandom(),
    name: p.varchar("name", { length: 100 }).notNull().unique(),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [p.index("genre_name_idx").on(table.name)]
);

/**
 * Junction table for many-to-many relationship between books and genres
 */
export const bookGenresTable = p.pgTable(
  "book_genres",
  {
    bookIsbn: p
      .varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    genreId: p
      .uuid("genre_id")
      .notNull()
      .references(() => genresTable.genreId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    p.primaryKey({ columns: [table.bookIsbn, table.genreId] }),
    p.index("book_genre_book_idx").on(table.bookIsbn),
    p.index("book_genre_genre_idx").on(table.genreId),
  ]
);

/**
 * Customer reviews of books
 * Includes rating constraint (1-5 stars)
 */
export const reviewsTable = p.pgTable(
  "reviews",
  {
    reviewId: p.uuid("review_id").primaryKey().defaultRandom(),
    bookIsbn: p
      .varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    customerId: p
      .uuid("customer_id")
      .notNull()
      .references(() => customersTable.custId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    review: p.text("review").notNull(),
    stars: p.numeric("stars", { precision: 2, scale: 1 }).notNull(),
    date: p.date("date").notNull(),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    sql`CHECK (${table.stars} >= 1 AND ${table.stars} <= 5)`,
    p.index("review_book_idx").on(table.bookIsbn),
    p.index("review_customer_idx").on(table.customerId),
    p.index("review_stars_idx").on(table.stars),
  ]
);

/**
 * Discount definitions
 */
export const discountsTable = p.pgTable(
  "discounts",
  {
    discountId: p.uuid("discount_id").primaryKey().defaultRandom(),
    name: p.varchar("name", { length: 100 }).notNull(),
    value: p.numeric("value", { precision: 5, scale: 2 }).notNull(), // Percentage value (e.g., 10.00 = 10%)
    startDate: p.date("start_date").notNull(),
    endDate: p.date("end_date").notNull(),
    createdAt: p.timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    p.index("discount_date_range_idx").on(table.startDate, table.endDate),
  ]
);

/**
 * Junction table for many-to-many relationship between books and discounts
 */
export const bookDiscountsTable = p.pgTable(
  "book_discounts",
  {
    bookIsbn: p
      .varchar("book_isbn", { length: 13 })
      .notNull()
      .references(() => booksTable.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    discountId: p
      .uuid("discount_id")
      .notNull()
      .references(() => discountsTable.discountId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    p.primaryKey({ columns: [table.bookIsbn, table.discountId] }),
    p.index("book_discount_book_idx").on(table.bookIsbn),
    p.index("book_discount_discount_idx").on(table.discountId),
  ]
);

/**
 * Junction table for many-to-many relationship between customers and discounts
 */
export const customerDiscountsTable = p.pgTable(
  "customer_discounts",
  {
    custId: p
      .uuid("cust_id")
      .notNull()
      .references(() => customersTable.custId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    discountId: p
      .uuid("discount_id")
      .notNull()
      .references(() => discountsTable.discountId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    p.primaryKey({ columns: [table.custId, table.discountId] }),
    p.index("customer_discount_customer_idx").on(table.custId),
    p.index("customer_discount_discount_idx").on(table.discountId),
  ]
);

// ====================== RELATIONSHIPS ====================== //

/**
 * Customers can have many:
 * - Orders
 * - Reviews
 * - Discounts (through customer_discounts)
 */
export const customersRelations = relations(customersTable, ({ many }) => ({
  orders: many(ordersTable),
  reviews: many(reviewsTable),
  discounts: many(customerDiscountsTable),
}));

/**
 * Authors can have many:
 * - Books
 * - Company affiliations
 */
export const authorsRelations = relations(authorsTable, ({ many }) => ({
  books: many(booksTable),
  companies: many(authorCompanyAffiliationsTable),
}));

/**
 * Books belong to:
 * - One author
 * - One publisher
 * And can have many:
 * - Genres (through book_genres)
 * - Reviews
 * - Orders (through orders_details)
 * - Discounts (through book_discounts)
 */
export const booksRelations = relations(booksTable, ({ many, one }) => ({
  author: one(authorsTable, {
    fields: [booksTable.authorId],
    references: [authorsTable.authorId],
  }),
  publisher: one(publishersTable, {
    fields: [booksTable.publisherId],
    references: [publishersTable.publisherId],
  }),
  genres: many(bookGenresTable),
  reviews: many(reviewsTable),
  orderDetails: many(ordersDetailsTable),
  discounts: many(bookDiscountsTable),
}));

/**
 * Publishers can have many books
 */
export const publishersRelations = relations(publishersTable, ({ many }) => ({
  books: many(booksTable),
}));

/**
 * Shippers can have many orders
 */
export const shippersRelations = relations(shippersTable, ({ many }) => ({
  orders: many(ordersTable),
}));

/**
 * Companies can have many author affiliations
 */
export const companiesRelations = relations(companiesTable, ({ many }) => ({
  authors: many(authorCompanyAffiliationsTable),
}));

/**
 * Author-Company affiliations belong to:
 * - One author
 * - One company
 */
export const authorCompanyAffiliationsRelations = relations(
  authorCompanyAffiliationsTable,
  ({ one }) => ({
    author: one(authorsTable, {
      fields: [authorCompanyAffiliationsTable.authorId],
      references: [authorsTable.authorId],
    }),
    company: one(companiesTable, {
      fields: [authorCompanyAffiliationsTable.companyId],
      references: [companiesTable.companyId],
    }),
  })
);

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

/**
 * Order details belong to:
 * - One order
 * - One book
 */
export const ordersDetailsRelations = relations(
  ordersDetailsTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [ordersDetailsTable.orderId],
      references: [ordersTable.orderId],
    }),
    book: one(booksTable, {
      fields: [ordersDetailsTable.bookIsbn],
      references: [booksTable.isbn],
    }),
  })
);

/**
 * Genres can have many books (through book_genres)
 */
export const genresRelations = relations(genresTable, ({ many }) => ({
  books: many(bookGenresTable),
}));

/**
 * Book-Genre relationships belong to:
 * - One book
 * - One genre
 */
export const bookGenresRelations = relations(bookGenresTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [bookGenresTable.bookIsbn],
    references: [booksTable.isbn],
  }),
  genre: one(genresTable, {
    fields: [bookGenresTable.genreId],
    references: [genresTable.genreId],
  }),
}));

/**
 * Reviews belong to:
 * - One book
 * - One customer
 */
export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [reviewsTable.bookIsbn],
    references: [booksTable.isbn],
  }),
  customer: one(customersTable, {
    fields: [reviewsTable.customerId],
    references: [customersTable.custId],
  }),
}));

/**
 * Discounts can be applied to:
 * - Many books (through book_discounts)
 * - Many customers (through customer_discounts)
 */
export const discountsRelations = relations(discountsTable, ({ many }) => ({
  bookDiscounts: many(bookDiscountsTable),
  customerDiscounts: many(customerDiscountsTable),
}));

/**
 * Book-Discount relationships belong to:
 * - One book
 * - One discount
 */
export const bookDiscountsRelations = relations(
  bookDiscountsTable,
  ({ one }) => ({
    book: one(booksTable, {
      fields: [bookDiscountsTable.bookIsbn],
      references: [booksTable.isbn],
    }),
    discount: one(discountsTable, {
      fields: [bookDiscountsTable.discountId],
      references: [discountsTable.discountId],
    }),
  })
);

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
