CREATE TABLE "authors" (
	"author_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"second_name" varchar(100),
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"book_isbn" varchar(13) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"publication_date" date,
	"edition" integer,
	"available_quantity" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"author_id" uuid NOT NULL,
	"publisher_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"company_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"website" varchar(255),
	"location" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"cust_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"passwordhash" varchar(100) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"city" varchar(100) NOT NULL,
	"street" varchar(100),
	"building_no" varchar(5),
	"flat_no" varchar(5),
	"postal_code" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "discounts" (
	"discount_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"value" numeric(5, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"genre_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "publishers" (
	"publisher_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(15),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shippers" (
	"shipper_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(15),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cust_id" uuid NOT NULL,
	"date" date NOT NULL,
	"discount_id" uuid,
	"shipper_id" uuid NOT NULL,
	"state" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders_details" (
	"book_isbn" varchar(13) NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	CONSTRAINT "orders_details_order_id_book_isbn_pk" PRIMARY KEY("order_id","book_isbn")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_isbn" varchar(13) NOT NULL,
	"customer_id" uuid NOT NULL,
	"review" text NOT NULL,
	"stars" numeric(2, 1) NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "author_company_affiliations" (
	"affiliation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_genres" (
	"book_isbn" varchar(13) NOT NULL,
	"genre_id" uuid NOT NULL,
	CONSTRAINT "book_genres_book_isbn_genre_id_pk" PRIMARY KEY("book_isbn","genre_id")
);
--> statement-breakpoint
CREATE TABLE "book_discounts" (
	"book_isbn" varchar(13) NOT NULL,
	"discount_id" uuid NOT NULL,
	CONSTRAINT "book_discounts_book_isbn_discount_id_pk" PRIMARY KEY("book_isbn","discount_id")
);
--> statement-breakpoint
CREATE TABLE "customer_discounts" (
	"cust_id" uuid NOT NULL,
	"discount_id" uuid NOT NULL,
	CONSTRAINT "customer_discounts_cust_id_discount_id_pk" PRIMARY KEY("cust_id","discount_id")
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_authors_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("author_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_publisher_id_publishers_publisher_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."publishers"("publisher_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_cust_id_customers_cust_id_fk" FOREIGN KEY ("cust_id") REFERENCES "public"."customers"("cust_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_id_discounts_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discounts"("discount_id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipper_id_shippers_shipper_id_fk" FOREIGN KEY ("shipper_id") REFERENCES "public"."shippers"("shipper_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders_details" ADD CONSTRAINT "orders_details_book_isbn_books_book_isbn_fk" FOREIGN KEY ("book_isbn") REFERENCES "public"."books"("book_isbn") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders_details" ADD CONSTRAINT "orders_details_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_book_isbn_books_book_isbn_fk" FOREIGN KEY ("book_isbn") REFERENCES "public"."books"("book_isbn") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_customers_cust_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("cust_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "author_company_affiliations" ADD CONSTRAINT "author_company_affiliations_author_id_authors_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("author_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "author_company_affiliations" ADD CONSTRAINT "author_company_affiliations_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_book_isbn_books_book_isbn_fk" FOREIGN KEY ("book_isbn") REFERENCES "public"."books"("book_isbn") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_genre_id_genres_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("genre_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "book_discounts" ADD CONSTRAINT "book_discounts_book_isbn_books_book_isbn_fk" FOREIGN KEY ("book_isbn") REFERENCES "public"."books"("book_isbn") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "book_discounts" ADD CONSTRAINT "book_discounts_discount_id_discounts_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discounts"("discount_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer_discounts" ADD CONSTRAINT "customer_discounts_cust_id_customers_cust_id_fk" FOREIGN KEY ("cust_id") REFERENCES "public"."customers"("cust_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer_discounts" ADD CONSTRAINT "customer_discounts_discount_id_discounts_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discounts"("discount_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "author_name_idx" ON "authors" USING btree ("first_name","second_name");--> statement-breakpoint
CREATE INDEX "book_title_idx" ON "books" USING btree ("title");--> statement-breakpoint
CREATE INDEX "book_author_idx" ON "books" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "book_publisher_idx" ON "books" USING btree ("publisher_id");--> statement-breakpoint
CREATE INDEX "company_name_idx" ON "companies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "company_location_idx" ON "companies" USING btree ("location");--> statement-breakpoint
CREATE INDEX "customer_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customer_name_idx" ON "customers" USING btree ("last_name","first_name");--> statement-breakpoint
CREATE INDEX "customer_city_idx" ON "customers" USING btree ("city");--> statement-breakpoint
CREATE INDEX "discount_date_range_idx" ON "discounts" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "genre_name_idx" ON "genres" USING btree ("name");--> statement-breakpoint
CREATE INDEX "publisher_name_idx" ON "publishers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "shipper_name_idx" ON "shippers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "order_customer_idx" ON "orders" USING btree ("cust_id");--> statement-breakpoint
CREATE INDEX "order_date_idx" ON "orders" USING btree ("date");--> statement-breakpoint
CREATE INDEX "order_status_idx" ON "orders" USING btree ("state");--> statement-breakpoint
CREATE INDEX "order_detail_book_idx" ON "orders_details" USING btree ("book_isbn");--> statement-breakpoint
CREATE INDEX "review_book_idx" ON "reviews" USING btree ("book_isbn");--> statement-breakpoint
CREATE INDEX "review_customer_idx" ON "reviews" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "review_stars_idx" ON "reviews" USING btree ("stars");--> statement-breakpoint
CREATE INDEX "affiliation_author_idx" ON "author_company_affiliations" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "affiliation_company_idx" ON "author_company_affiliations" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "book_genre_book_idx" ON "book_genres" USING btree ("book_isbn");--> statement-breakpoint
CREATE INDEX "book_genre_genre_idx" ON "book_genres" USING btree ("genre_id");--> statement-breakpoint
CREATE INDEX "book_discount_book_idx" ON "book_discounts" USING btree ("book_isbn");--> statement-breakpoint
CREATE INDEX "book_discount_discount_idx" ON "book_discounts" USING btree ("discount_id");--> statement-breakpoint
CREATE INDEX "customer_discount_customer_idx" ON "customer_discounts" USING btree ("cust_id");--> statement-breakpoint
CREATE INDEX "customer_discount_discount_idx" ON "customer_discounts" USING btree ("discount_id");