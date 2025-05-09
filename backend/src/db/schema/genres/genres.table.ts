import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Book genres/categories
 */
export const genresTable = pgTable(
  "genres",
  {
    genreId: uuid("genre_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("genre_name_idx").on(table.name)]
);
