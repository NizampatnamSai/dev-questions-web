// 30 database topics for Study Hub.
export default [
  {
    id: "database-relational-vs-nosql",
    category: "database",
    topic: "Database Types",
    title: "Relational vs NoSQL Databases",
    difficulty: "Basic",
    summary:
      "Relational databases store structured data in tables with fixed schemas; NoSQL databases store flexible, often schema-less data optimized for scale and specific access patterns.",
    explanation:
      "Relational databases (PostgreSQL, MySQL) enforce a fixed schema, use SQL, and guarantee strong consistency via ACID transactions, making them ideal for structured data with complex relationships. NoSQL databases (MongoDB, Cassandra, Redis, Neo4j) trade some consistency guarantees for flexibility, horizontal scalability, and performance on specific access patterns like documents, key-value pairs, wide columns, or graphs. Relational databases scale vertically more easily and enforce referential integrity through foreign keys, while many NoSQL systems scale horizontally by sharding across nodes. The choice depends on data shape, consistency needs, and scale requirements rather than one being universally better.",
    code: "-- Relational: fixed schema, joins across tables\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100) UNIQUE\n);\n\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  user_id INT REFERENCES users(id),\n  total DECIMAL(10,2)\n);\n\n// NoSQL (MongoDB): flexible, embedded document\ndb.users.insertOne({\n  name: 'Alice',\n  email: 'alice@example.com',\n  orders: [\n    { total: 49.99, items: ['book', 'pen'] }\n  ]\n});",
    interviewQuestion:
      "When would you choose a NoSQL database over a relational database, and what tradeoffs does that involve?",
  },
  {
    id: "database-normalization",
    category: "database",
    topic: "Schema Design",
    title: "Normalization (1NF/2NF/3NF)",
    difficulty: "Intermediate",
    summary:
      "Normalization organizes tables to reduce data redundancy and improve integrity by progressively removing repeating groups, partial dependencies, and transitive dependencies.",
    explanation:
      "First Normal Form (1NF) requires atomic column values and no repeating groups. Second Normal Form (2NF) requires 1NF plus every non-key column depends on the entire primary key, not just part of a composite key. Third Normal Form (3NF) requires 2NF plus no transitive dependencies, meaning non-key columns depend only on the key, not on other non-key columns. Normalization reduces update anomalies and duplicated data but can require more joins to reconstruct information. In practice, most OLTP systems target 3NF, then selectively denormalize for performance where needed.",
    code: "-- Unnormalized: repeating group, transitive dependency\n-- orders(order_id, customer_name, customer_email, product1, product2)\n\n-- 3NF: split into separate entities\nCREATE TABLE customers (\n  customer_id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100)\n);\n\nCREATE TABLE orders (\n  order_id SERIAL PRIMARY KEY,\n  customer_id INT REFERENCES customers(customer_id),\n  order_date DATE\n);\n\nCREATE TABLE order_items (\n  order_id INT REFERENCES orders(order_id),\n  product_id INT,\n  quantity INT,\n  PRIMARY KEY (order_id, product_id)\n);",
    interviewQuestion:
      "Explain the difference between 2NF and 3NF with an example of a violation for each.",
  },
  {
    id: "database-denormalization-tradeoffs",
    category: "database",
    topic: "Schema Design",
    title: "Denormalization Tradeoffs",
    difficulty: "Intermediate",
    summary:
      "Denormalization intentionally introduces redundancy to reduce joins and speed up reads, at the cost of update complexity and potential data inconsistency.",
    explanation:
      "Denormalization means duplicating data across tables or embedding related data together so reads don't require expensive joins. This is common in read-heavy systems, reporting tables, and document databases like MongoDB where embedding related data is idiomatic. The tradeoff is that writes become more complex because the same fact may need updating in multiple places, increasing the risk of inconsistency. Techniques like materialized views, denormalized reporting tables, and caching aggregate values (e.g., storing a comment_count on a post) are common patterns. The decision should be driven by measured read/write ratios and query patterns, not premature optimization.",
    code: "-- Normalized: requires join + COUNT on every read\nSELECT p.id, p.title, COUNT(c.id) AS comment_count\nFROM posts p\nLEFT JOIN comments c ON c.post_id = p.id\nGROUP BY p.id;\n\n-- Denormalized: precomputed counter column\nALTER TABLE posts ADD COLUMN comment_count INT DEFAULT 0;\n\n-- Maintain it on write\nUPDATE posts SET comment_count = comment_count + 1\nWHERE id = 42;\n\n-- Read becomes a simple lookup\nSELECT id, title, comment_count FROM posts WHERE id = 42;",
    interviewQuestion:
      "Give an example where you'd deliberately denormalize a schema, and how you'd keep the redundant data consistent.",
  },
  {
    id: "database-indexing-fundamentals",
    category: "database",
    topic: "Performance",
    title: "Indexing Fundamentals",
    difficulty: "Intermediate",
    summary:
      "Indexes are auxiliary data structures, usually B-trees, that let the database find rows without scanning the entire table.",
    explanation:
      "An index maps column values to row locations, similar to a book's index, so queries filtering or sorting on that column avoid a full table scan. Most relational databases default to B-tree indexes, which support equality and range queries and keep data sorted. Indexes speed up SELECT queries but slow down INSERT, UPDATE, and DELETE because the index must also be maintained. Composite indexes cover multiple columns and follow a leftmost-prefix rule, so column order matters. Over-indexing wastes storage and write throughput, so indexes should be added based on actual query patterns, not every column.",
    code: "-- Create a single-column index\nCREATE INDEX idx_users_email ON users(email);\n\n-- Composite index: order matters (leftmost prefix)\nCREATE INDEX idx_orders_user_date ON orders(user_id, order_date);\n\n-- This query uses the composite index\nSELECT * FROM orders\nWHERE user_id = 42 AND order_date > '2026-01-01';\n\n-- This query CANNOT use the index efficiently\n-- (skips leftmost column user_id)\nSELECT * FROM orders WHERE order_date > '2026-01-01';\n\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';",
    interviewQuestion:
      "How does a B-tree index speed up lookups, and why can adding too many indexes hurt write performance?",
  },
  {
    id: "database-query-optimization",
    category: "database",
    topic: "Performance",
    title: "Query Optimization",
    difficulty: "Advanced",
    summary:
      "Query optimization involves reading execution plans, choosing correct indexes, and rewriting queries so the database engine does less work.",
    explanation:
      "Database engines use a query planner that estimates the cheapest way to execute a query based on statistics about table size and data distribution. Tools like EXPLAIN or EXPLAIN ANALYZE reveal whether a query uses an index scan, sequential scan, or nested loop join, and how many rows are actually processed versus estimated. Common optimization techniques include adding covering indexes, avoiding SELECT *, rewriting correlated subqueries as joins, avoiding functions on indexed columns in WHERE clauses, and ensuring statistics are up to date via ANALYZE. Query optimization is iterative: measure with real data, identify the bottleneck operation, then apply the targeted fix rather than guessing.",
    code: "-- Bad: function on indexed column prevents index use\nSELECT * FROM users WHERE LOWER(email) = 'alice@example.com';\n\n-- Better: functional index or normalize data at write time\nCREATE INDEX idx_users_email_lower ON users(LOWER(email));\n\n-- Inspect the plan\nEXPLAIN ANALYZE\nSELECT o.id, u.name\nFROM orders o\nJOIN users u ON u.id = o.user_id\nWHERE o.status = 'pending';\n\n-- Avoid correlated subquery, use JOIN instead\nSELECT u.id, u.name\nFROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.status = 'pending'\n);",
    interviewQuestion:
      "Walk through how you'd diagnose and fix a slow SQL query in production using EXPLAIN ANALYZE.",
  },
  {
    id: "database-transactions-acid",
    category: "database",
    topic: "Transactions",
    title: "Transactions & ACID",
    difficulty: "Basic",
    summary:
      "A transaction groups multiple operations into a single all-or-nothing unit, guaranteed by the ACID properties: Atomicity, Consistency, Isolation, Durability.",
    explanation:
      "Atomicity ensures all operations in a transaction succeed or none do. Consistency ensures the database moves from one valid state to another, respecting constraints. Isolation ensures concurrent transactions don't interfere with each other's intermediate states. Durability ensures that once committed, changes survive crashes or power loss. Transactions are essential for operations like transferring money between accounts, where a partial failure could leave data corrupted. Most relational databases support transactions natively via BEGIN, COMMIT, and ROLLBACK.",
    code: "BEGIN;\n\nUPDATE accounts SET balance = balance - 100\nWHERE id = 1;\n\nUPDATE accounts SET balance = balance + 100\nWHERE id = 2;\n\n-- If both succeed, persist the changes\nCOMMIT;\n\n-- If something goes wrong, undo everything\n-- ROLLBACK;",
    interviewQuestion:
      "Explain each letter of ACID with a real-world example of what breaks if that property is missing.",
  },
  {
    id: "database-isolation-levels",
    category: "database",
    topic: "Transactions",
    title: "Isolation Levels",
    difficulty: "Advanced",
    summary:
      "Isolation levels control how much one transaction can see of another's uncommitted or concurrent changes, trading consistency for concurrency.",
    explanation:
      "The SQL standard defines four isolation levels: Read Uncommitted (allows dirty reads), Read Committed (default in PostgreSQL/Oracle, prevents dirty reads but allows non-repeatable reads), Repeatable Read (default in MySQL/InnoDB, prevents non-repeatable reads but may allow phantom reads), and Serializable (strictest, fully isolates transactions as if run sequentially). Higher isolation levels reduce concurrency anomalies but increase locking or retry overhead. Phenomena to know: dirty read (reading uncommitted data), non-repeatable read (same query returns different results within a transaction), and phantom read (new rows appear matching a previous query's condition). Choosing the right level balances correctness needs against throughput.",
    code: "-- Set isolation level for a transaction (PostgreSQL)\nBEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\nSELECT balance FROM accounts WHERE id = 1;\n-- ... application logic ...\nUPDATE accounts SET balance = balance - 50 WHERE id = 1;\n\nCOMMIT;\n-- May throw a serialization_failure error requiring retry\n\n-- Read Committed (default): each statement sees latest committed data\nBEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSELECT * FROM orders WHERE status = 'pending';\nCOMMIT;",
    interviewQuestion:
      "What is a phantom read, and which isolation level is the minimum required to prevent it?",
  },
  {
    id: "database-locking",
    category: "database",
    topic: "Transactions",
    title: "Database Locking",
    difficulty: "Advanced",
    summary:
      "Locks prevent concurrent transactions from corrupting data by restricting access to rows, pages, or tables while a transaction is in progress.",
    explanation:
      "Databases use shared (read) locks and exclusive (write) locks to coordinate concurrent access; multiple transactions can hold shared locks simultaneously, but an exclusive lock blocks all others. Row-level locking (common in PostgreSQL, InnoDB) offers higher concurrency than table-level locking by only blocking the specific rows being modified. Optimistic locking avoids holding locks by checking a version number or timestamp at commit time and failing if it changed, which works well for low-contention scenarios. Pessimistic locking, using SELECT ... FOR UPDATE, proactively locks rows to prevent conflicts, better suited for high-contention scenarios like inventory decrements.",
    code: "-- Pessimistic locking: lock the row until commit\nBEGIN;\nSELECT quantity FROM inventory WHERE product_id = 10 FOR UPDATE;\nUPDATE inventory SET quantity = quantity - 1 WHERE product_id = 10;\nCOMMIT;\n\n-- Optimistic locking: version column, no lock held\nUPDATE inventory\nSET quantity = quantity - 1, version = version + 1\nWHERE product_id = 10 AND version = 5;\n-- If 0 rows affected, someone else updated first; retry",
    interviewQuestion:
      "Compare optimistic and pessimistic locking, and describe a scenario where each is the better choice.",
  },
  {
    id: "database-joins-deep-dive",
    category: "database",
    topic: "Querying",
    title: "Joins Deep Dive",
    difficulty: "Intermediate",
    summary:
      "Joins combine rows from two or more tables based on a related column, with different join types controlling which unmatched rows are kept.",
    explanation:
      "INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table plus matched rows from the right, with NULLs where there's no match. RIGHT JOIN is the mirror of LEFT JOIN. FULL OUTER JOIN returns all rows from both sides, matched where possible. CROSS JOIN produces a Cartesian product of both tables. Internally, the query planner chooses a join algorithm — nested loop, hash join, or merge join — based on table sizes, indexes, and available memory, which significantly affects performance on large datasets.",
    code: "-- INNER JOIN: only users who have orders\nSELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id;\n\n-- LEFT JOIN: all users, even those with no orders\nSELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;\n\n-- Find users with NO orders\nSELECT u.name\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;",
    interviewQuestion:
      "How would you write a query to find all customers who have never placed an order?",
  },
  {
    id: "database-sharding",
    category: "database",
    topic: "Scaling",
    title: "Database Sharding",
    difficulty: "Advanced",
    summary:
      "Sharding splits a large dataset across multiple database instances, each holding a subset of the data, to scale writes and storage horizontally.",
    explanation:
      "In a sharded architecture, data is partitioned by a shard key (e.g., user_id) using strategies like range-based, hash-based, or directory-based sharding. Each shard is a separate database that can be scaled independently, allowing the system to handle far more data and write throughput than a single machine. The tradeoffs include complex cross-shard queries and joins, difficulty maintaining global uniqueness or transactions across shards, and the operational overhead of rebalancing when adding or removing shards. Choosing a good shard key that avoids hot spots is critical — a poorly chosen key can concentrate load on one shard.",
    code: "// Hash-based sharding: choose shard by hashing user_id\nfunction getShardForUser(userId, shardCount) {\n  const hash = hashFunction(userId);\n  return hash % shardCount;\n}\n\nconst shard = getShardForUser(12345, 4); // e.g., shard 2\nconst connection = shardConnections[shard];\nconnection.query('SELECT * FROM orders WHERE user_id = $1', [12345]);\n\n// Range-based sharding example\n// Shard 0: user_id 1-1000000\n// Shard 1: user_id 1000001-2000000",
    interviewQuestion:
      "What problems can arise from a poorly chosen shard key, and how would you pick a better one?",
  },
  {
    id: "database-replication",
    category: "database",
    topic: "Scaling",
    title: "Database Replication",
    difficulty: "Intermediate",
    summary:
      "Replication copies data from one database node to one or more others to improve availability, read scalability, and fault tolerance.",
    explanation:
      "In replication, a primary node accepts writes and streams changes (via logical or physical replication, such as PostgreSQL's WAL streaming or MySQL's binlog) to replica nodes. Synchronous replication waits for replicas to confirm before acknowledging a write, guaranteeing consistency but adding latency. Asynchronous replication acknowledges writes immediately and propagates changes afterward, which is faster but risks replication lag and potential data loss if the primary fails before replicas catch up. Replicas are commonly used to offload read traffic and to provide a standby for failover, improving both performance and availability.",
    code: "-- PostgreSQL: check replication lag on a replica\nSELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;\n\n-- Application routes reads to replica, writes to primary\nconst writeDb = new Pool({ host: 'primary.db.internal' });\nconst readDb = new Pool({ host: 'replica.db.internal' });\n\nawait writeDb.query('INSERT INTO orders (user_id, total) VALUES ($1, $2)', [1, 99.5]);\nconst result = await readDb.query('SELECT * FROM orders WHERE user_id = $1', [1]);",
    interviewQuestion:
      "What is replication lag, and what problems can it cause for an application reading from a replica right after a write?",
  },
  {
    id: "database-master-slave-vs-master-master",
    category: "database",
    topic: "Scaling",
    title: "Master-Slave vs Master-Master Replication",
    difficulty: "Advanced",
    summary:
      "Master-slave replication has a single writable node with read-only replicas, while master-master allows multiple nodes to accept writes, at the cost of conflict resolution complexity.",
    explanation:
      "In master-slave (primary-replica) topology, all writes go to one master and are replicated to read-only slaves, making conflict handling simple but limiting write scalability and creating a single point of failure for writes. In master-master topology, two or more nodes can accept writes concurrently, improving write availability and enabling multi-region writes, but introduces the risk of write conflicts when the same row is modified on different masters simultaneously. Conflict resolution strategies include last-write-wins, application-level merge logic, or vector clocks. Master-master setups are more operationally complex and are typically used when low-latency writes across regions are required and eventual consistency is acceptable.",
    code: "-- Master-slave: slave is read-only\n-- On slave:\nSHOW SLAVE STATUS\\G\n-- Slave_IO_Running: Yes\n-- Slave_SQL_Running: Yes\n\n-- Master-master: both accept writes, need conflict handling\n-- Node A\nINSERT INTO products (id, name, updated_at) VALUES (1, 'Widget A', NOW());\n\n-- Node B (concurrently)\nINSERT INTO products (id, name, updated_at) VALUES (1, 'Widget B', NOW());\n\n-- Resolution: last-write-wins based on updated_at timestamp\n-- during replication conflict resolution",
    interviewQuestion:
      "Why is conflict resolution harder in master-master replication than master-slave, and how might you resolve a write conflict?",
  },
  {
    id: "database-connection-pooling",
    category: "database",
    topic: "Performance",
    title: "Connection Pooling",
    difficulty: "Intermediate",
    summary:
      "Connection pooling reuses a fixed set of open database connections across requests instead of opening and closing a new connection for every query.",
    explanation:
      "Establishing a database connection is expensive due to TCP handshake, authentication, and session setup, so creating a new one per request doesn't scale. A connection pool maintains a set of pre-established connections that application code borrows and returns, dramatically reducing overhead and latency. Pool size must be tuned relative to the database's max_connections and the application's concurrency, since too many connections can exhaust database resources while too few cause request queuing. Tools like PgBouncer (PostgreSQL) or built-in pool managers in ORMs (e.g., Sequelize, Prisma, HikariCP) handle this automatically, and serverless environments often need external poolers since each function instance can't maintain a long-lived pool.",
    code: "// Node.js with pg Pool\nconst { Pool } = require('pg');\n\nconst pool = new Pool({\n  host: 'db.internal',\n  max: 20,          // max connections in pool\n  idleTimeoutMillis: 30000,\n  connectionTimeoutMillis: 2000,\n});\n\nasync function getUser(id) {\n  const client = await pool.connect();\n  try {\n    const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);\n    return res.rows[0];\n  } finally {\n    client.release(); // return connection to pool, don't close it\n  }\n}",
    interviewQuestion:
      "Why is connection pooling important, and what happens if the pool size is set too high relative to the database's max connections?",
  },
  {
    id: "database-n-plus-1-query-problem",
    category: "database",
    topic: "Performance",
    title: "N+1 Query Problem",
    difficulty: "Intermediate",
    summary:
      "The N+1 problem occurs when code fetches a list of N items with one query, then issues one additional query per item to fetch related data, resulting in N+1 total queries.",
    explanation:
      "This commonly happens with ORMs when lazy loading is used inside a loop: fetching a list of posts, then looping over each post to fetch its author individually. Instead of 2 queries, the application ends up issuing 1 + N queries, which scales poorly as N grows and adds significant network round-trip latency. The fix is eager loading — using a JOIN or a single batched query (e.g., WHERE id IN (...)) to fetch related data upfront. Most ORMs provide mechanisms like Sequelize's include, Django's select_related/prefetch_related, or Prisma's include to solve this at the query-building level.",
    code: "-- N+1 problem: 1 query for posts + N queries for authors\nSELECT * FROM posts LIMIT 10;\n-- then in a loop, for each post:\nSELECT * FROM users WHERE id = ?; -- run 10 times\n\n-- Fixed with a JOIN (1 query total)\nSELECT p.*, u.name AS author_name\nFROM posts p\nJOIN users u ON u.id = p.author_id\nLIMIT 10;\n\n// Or fixed with batching (2 queries total)\nconst posts = await db.posts.findMany({ take: 10 });\nconst authorIds = posts.map(p => p.authorId);\nconst authors = await db.users.findMany({ where: { id: { in: authorIds } } });",
    interviewQuestion:
      "How would you detect and fix an N+1 query problem in an ORM-based application?",
  },
  {
    id: "database-migrations",
    category: "database",
    topic: "Schema Design",
    title: "Database Migrations",
    difficulty: "Basic",
    summary:
      "Migrations are versioned, incremental scripts that evolve a database schema over time in a repeatable, trackable way across environments.",
    explanation:
      "Migration tools (Flyway, Liquibase, Knex, Prisma Migrate, Django migrations) record which migrations have run in a metadata table, so applying migrations is idempotent and ordered. Each migration typically has an 'up' operation to apply the change and a 'down' operation to reverse it, enabling rollbacks. Best practices include making migrations backward-compatible during zero-downtime deploys (e.g., add a nullable column before making it required, deploy code, then backfill), never editing a migration that has already run in production, and keeping migrations small and reversible. Migrations ensure schema changes are consistent across development, staging, and production environments.",
    code: "-- Migration: 20260701_add_status_to_orders.sql\n\n-- Up\nALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending';\nCREATE INDEX idx_orders_status ON orders(status);\n\n-- Down\nDROP INDEX idx_orders_status;\nALTER TABLE orders DROP COLUMN status;\n\n// Using a migration tool (Knex example)\nexports.up = function(knex) {\n  return knex.schema.table('orders', (table) => {\n    table.string('status').defaultTo('pending');\n  });\n};\n\nexports.down = function(knex) {\n  return knex.schema.table('orders', (table) => {\n    table.dropColumn('status');\n  });\n};",
    interviewQuestion:
      "How would you safely add a required (NOT NULL) column to a large production table with zero downtime?",
  },
  {
    id: "database-schema-design-best-practices",
    category: "database",
    topic: "Schema Design",
    title: "Schema Design Best Practices",
    difficulty: "Intermediate",
    summary:
      "Good schema design balances normalization, indexing, data types, and constraints to ensure data integrity, performance, and maintainability as the application grows.",
    explanation:
      "Key practices include choosing the smallest appropriate data type for each column, using surrogate keys (auto-increment or UUID) alongside natural unique constraints where needed, defining foreign keys to enforce referential integrity, and adding NOT NULL and CHECK constraints to prevent invalid data at the database level rather than relying solely on application code. Naming conventions should be consistent (e.g., snake_case, singular or plural table names chosen consistently). Designers should also plan for soft deletes vs hard deletes, audit columns (created_at, updated_at), and anticipate query patterns to guide indexing decisions early, since retrofitting a schema under production load is costly.",
    code: "CREATE TABLE orders (\n  id BIGSERIAL PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  status VARCHAR(20) NOT NULL DEFAULT 'pending'\n    CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),\n  total_cents INT NOT NULL CHECK (total_cents >= 0),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  deleted_at TIMESTAMPTZ -- soft delete\n);\n\nCREATE INDEX idx_orders_user_id ON orders(user_id) WHERE deleted_at IS NULL;",
    interviewQuestion:
      "What database-level constraints would you add to an orders table to prevent invalid data, beyond what the application validates?",
  },
  {
    id: "database-mongodb-fundamentals",
    category: "database",
    topic: "MongoDB",
    title: "MongoDB Fundamentals",
    difficulty: "Basic",
    summary:
      "MongoDB is a document-oriented NoSQL database that stores data as flexible, JSON-like BSON documents grouped into collections instead of tables and rows.",
    explanation:
      "Documents in MongoDB can have varying fields within the same collection, allowing schema flexibility that suits rapidly evolving or nested data. Each document has a unique _id field, and related data is often embedded within a single document rather than joined across tables, though references between collections are also supported for many-to-many relationships. MongoDB supports rich querying, indexing (including compound and multikey indexes for arrays), and horizontal scaling through sharding. It relaxes strict relational constraints in favor of developer flexibility and horizontal scalability, and as of recent versions supports multi-document ACID transactions when needed.",
    code: "// Insert a document\ndb.users.insertOne({\n  name: 'Alice',\n  email: 'alice@example.com',\n  tags: ['admin', 'beta-tester'],\n  address: { city: 'Austin', zip: '78701' }\n});\n\n// Query with filters\ndb.users.find({ tags: 'admin' });\n\n// Update a nested field\ndb.users.updateOne(\n  { email: 'alice@example.com' },\n  { $set: { 'address.city': 'Dallas' } }\n);\n\n// Create an index\ndb.users.createIndex({ email: 1 }, { unique: true });",
    interviewQuestion:
      "How does MongoDB's document model differ from a relational schema, and when would embedding be preferred over referencing?",
  },
  {
    id: "database-mongodb-aggregation-pipeline",
    category: "database",
    topic: "MongoDB",
    title: "MongoDB Aggregation Pipeline",
    difficulty: "Advanced",
    summary:
      "The aggregation pipeline processes documents through a sequence of stages like $match, $group, and $project to transform and summarize data, similar to SQL's GROUP BY and JOIN combined.",
    explanation:
      "Each stage in the pipeline takes the output of the previous stage as input, forming a data-processing chain. $match filters documents (like WHERE), $group aggregates values (like GROUP BY with SUM/COUNT/AVG), $project reshapes documents (like SELECT), $sort orders results, $lookup performs a left outer join with another collection, and $unwind flattens arrays into separate documents. Placing $match and $limit stages early improves performance by reducing the document count processed by later stages, and indexes can be used by early $match/$sort stages. The pipeline is a powerful alternative to running multiple queries and merging results in application code.",
    code: "db.orders.aggregate([\n  { $match: { status: 'completed' } },\n  { $group: {\n      _id: '$userId',\n      totalSpent: { $sum: '$amount' },\n      orderCount: { $sum: 1 }\n  }},\n  { $sort: { totalSpent: -1 } },\n  { $limit: 10 },\n  { $lookup: {\n      from: 'users',\n      localField: '_id',\n      foreignField: '_id',\n      as: 'userInfo'\n  }}\n]);",
    interviewQuestion:
      "Explain what $match, $group, and $lookup each do in a MongoDB aggregation pipeline, and why stage order matters for performance.",
  },
  {
    id: "database-postgresql-fundamentals",
    category: "database",
    topic: "PostgreSQL",
    title: "PostgreSQL Fundamentals",
    difficulty: "Basic",
    summary:
      "PostgreSQL is an open-source, object-relational database known for strict standards compliance, advanced data types, and extensibility.",
    explanation:
      "PostgreSQL supports advanced features beyond standard SQL, including JSONB for efficient document-style storage and querying, native array and range types, full-text search, window functions, common table expressions (CTEs), and powerful indexing options like GIN, GiST, and BRIN. It uses MVCC (Multi-Version Concurrency Control) to allow readers and writers to operate concurrently without blocking each other. Its extensibility (custom types, extensions like PostGIS for geospatial data, pg_trgm for fuzzy search) makes it a popular choice when relational integrity is needed alongside flexible, semi-structured data support.",
    code: "-- JSONB column with indexing\nCREATE TABLE events (\n  id SERIAL PRIMARY KEY,\n  payload JSONB NOT NULL\n);\n\nCREATE INDEX idx_events_payload ON events USING GIN (payload);\n\nSELECT * FROM events WHERE payload @> '{\"type\": \"click\"}';\n\n-- Common Table Expression (CTE)\nWITH recent_orders AS (\n  SELECT * FROM orders WHERE created_at > now() - interval '7 days'\n)\nSELECT user_id, COUNT(*) FROM recent_orders GROUP BY user_id;",
    interviewQuestion:
      "What is MVCC in PostgreSQL, and how does it allow readers and writers to avoid blocking each other?",
  },
  {
    id: "database-mysql-fundamentals",
    category: "database",
    topic: "MySQL",
    title: "MySQL Fundamentals",
    difficulty: "Basic",
    summary:
      "MySQL is a widely used open-source relational database known for its simplicity, speed, and pluggable storage engine architecture, most commonly InnoDB.",
    explanation:
      "MySQL's default storage engine, InnoDB, supports ACID transactions, row-level locking, and foreign keys, while the older MyISAM engine lacks transactions and uses table-level locking, making InnoDB the standard choice today. MySQL's default isolation level is Repeatable Read, differing from PostgreSQL's Read Committed default. MySQL is widely used in web applications due to its ease of setup, strong replication support, and broad hosting availability. Its query cache (removed in MySQL 8.0), auto-increment primary keys, and straightforward EXPLAIN plans make it approachable, though it historically had weaker support for advanced SQL features like window functions until version 8.0.",
    code: "-- Create table with InnoDB engine (default in modern MySQL)\nCREATE TABLE products (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  price DECIMAL(10,2) NOT NULL,\n  stock INT DEFAULT 0\n) ENGINE=InnoDB;\n\n-- Window function (MySQL 8.0+)\nSELECT name, price,\n  RANK() OVER (ORDER BY price DESC) AS price_rank\nFROM products;\n\n-- Check current isolation level\nSELECT @@transaction_isolation;",
    interviewQuestion:
      "What is the difference between MySQL's InnoDB and MyISAM storage engines, and why is InnoDB preferred today?",
  },
  {
    id: "database-redis-fundamentals",
    category: "database",
    topic: "Redis",
    title: "Redis Fundamentals",
    difficulty: "Basic",
    summary:
      "Redis is an in-memory key-value data store used for caching, session storage, and real-time features, offering rich data structures beyond simple strings.",
    explanation:
      "Redis keeps data primarily in RAM, making reads and writes extremely fast, typically sub-millisecond. It supports data structures including strings, hashes, lists, sets, sorted sets, and streams, each with specialized commands. Persistence is optional via RDB snapshots or AOF (append-only file) logging, since Redis is often used as a cache or ephemeral store rather than a system of record. Redis supports expiration (TTL) on keys, pub/sub messaging, and atomic operations, making it well-suited for caching, rate limiting, leaderboards, and session management. Redis is single-threaded for command execution, which simplifies concurrency but means CPU-heavy commands can block other operations.",
    code: "# String with expiration (common cache pattern)\nSET session:abc123 '{\"userId\": 42}' EX 3600\nGET session:abc123\n\n# Hash for structured data\nHSET user:42 name 'Alice' email 'alice@example.com'\nHGETALL user:42\n\n# Sorted set for a leaderboard\nZADD leaderboard 1500 'player1'\nZADD leaderboard 2200 'player2'\nZREVRANGE leaderboard 0 9 WITHSCORES\n\n# Atomic increment (great for counters/rate limits)\nINCR page:views:homepage",
    interviewQuestion:
      "Why is Redis so much faster than a traditional disk-based database, and what are the tradeoffs of using it as a primary data store?",
  },
  {
    id: "database-redis-caching-patterns",
    category: "database",
    topic: "Redis",
    title: "Redis Caching Patterns",
    difficulty: "Advanced",
    summary:
      "Common caching patterns like cache-aside, write-through, and write-behind define how an application keeps Redis in sync with the primary database while maximizing cache hit rate.",
    explanation:
      "Cache-aside (lazy loading) has the application check the cache first, and on a miss, read from the database and populate the cache; this is the most common pattern and handles cache failures gracefully but risks a 'thundering herd' when many requests miss simultaneously. Write-through writes to the cache and database together, keeping them in sync but adding write latency. Write-behind writes to the cache immediately and asynchronously flushes to the database, improving write speed at the risk of data loss. Key design decisions include choosing sensible TTLs to avoid stale data, using cache stampede protection (locks or probabilistic early expiration), and explicit invalidation on writes to avoid serving outdated cached data.",
    code: "// Cache-aside pattern\nasync function getUser(id) {\n  const cacheKey = `user:${id}`;\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n\n  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);\n  await redis.set(cacheKey, JSON.stringify(user), 'EX', 300); // TTL 5 min\n  return user;\n}\n\n// Invalidate cache on write\nasync function updateUser(id, data) {\n  await db.query('UPDATE users SET name = $1 WHERE id = $2', [data.name, id]);\n  await redis.del(`user:${id}`);\n}",
    interviewQuestion:
      "Explain the cache-aside pattern and describe how you'd prevent a cache stampede when a popular key expires.",
  },
  {
    id: "database-backup-strategies",
    category: "database",
    topic: "Operations",
    title: "Database Backup Strategies",
    difficulty: "Intermediate",
    summary:
      "A solid backup strategy combines full backups, incremental backups, and continuous transaction log archiving to enable recovery to any point in time with minimal data loss.",
    explanation:
      "Full backups capture the entire database at a point in time but are slow and storage-heavy if taken frequently. Incremental or differential backups capture only changes since the last backup, reducing time and storage. Continuous WAL (write-ahead log) or binlog archiving enables point-in-time recovery (PITR), letting you restore to any moment, such as right before an accidental DROP TABLE. Key metrics to define are RPO (Recovery Point Objective, how much data loss is acceptable) and RTO (Recovery Time Objective, how quickly the system must be restored). Backups should be tested regularly through actual restore drills, stored offsite or in a different region, and encrypted at rest.",
    code: "# PostgreSQL full backup\npg_dump -Fc mydb > mydb_backup_2026_07_01.dump\n\n# Restore from backup\npg_restore -d mydb_restored mydb_backup_2026_07_01.dump\n\n# Enable WAL archiving for point-in-time recovery (postgresql.conf)\n# archive_mode = on\n# archive_command = 'cp %p /backups/wal_archive/%f'\n\n# MySQL backup\nmysqldump --single-transaction --routines --triggers mydb > mydb_backup.sql",
    interviewQuestion:
      "What is the difference between RPO and RTO, and how does that difference influence your backup strategy?",
  },
  {
    id: "database-cap-theorem",
    category: "database",
    topic: "Distributed Systems",
    title: "CAP Theorem for Databases",
    difficulty: "Advanced",
    summary:
      "CAP theorem states that a distributed database can only guarantee two of three properties during a network partition: Consistency, Availability, and Partition Tolerance.",
    explanation:
      "Since network partitions are unavoidable in distributed systems, Partition Tolerance is effectively mandatory, so the real tradeoff is between Consistency and Availability when a partition occurs. CP systems (like MongoDB with majority writes, or HBase) prioritize consistency, rejecting or delaying requests until nodes agree, sacrificing availability during a partition. AP systems (like Cassandra or DynamoDB with eventual consistency) prioritize availability, always responding, but may return stale data until nodes converge. In practice, many systems are tunable per-operation (e.g., Cassandra's consistency levels like QUORUM or ONE), letting engineers choose the tradeoff per use case rather than system-wide.",
    code: "// Cassandra: tunable consistency per query\n// Strong consistency (CP-leaning): requires majority of replicas\nSELECT * FROM users WHERE id = 42\nUSING CONSISTENCY QUORUM;\n\n// High availability (AP-leaning): reads from any single replica\nSELECT * FROM users WHERE id = 42\nUSING CONSISTENCY ONE;\n\n// DynamoDB: choose per read\n// eventually consistent read (default, AP) vs\n// strongly consistent read (ConsistentRead: true, CP-leaning)",
    interviewQuestion:
      "During a network partition, why can't a distributed database guarantee both consistency and availability, and how would you decide which to sacrifice for a given feature?",
  },
  {
    id: "database-connection-security",
    category: "database",
    topic: "Security",
    title: "Database Connection Security",
    difficulty: "Intermediate",
    summary:
      "Securing database connections requires encrypting data in transit with TLS, using least-privilege credentials, and never exposing databases directly to the public internet.",
    explanation:
      "Connections should use TLS/SSL to prevent credentials and query data from being intercepted on the network. Database users should follow least-privilege principles — an application's read replica connection shouldn't have DROP TABLE permissions, and each service should have its own scoped credentials rather than a shared superuser account. Databases should sit in a private network/VPC with security groups or firewall rules restricting access to known application servers, accessed via bastion hosts or SSH tunnels for admin tasks rather than public exposure. Secrets like passwords and connection strings should be stored in a secrets manager (e.g., AWS Secrets Manager, Vault) rather than hardcoded or committed to source control, and credentials should be rotated periodically.",
    code: "-- Create a least-privilege application user\nCREATE USER app_readonly WITH PASSWORD 'use-a-secrets-manager-not-this';\nGRANT CONNECT ON DATABASE mydb TO app_readonly;\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;\n\n-- Force SSL connections (postgresql.conf / pg_hba.conf)\n-- hostssl all all 0.0.0.0/0 md5\n\n// Node.js: connect with TLS enforced\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  ssl: { rejectUnauthorized: true },\n});",
    interviewQuestion:
      "What steps would you take to secure a production database that currently allows connections from any IP with a single shared superuser account?",
  },
  {
    id: "database-full-text-search",
    category: "database",
    topic: "Querying",
    title: "Full-Text Search in Databases",
    difficulty: "Advanced",
    summary:
      "Full-text search enables efficient searching of natural language text using specialized indexes, ranking, and linguistic features like stemming, going far beyond a simple LIKE query.",
    explanation:
      "A basic LIKE '%term%' query can't use a standard B-tree index effectively and performs a slow sequential scan, and it lacks relevance ranking or word-stem matching. Databases like PostgreSQL offer built-in full-text search using tsvector/tsquery types combined with GIN indexes, supporting stemming (e.g., matching 'running' to 'run'), stop-word removal, and ranking via ts_rank. MySQL offers FULLTEXT indexes with similar capability. For more advanced needs — fuzzy matching, faceted search, typo tolerance, and massive scale — dedicated search engines like Elasticsearch or Meilisearch are often layered on top of or alongside the primary database.",
    code: "-- PostgreSQL full-text search\nALTER TABLE articles ADD COLUMN search_vector tsvector;\n\nUPDATE articles SET search_vector =\n  to_tsvector('english', title || ' ' || body);\n\nCREATE INDEX idx_articles_search ON articles USING GIN(search_vector);\n\nSELECT title, ts_rank(search_vector, query) AS rank\nFROM articles, to_tsquery('english', 'database & performance') query\nWHERE search_vector @@ query\nORDER BY rank DESC;",
    interviewQuestion:
      "Why is LIKE '%term%' a poor choice for search at scale, and what does a full-text index do differently?",
  },
  {
    id: "database-orm-vs-raw-sql",
    category: "database",
    topic: "Application Design",
    title: "ORM vs Raw SQL Tradeoffs",
    difficulty: "Tricky",
    summary:
      "ORMs offer productivity, type safety, and portability by mapping objects to database rows, but can obscure performance issues and generate inefficient queries compared to hand-written SQL.",
    explanation:
      "ORMs (Sequelize, TypeORM, Prisma, Hibernate, ActiveRecord) let developers work with objects instead of writing SQL directly, speeding up development, reducing boilerplate, and providing some protection against SQL injection through parameterization. However, ORMs can generate suboptimal queries — the N+1 problem is a classic ORM pitfall — and abstract away details that matter for performance tuning, like exact join strategies or index usage. Raw SQL gives full control and often better performance for complex queries, reporting, or bulk operations, but sacrifices portability across database engines and requires more manual work for mapping results and preventing injection. A pragmatic approach uses an ORM for typical CRUD operations and drops to raw SQL or query builders for performance-critical or complex analytical queries.",
    code: "// ORM (Prisma) - convenient but can hide N+1 issues\nconst posts = await prisma.post.findMany({\n  include: { author: true, comments: true },\n});\n\n// Raw SQL - explicit control over the exact query executed\nconst posts = await db.query(`\n  SELECT p.id, p.title, u.name AS author_name,\n         COUNT(c.id) AS comment_count\n  FROM posts p\n  JOIN users u ON u.id = p.author_id\n  LEFT JOIN comments c ON c.post_id = p.id\n  GROUP BY p.id, u.name\n`);\n\n// Always use parameterized raw SQL to avoid injection\ndb.query('SELECT * FROM users WHERE email = $1', [email]);",
    interviewQuestion:
      "When would you bypass your ORM and write raw SQL instead, and what risks does that introduce that the ORM normally protects against?",
  },
  {
    id: "database-deadlocks",
    category: "database",
    topic: "Transactions",
    title: "Database Deadlocks",
    difficulty: "Tricky",
    summary:
      "A deadlock occurs when two or more transactions each hold a lock the other needs, resulting in a cycle where none can proceed until the database forcibly aborts one.",
    explanation:
      "Deadlocks typically arise when transactions acquire locks on the same resources in different orders — Transaction A locks row 1 then waits for row 2, while Transaction B locks row 2 then waits for row 1. Most databases detect this cycle automatically and resolve it by killing one transaction (the 'deadlock victim'), which the application must catch and retry. Prevention strategies include always acquiring locks in a consistent order across the codebase, keeping transactions short, avoiding user-interaction or external API calls inside a transaction, and using appropriate indexes so transactions lock only the rows they need rather than scanning and locking excess rows. Retrying the aborted transaction with exponential backoff is a common mitigation.",
    code: "-- Transaction A\nBEGIN;\nUPDATE accounts SET balance = balance - 10 WHERE id = 1;\n-- waits here if B holds a lock on id = 2 and wants id = 1\nUPDATE accounts SET balance = balance + 10 WHERE id = 2;\nCOMMIT;\n\n-- Transaction B (concurrently, opposite order -- causes deadlock)\nBEGIN;\nUPDATE accounts SET balance = balance - 5 WHERE id = 2;\nUPDATE accounts SET balance = balance + 5 WHERE id = 1;\nCOMMIT;\n\n-- Fix: always lock rows in a consistent order (e.g., by ascending id)\n-- both transactions should update id=1 before id=2",
    interviewQuestion:
      "Describe how a deadlock happens between two transactions, how the database resolves it, and how you'd prevent it in application code.",
  },
  {
    id: "database-time-series-databases",
    category: "database",
    topic: "Specialized Databases",
    title: "Time-Series Databases",
    difficulty: "Advanced",
    summary:
      "Time-series databases like InfluxDB and TimescaleDB are optimized for storing and querying data points indexed by time, such as metrics, sensor readings, and logs.",
    explanation:
      "Time-series workloads have distinct characteristics: mostly append-only writes ordered by time, queries that aggregate over time windows (downsampling), and data that becomes less valuable and can be compressed or dropped as it ages (retention policies). Specialized time-series databases optimize storage with columnar compression and time-based partitioning, and provide built-in functions for time-bucketing, interpolation, and continuous aggregates. TimescaleDB extends PostgreSQL with automatic partitioning into 'chunks' by time while retaining full SQL compatibility, whereas InfluxDB and Prometheus use purpose-built storage engines and query languages (Flux, PromQL) optimized purely for time-series patterns.",
    code: "-- TimescaleDB: convert a regular table into a hypertable\nCREATE TABLE sensor_data (\n  time TIMESTAMPTZ NOT NULL,\n  sensor_id INT,\n  temperature DOUBLE PRECISION\n);\n\nSELECT create_hypertable('sensor_data', 'time');\n\n-- Time-bucketed aggregation (downsampling)\nSELECT time_bucket('1 hour', time) AS bucket,\n       sensor_id, AVG(temperature) AS avg_temp\nFROM sensor_data\nWHERE time > now() - interval '7 days'\nGROUP BY bucket, sensor_id\nORDER BY bucket;\n\n-- Retention policy: drop data older than 90 days\nSELECT add_retention_policy('sensor_data', INTERVAL '90 days');",
    interviewQuestion:
      "What makes time-series data different from typical relational data, and how do purpose-built time-series databases optimize for it?",
  },
  {
    id: "database-graph-databases-overview",
    category: "database",
    topic: "Specialized Databases",
    title: "Graph Databases Overview",
    difficulty: "Intermediate",
    summary:
      "Graph databases like Neo4j store data as nodes and relationships, making highly connected data and multi-hop traversal queries far more natural and performant than relational joins.",
    explanation:
      "In a graph database, entities are nodes with properties, and relationships are first-class edges with their own properties and direction, unlike foreign keys which only imply connections. Traversal queries — like finding friends-of-friends or shortest paths — are efficient because each node stores direct pointers to its relationships (index-free adjacency), avoiding the exponential cost of repeated joins in a relational model as hop count increases. Graph databases excel at use cases like social networks, recommendation engines, fraud detection, and knowledge graphs, where relationships between entities are as important as the entities themselves. Query languages like Cypher (Neo4j) or Gremlin express these traversals declaratively and concisely.",
    code: "// Neo4j Cypher: create nodes and relationships\nCREATE (alice:Person {name: 'Alice'})\nCREATE (bob:Person {name: 'Bob'})\nCREATE (alice)-[:FRIENDS_WITH]->(bob);\n\n// Find friends-of-friends (2-hop traversal)\nMATCH (p:Person {name: 'Alice'})-[:FRIENDS_WITH]->()-[:FRIENDS_WITH]->(fof)\nWHERE fof <> p\nRETURN DISTINCT fof.name;\n\n// Shortest path between two people\nMATCH path = shortestPath(\n  (a:Person {name: 'Alice'})-[:FRIENDS_WITH*]-(b:Person {name: 'Zoe'})\n)\nRETURN path;",
    interviewQuestion:
      "Why is a graph database more efficient than a relational database for deep, multi-hop relationship queries like 'friends of friends of friends'?",
  },
  {
    id: "database-window-functions",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Window Functions: Ranking and Running Totals",
    difficulty: "Advanced",
    summary:
      "Window functions compute a value across a set of rows related to the current row — like a rank, running total, or moving average — without collapsing rows the way GROUP BY does.",
    explanation:
      "Unlike aggregate functions with GROUP BY, which collapse multiple rows into one per group, window functions compute a result 'over' a window of rows while still returning one row per original input row, using the `OVER (...)` clause to define the window via `PARTITION BY` (grouping) and `ORDER BY` (ordering within the group). Common window functions include `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` for ranking, `LAG()`/`LEAD()` to compare a row to the previous/next row, and `SUM()`/`AVG()` used as window functions for running totals and moving averages. This makes queries like 'rank each employee's salary within their department' or 'show a running total of daily sales' straightforward without needing self-joins or subqueries.",
    code: "-- Rank employees by salary within each department\nSELECT\n  name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees;\n\n-- Running total of daily sales\nSELECT\n  sale_date, amount,\n  SUM(amount) OVER (ORDER BY sale_date) AS running_total\nFROM sales;\n\n-- Compare each row to the previous one\nSELECT\n  sale_date, amount,\n  amount - LAG(amount) OVER (ORDER BY sale_date) AS change_from_prev_day\nFROM sales;",
    interviewQuestion:
      "What's the difference between a window function and GROUP BY, and when would you need a window function instead?",
  },
  {
    id: "database-ctes-recursive",
    category: "database",
    topic: "SQL Deep Dive",
    title: "CTEs and Recursive Queries",
    difficulty: "Advanced",
    summary:
      "A Common Table Expression (CTE) names a temporary result set for readability and reuse within a query; a recursive CTE can walk hierarchical data like an org chart or category tree that a normal query can't traverse.",
    explanation:
      "A `WITH` clause defines a CTE — a named, temporary result set scoped to the query that follows it — mainly for readability, breaking a complex query into logical, named steps instead of deeply nested subqueries. A recursive CTE references itself: it has an initial ('anchor') query and a recursive part that repeatedly joins back to the CTE's own output until no more rows are produced, which is exactly what's needed to traverse variable-depth hierarchies like an employee reporting chain or nested product categories — something a fixed number of JOINs can't express since the depth isn't known ahead of time.",
    code: "-- Non-recursive CTE: just for readability\nWITH high_value_orders AS (\n  SELECT * FROM orders WHERE total > 1000\n)\nSELECT customer_id, COUNT(*) FROM high_value_orders GROUP BY customer_id;\n\n-- Recursive CTE: walk an org chart of unknown depth\nWITH RECURSIVE org_chart AS (\n  SELECT id, name, manager_id, 1 AS level\n  FROM employees WHERE manager_id IS NULL       -- anchor: the CEO\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, oc.level + 1\n  FROM employees e\n  JOIN org_chart oc ON e.manager_id = oc.id      -- recursive step\n)\nSELECT * FROM org_chart ORDER BY level;",
    interviewQuestion:
      "How would you write a query to find all descendants of a category in an unlimited-depth category tree, and why can't a fixed set of JOINs do this?",
  },
  {
    id: "database-subqueries-vs-joins",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Subqueries vs Joins: When Each Is Clearer or Faster",
    difficulty: "Intermediate",
    summary:
      "A correlated subquery re-runs once per outer row and can be slow; the same logic rewritten as a JOIN often lets the query planner execute it far more efficiently, though modern optimizers can rewrite simple cases automatically.",
    explanation:
      "A correlated subquery references a column from the outer query, meaning conceptually it re-executes for every row of the outer query — `SELECT * FROM users WHERE EXISTS (SELECT 1 FROM orders WHERE orders.user_id = users.id)` runs the inner check per user. Rewriting this as a JOIN often lets the planner use a single, more efficient join algorithm (hash join or merge join) instead of repeated lookups, though modern query planners (Postgres especially) can often transform simple correlated subqueries into semi-joins automatically. Uncorrelated subqueries (independent of the outer query) are evaluated once and are generally cheap. As a rule of thumb: prefer JOINs for combining data from multiple tables, and reserve subqueries for existence checks, aggregations that need to happen before joining, or when a JOIN would produce unwanted row duplication.",
    code: "-- Correlated subquery\nSELECT * FROM users u\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.status = 'pending');\n\n-- Equivalent JOIN — often faster, planner-dependent\nSELECT DISTINCT u.*\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE o.status = 'pending';",
    interviewQuestion:
      "When would rewriting a correlated subquery as a JOIN actually hurt instead of help?",
  },
  {
    id: "database-mongodb-query-operators",
    category: "database",
    topic: "MongoDB Deep Dive",
    title: "MongoDB Query Operators in Depth",
    difficulty: "Intermediate",
    summary:
      "MongoDB's query language uses operator objects like $gt, $in, $regex, and $elemMatch instead of SQL syntax, letting you express range, set membership, array, and pattern matching queries directly in the filter document.",
    explanation:
      "Comparison operators (`$gt`, `$gte`, `$lt`, `$lte`, `$ne`) filter by range; `$in`/`$nin` check set membership; `$exists` checks whether a field is present, useful with MongoDB's flexible schema where documents can have different fields. For arrays, `$elemMatch` finds documents where at least one array element matches multiple conditions simultaneously (a plain query with multiple conditions on an array field can match different elements for each condition, which `$elemMatch` prevents). Logical operators `$and`, `$or`, `$not` combine conditions. `$regex` does pattern matching, though it can't use an index efficiently unless anchored at the start of the string. Understanding these operators precisely — especially the array-matching subtlety of `$elemMatch` — is what separates queries that look right from ones that quietly match the wrong documents.",
    code: "// Range + set membership\ndb.products.find({ price: { $gt: 20, $lte: 100 }, category: { $in: [\"electronics\", \"books\"] } });\n\n// Without $elemMatch: can match different array elements independently (bug-prone)\ndb.orders.find({ \"items.qty\": { $gt: 5 }, \"items.price\": { $lt: 10 } });\n\n// With $elemMatch: both conditions must match the SAME array element\ndb.orders.find({ items: { $elemMatch: { qty: { $gt: 5 }, price: { $lt: 10 } } } });\n\n// Field existence check (flexible schema)\ndb.users.find({ phoneNumber: { $exists: true } });",
    interviewQuestion:
      "Why can querying an array field with two separate conditions match a document where no single array element satisfies both — and how does $elemMatch fix it?",
  },
  {
    id: "database-mongodb-indexing-strategies",
    category: "database",
    topic: "MongoDB Deep Dive",
    title: "MongoDB Indexing Strategies",
    difficulty: "Advanced",
    summary:
      "MongoDB supports single-field, compound, multikey (array), text, and geospatial indexes; the ESR rule (Equality, Sort, Range) guides how to order fields in a compound index for best performance.",
    explanation:
      "A compound index should generally order fields as: equality matches first (fields queried with exact-match conditions), then sort fields (so the index can satisfy an ORDER BY without an extra sort step), then range fields last (since a range condition can only use the index up to that point, after which remaining fields aren't index-usable for filtering, only for the scan). Multikey indexes are automatically created when you index a field that holds an array, indexing each array element individually — but you can't create a compound multikey index on two array fields at once. `explain(\"executionStats\")` reveals whether a query is using an index scan (`IXSCAN`) or a full collection scan (`COLLSCAN`), and how many documents were examined versus returned — a huge gap between examined and returned indicates a missing or poorly-ordered index.",
    code: "// ESR rule: Equality, Sort, Range\ndb.orders.createIndex({ status: 1, createdAt: -1, total: 1 });\n\n// This query uses the index efficiently:\n// equality on status, sort on createdAt, range on total\ndb.orders.find({ status: \"shipped\", total: { $gt: 50 } }).sort({ createdAt: -1 });\n\n// Check whether an index is actually used\ndb.orders.find({ status: \"shipped\" }).explain(\"executionStats\");\n// Look for: stage: \"IXSCAN\" (good) vs stage: \"COLLSCAN\" (full scan, bad at scale)",
    interviewQuestion:
      "Explain the ESR (Equality, Sort, Range) rule for ordering fields in a MongoDB compound index, with an example of a query it optimizes.",
  },
  {
    id: "database-mongodb-schema-design-patterns",
    category: "database",
    topic: "MongoDB Deep Dive",
    title: "MongoDB Schema Design: Embed vs Reference",
    difficulty: "Advanced",
    summary:
      "Embedding related data inside a document avoids joins and is ideal for data that's always read together and bounded in size; referencing (storing an ID and querying separately) is better for large, independently-growing, or frequently-updated related data.",
    explanation:
      "MongoDB has no native JOIN in the relational sense (aggregation's `$lookup` exists but is more expensive than an embedded read), so schema design is driven by access patterns rather than normalization rules. Embed when the related data is always fetched together, has a bounded size (a blog post's comments could grow unbounded and hit the 16MB document size limit), and doesn't need to be queried independently — like an address embedded in a user document. Reference (store just an ID, query separately or use `$lookup`) when the related data is large, grows unbounded, needs independent querying, or is shared/updated by many parent documents, since updating an embedded copy in thousands of documents is far more expensive than updating one referenced document. The 'extended reference' pattern is a middle ground: embed only the frequently-needed fields (like a user's name and avatar) alongside a reference ID, avoiding an extra query for common reads while keeping the source of truth in one place.",
    code: "// Embed: bounded, always read together\n{\n  _id: 1,\n  name: \"Alice\",\n  address: { street: \"123 Main St\", city: \"Springfield\" } // embedded, 1:1, small\n}\n\n// Reference: unbounded, queried independently\n{ _id: 1, name: \"Alice\" }\n{ _id: 101, postId: 1, userId: 1, text: \"Great post!\" } // comments collection, can grow unbounded\n\n// Extended reference: best of both for read-heavy access\n{\n  _id: 101, postId: 1,\n  author: { userId: 1, name: \"Alice\", avatarUrl: \"...\" }, // denormalized for fast reads\n  text: \"Great post!\"\n}",
    interviewQuestion:
      "A blog post's comments could number in the thousands. Should comments be embedded in the post document or referenced? What breaks if you choose wrong?",
  },
  {
    id: "database-redis-data-structures",
    category: "database",
    topic: "Redis Deep Dive",
    title: "Redis Data Structures Beyond Strings",
    difficulty: "Intermediate",
    summary:
      "Redis isn't just a key-value string cache — hashes, lists, sets, sorted sets, and streams each map to specific real-world problems like leaderboards, queues, and deduplication far more efficiently than reimplementing them on top of plain strings.",
    explanation:
      "Hashes store field-value pairs under one key, ideal for representing an object (like a user session) without needing to serialize/deserialize a whole JSON blob just to update one field. Lists are ordered collections supporting push/pop from either end, commonly used as simple queues. Sets store unique unordered members, perfect for tracking distinct visitors or deduplication with O(1) membership checks. Sorted sets (ZSETs) associate a score with each member and keep them ordered by score, which is exactly what a leaderboard needs — `ZADD` to update a score and `ZREVRANGE` to get the top N are both efficient regardless of set size. Streams (added in Redis 5) are an append-only log supporting consumer groups, similar in spirit to a lightweight Kafka for smaller-scale event streaming needs. Picking the right structure avoids reinventing these patterns inefficiently on top of plain GET/SET.",
    code: "// Hash: partial updates without reserializing a whole object\nHSET user:42 name \"Alice\" loginCount 5\nHINCRBY user:42 loginCount 1\n\n// Sorted set: leaderboard, O(log N) insert, ordered reads\nZADD leaderboard 1500 \"alice\"\nZADD leaderboard 1800 \"bob\"\nZREVRANGE leaderboard 0 9 WITHSCORES  -- top 10\n\n// Set: fast membership check, deduplication\nSADD active_users:2026-07-04 \"user42\"\nSISMEMBER active_users:2026-07-04 \"user42\"  -- 1 (true)",
    interviewQuestion:
      "How would you implement a real-time leaderboard showing the top 10 players, and why is a Redis sorted set a better fit than a relational table for this?",
  },
  {
    id: "database-redis-pubsub-and-persistence",
    category: "database",
    topic: "Redis Deep Dive",
    title: "Redis Pub/Sub and Persistence (RDB vs AOF)",
    difficulty: "Advanced",
    summary:
      "Redis Pub/Sub broadcasts messages to subscribers in real time but doesn't persist or queue them for offline consumers; RDB snapshots the whole dataset periodically, while AOF logs every write for more durable, granular recovery.",
    explanation:
      "Pub/Sub in Redis is fire-and-forget: if no client is subscribed to a channel when a message is published, that message is lost forever — it's suited for real-time notifications (like broadcasting a live chat message to connected clients) but not for reliable task queuing, where Redis Streams or a dedicated queue would be more appropriate since they persist messages for consumers that connect later. For persistence of the dataset itself, RDB takes a point-in-time snapshot of all data at configured intervals — fast to restore from but can lose data written since the last snapshot if the server crashes. AOF (Append Only File) logs every write operation, replayed on restart to reconstruct the dataset, offering much better durability (configurable to fsync every write, every second, or let the OS decide) at the cost of a larger file and slower restarts than RDB. Production Redis often uses both together: RDB for fast full backups, AOF for minimizing data loss between them.",
    code: "// Pub/Sub: real-time, not persisted\nSUBSCRIBE notifications\nPUBLISH notifications \"New message from Alice\"\n// If no one is subscribed right now, this message is gone\n\n# redis.conf: RDB snapshot every 60s if at least 1000 keys changed\nsave 60 1000\n\n# redis.conf: AOF for durability\nappendonly yes\nappendfsync everysec   # fsync once per second — balance of durability and speed",
    interviewQuestion:
      "Why is Redis Pub/Sub a poor choice for a reliable task queue, and what would you use instead within Redis itself?",
  },
  {
    id: "database-message-queue-kafka-fundamentals",
    category: "database",
    topic: "Data Pipelines & Queuing",
    title: "Kafka Fundamentals: Topics, Partitions, Consumer Groups",
    difficulty: "Advanced",
    summary:
      "Kafka topics are split into partitions for parallelism, each message is appended to a partition's log in order, and consumer groups let multiple consumers share the work of reading a topic without duplicating processing.",
    explanation:
      "A Kafka topic is a named stream of records, physically split into partitions so it can be written to and read from in parallel across brokers. Within a single partition, message order is guaranteed; across partitions, there's no global ordering, so messages needing strict relative ordering (like all events for one user) should share a partition key so they always land on the same partition. Consumers join a consumer group; Kafka assigns each partition to exactly one consumer within a group, so adding more consumers (up to the partition count) increases parallel throughput, while multiple independent consumer groups can each read the entire topic independently for different purposes (e.g., one group updates a database, another feeds analytics). Unlike a traditional queue, messages aren't deleted after being read — they're retained for a configured period, letting new consumer groups replay history from the beginning if needed.",
    code: "// Producer: partition key ensures ordering per-user\nproducer.send({\n  topic: \"user-events\",\n  messages: [{ key: userId, value: JSON.stringify(event) }], // same key -> same partition -> ordered\n});\n\n// Consumer group: work is split across instances automatically\nconsumer.subscribe({ topic: \"user-events\" });\nconsumer.run({\n  eachMessage: async ({ partition, message }) => {\n    await processEvent(JSON.parse(message.value.toString()));\n  },\n});\n// Running 3 consumer instances in the same group with a 6-partition topic\n// -> each instance handles 2 partitions automatically",
    interviewQuestion:
      "Why must events for the same user share a Kafka partition key if their relative order matters, and what happens to ordering guarantees if they don't?",
  },
  {
    id: "database-database-sharding-strategies",
    category: "database",
    topic: "Scaling Databases",
    title: "Sharding Strategies: Range, Hash, and Directory-Based",
    difficulty: "Advanced",
    summary:
      "Range sharding groups data by value ranges (good for range queries, risks hot spots), hash sharding distributes evenly by hashing the key (even load, bad for range queries), and directory-based sharding uses a lookup service for maximum flexibility at the cost of an extra hop.",
    explanation:
      "Range-based sharding assigns contiguous ranges of a shard key to each shard (e.g., user IDs 1-1000 on shard A, 1001-2000 on shard B), which makes range queries efficient (fetching all users in a range hits one shard) but risks hot-spotting if writes are concentrated at one end of the range, like sequentially-increasing IDs or timestamps always hitting the newest shard. Hash-based sharding applies a hash function to the shard key to pick a shard, spreading writes evenly and avoiding hot spots, but destroys any locality — a range query now has to fan out to every shard. Directory-based (lookup-table) sharding keeps an explicit mapping of key to shard in a separate service, allowing arbitrary, rebalanceable assignment at the cost of an extra lookup and that directory service itself becoming a critical dependency. Choosing a shard key is the hardest and most consequential decision — a poor choice causes uneven load or expensive cross-shard queries that are very costly to fix after the data has already grown.",
    code: "// Hash sharding: even distribution, but no range-query locality\nfunction getShardForUser(userId, shardCount) {\n  const hash = crypto.createHash(\"md5\").update(userId).digest(\"hex\");\n  const hashInt = parseInt(hash.slice(0, 8), 16);\n  return hashInt % shardCount; // shard 0..N-1\n}\n\n// Range sharding: good locality, risk of hot spots on sequential keys\n// shard A: userId 1        - 1,000,000\n// shard B: userId 1,000,001 - 2,000,000",
    interviewQuestion:
      "Why does hash-based sharding solve the hot-spot problem of range sharding, but make range queries much more expensive?",
  },
  {
    id: "database-multi-tenancy-patterns",
    category: "database",
    topic: "Scaling Databases",
    title: "Multi-Tenancy Data Isolation Patterns",
    difficulty: "Advanced",
    summary:
      "Shared database with a tenant_id column is cheapest to operate but riskiest for data leakage; schema-per-tenant improves isolation at moderate operational cost; database-per-tenant gives the strongest isolation but is the most expensive to operate at scale.",
    explanation:
      "In a shared-schema model, every table has a `tenant_id` column and every single query must filter by it — a missing WHERE clause anywhere in the codebase becomes a serious cross-tenant data leak, so this model typically needs row-level security enforced at the database level (like Postgres RLS) as a safety net rather than trusting application code alone. Schema-per-tenant gives each tenant their own schema within one database instance, improving isolation and making per-tenant backups/exports easier, at the cost of running migrations across potentially thousands of schemas. Database-per-tenant gives the strongest isolation (a bug can't leak data across tenants at all) and the easiest per-tenant scaling/compliance story (a tenant needing data residency in a specific region just gets a database there), but multiplies operational overhead — connection pooling, migrations, and monitoring all need to happen per-database instead of once. Most large SaaS platforms start shared-schema for cost efficiency and migrate their largest/most sensitive tenants to dedicated databases only when justified.",
    code: "-- Shared schema: EVERY query must filter by tenant_id\nSELECT * FROM invoices WHERE tenant_id = $1 AND status = 'pending';\n\n-- Postgres Row-Level Security as a safety net against a missing WHERE clause\nALTER TABLE invoices ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_isolation ON invoices\n  USING (tenant_id = current_setting('app.current_tenant')::int);\n-- Now even a forgotten WHERE clause can't leak cross-tenant rows",
    interviewQuestion:
      "In a shared-schema multi-tenant database, what's the single most dangerous class of bug, and how does Postgres Row-Level Security guard against it?",
  },
  {
    id: "database-read-replicas-and-lag",
    category: "database",
    topic: "Scaling Databases",
    title: "Read Replicas and Replication Lag",
    difficulty: "Advanced",
    summary:
      "Read replicas offload read traffic from the primary database, but replication is asynchronous by default, so a replica can briefly serve stale data — a real problem when a user reads their own just-written data from a replica.",
    explanation:
      "Adding read replicas lets you scale read throughput horizontally by routing SELECT queries to one or more replicas while writes go only to the primary, which is a major part of how systems handle high query volume without a bigger primary database. Because replication is typically asynchronous, there's a small delay (replication lag) between a write committing on the primary and that write appearing on a replica — usually milliseconds, but it can grow under heavy load or network issues. This causes the classic 'read-your-own-write' bug: a user updates their profile, the write goes to the primary, but the immediate follow-up read is routed to a lagging replica and shows the old data, confusing the user. Common fixes include routing reads for the current user to the primary for a short window after they write, using synchronous replication for specific critical paths (at a latency cost), or having the client pass along a 'read your writes' token that ensures the replica has caught up to at least that point before answering.",
    code: "// Naive: read immediately after write can hit a lagging replica\nawait db.primary.query(\"UPDATE users SET name = $1 WHERE id = $2\", [newName, id]);\nconst user = await db.replica.query(\"SELECT * FROM users WHERE id = $1\", [id]);\n// user.name might still be the OLD name here\n\n// Fix: route this user's reads to the primary briefly after they write\nawait db.primary.query(\"UPDATE users SET name = $1 WHERE id = $2\", [newName, id]);\nconst user = await db.primary.query(\"SELECT * FROM users WHERE id = $1\", [id]); // read-your-writes",
    interviewQuestion:
      "A user updates their profile and immediately refreshes, but sees their old data for a second. What's happening, and how do you fix it without giving up read replicas entirely?",
  },
  {
    id: "database-optimistic-vs-pessimistic-locking",
    category: "database",
    topic: "Transactions",
    title: "Optimistic vs Pessimistic Locking",
    difficulty: "Advanced",
    summary:
      "Pessimistic locking blocks other transactions from touching a row until the current one finishes, avoiding conflicts but hurting concurrency; optimistic locking allows concurrent reads/writes and only checks for conflicts at commit time using a version number.",
    explanation:
      "Pessimistic locking (`SELECT ... FOR UPDATE`) acquires a lock on a row as soon as it's read with intent to modify it, blocking any other transaction from acquiring the same lock until the first commits or rolls back — this guarantees no conflicting concurrent modification but can cause other transactions to queue up waiting, hurting throughput under high contention, and risks deadlocks if multiple transactions lock rows in different orders. Optimistic locking instead lets multiple transactions read and attempt to write concurrently, but each row carries a version number (or timestamp); when a transaction commits its update, it checks that the version hasn't changed since it read the row — if it has, the update is rejected and the application must retry with fresh data. Optimistic locking performs much better when conflicts are rare (most reads don't end up being modified concurrently), while pessimistic locking is safer when conflicts are frequent and retry logic would be triggered constantly, wasting more work than the locking overhead would have cost.",
    code: "-- Pessimistic: lock the row immediately, block others\nBEGIN;\nSELECT * FROM accounts WHERE id = 1 FOR UPDATE; -- other transactions wait here\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;\n\n-- Optimistic: no lock, check version at write time\nSELECT id, balance, version FROM accounts WHERE id = 1; -- version = 5\n-- ... application logic ...\nUPDATE accounts SET balance = balance - 100, version = version + 1\nWHERE id = 1 AND version = 5; -- fails (0 rows updated) if another tx already changed it\n-- application must detect 0 rows updated and retry",
    interviewQuestion:
      "You have a high-contention 'like' counter updated by thousands of users per second. Would you use optimistic or pessimistic locking, and why?",
  },
  {
    id: "database-distributed-transactions-2pc-saga",
    category: "database",
    topic: "Transactions",
    title: "Distributed Transactions: Two-Phase Commit vs Saga",
    difficulty: "Advanced",
    summary:
      "Two-Phase Commit coordinates an all-or-nothing transaction across multiple databases with strong consistency but blocks on failure and doesn't scale well; the Saga pattern trades strict atomicity for a sequence of compensable local transactions that scales far better.",
    explanation:
      "Two-Phase Commit (2PC) has a coordinator ask every participating database to 'prepare' (lock resources and confirm it can commit) in phase one, and only if all participants agree does it tell them all to actually commit in phase two — this guarantees atomicity across multiple databases, but if the coordinator crashes after phase one, participants can be left holding locks indefinitely (blocked), and the approach doesn't scale well across many services or across network partitions typical of microservices and different database technologies. The Saga pattern instead runs a sequence of independent local transactions, each in its own database, with a predefined compensating transaction to undo each step if a later one fails — trading strict atomicity (there's a window where the system is in a partially-completed state) for much better availability and scalability, which is why virtually all large-scale microservices architectures use sagas rather than 2PC for cross-service workflows.",
    code: "-- 2PC (conceptual): coordinator blocks all participants until everyone agrees\nPREPARE TRANSACTION 'txn1';  -- each DB: lock + confirm readiness\n-- coordinator waits for ALL participants to say \"prepared\"\nCOMMIT PREPARED 'txn1';       -- only then does everyone actually commit\n\n// Saga (application-level): no cross-DB lock, compensations instead\nawait inventoryService.reserveStock(items);\ntry {\n  await paymentService.charge(total);\n} catch {\n  await inventoryService.releaseStock(items); // compensating transaction\n  throw new Error(\"Payment failed, stock released\");\n}",
    interviewQuestion:
      "Why do most microservices architectures avoid Two-Phase Commit in favor of the Saga pattern, despite Sagas giving up strict atomicity?",
  },
  {
    id: "database-oltp-vs-olap",
    category: "database",
    topic: "Data Warehousing",
    title: "OLTP vs OLAP: Transactional vs Analytical Workloads",
    difficulty: "Intermediate",
    summary:
      "OLTP systems handle many small, fast read/write transactions (an order being placed) and are optimized with row-oriented storage; OLAP systems handle complex analytical queries scanning huge amounts of data (quarterly revenue by region) and are optimized with column-oriented storage.",
    explanation:
      "A production application database (OLTP — Online Transaction Processing) is optimized for high-throughput, low-latency operations touching few rows at a time — inserting an order, updating a user's balance — and uses row-oriented storage since a full row is typically read or written together. Running heavy analytical queries (aggregating millions of rows to compute trends) directly against this database competes for the same resources as live user transactions and can degrade production performance. OLAP (Online Analytical Processing) systems and data warehouses (Snowflake, BigQuery, Redshift) instead use column-oriented storage, which only reads the specific columns a query needs across millions of rows — extremely efficient for aggregations like SUM/AVG over one column, but comparatively inefficient for fetching a single full row. This is why production systems typically run OLTP for the live application and periodically (or via streaming) pipe data into a separate OLAP warehouse for reporting and analytics, keeping the two workloads from interfering with each other.",
    code: "-- OLTP: fast, narrow, row-oriented — reads/writes one row's worth of data\nINSERT INTO orders (user_id, total, status) VALUES (42, 99.99, 'pending');\nSELECT * FROM orders WHERE id = 12345;\n\n-- OLAP: scans millions of rows, but only 2 columns — column-store shines here\nSELECT region, SUM(revenue)\nFROM sales_fact_table  -- billions of rows in a data warehouse\nWHERE quarter = 'Q2-2026'\nGROUP BY region;",
    interviewQuestion:
      "Why would running a heavy analytics query directly against your production OLTP database risk degrading the live application, and how do most companies solve this?",
  },
  {
    id: "database-etl-elt-pipelines",
    category: "database",
    topic: "Data Warehousing",
    title: "ETL vs ELT Data Pipelines",
    difficulty: "Intermediate",
    summary:
      "ETL transforms data before loading it into the destination, requiring a separate processing step; ELT loads raw data first and transforms it inside the destination warehouse, leveraging the warehouse's own compute power at scale.",
    explanation:
      "Extract-Transform-Load (ETL) pulls data from source systems, transforms it (cleaning, joining, aggregating) in a separate processing layer, and then loads the already-transformed result into the destination — historically necessary when destination warehouses had limited compute, so transformation had to happen elsewhere first. Extract-Load-Transform (ELT) instead loads raw data into the warehouse immediately, and transformation happens afterward using the warehouse's own (often very scalable) compute via SQL, which has become the dominant pattern with modern cloud warehouses like Snowflake and BigQuery that can cheaply handle large-scale transformation natively. ELT also preserves the original raw data in the warehouse, which is valuable when requirements change and you need to re-derive a different transformation later without re-extracting from the source system. Tools like dbt have popularized ELT by making the 'T' step a version-controlled, testable set of SQL transformations run directly in the warehouse.",
    code: "-- ETL: transform happens BEFORE loading (in a separate pipeline/processing layer)\n-- extract -> [clean, join, aggregate in Spark/Python] -> load transformed result\n\n-- ELT: load raw data first, transform with SQL inside the warehouse\n-- extract -> load raw JSON/CSV into warehouse -> transform with SQL (e.g. dbt model)\n\n-- dbt-style transformation, run AFTER raw data is already in the warehouse\nCREATE TABLE analytics.daily_revenue AS\nSELECT date_trunc('day', created_at) AS day, SUM(total) AS revenue\nFROM raw.orders\nGROUP BY 1;",
    interviewQuestion:
      "Why has ELT become more popular than traditional ETL with the rise of modern cloud data warehouses?",
  },
  {
    id: "database-connection-pooling-pgbouncer",
    category: "database",
    topic: "Scaling Databases",
    title: "PgBouncer and Connection Pooling at Scale",
    difficulty: "Advanced",
    summary:
      "PgBouncer sits between many application connections and a small number of real PostgreSQL connections, using transaction-mode pooling to let thousands of app-side connections share a much smaller connection pool to the actual database.",
    explanation:
      "PostgreSQL's per-connection cost is relatively high (each connection is its own OS process with its own memory), and connection limits are typically in the hundreds to low thousands — insufficient for an application layer scaled across dozens of instances each maintaining their own pool. PgBouncer acts as a lightweight proxy: application instances connect to PgBouncer (which is cheap to accept many connections), and PgBouncer maintains a much smaller pool of actual connections to Postgres, multiplexing many client connections onto few real ones. In 'transaction mode' (the most common setting for this purpose), a real database connection is only bound to a client connection for the duration of a single transaction and then returned to the pool for another client to use, letting a pool of just 20-50 real connections serve thousands of application-side connections — with the caveat that session-level features (like advisory locks or `SET` statements meant to persist across a session) don't work reliably in transaction mode since the underlying connection can change between transactions.",
    code: "# pgbouncer.ini\n[databases]\nmydb = host=127.0.0.1 port=5432 dbname=mydb\n\n[pgbouncer]\npool_mode = transaction     # connection returned to pool after each transaction\nmax_client_conn = 5000      # many app-side connections allowed\ndefault_pool_size = 25      # but only 25 REAL connections to Postgres\n\n# Application connects to PgBouncer's port, not Postgres directly\nDATABASE_URL=postgres://user:pass@pgbouncer-host:6432/mydb",
    interviewQuestion:
      "Why does PgBouncer's transaction-mode pooling break session-level features like SET or advisory locks, and when would you need session-mode instead?",
  },
  {
    id: "database-full-text-search-vs-elasticsearch",
    category: "database",
    topic: "Specialized Databases",
    title: "Built-in Full-Text Search vs Elasticsearch",
    difficulty: "Advanced",
    summary:
      "A relational database's built-in full-text search (like Postgres tsvector) is convenient and keeps data in one place, but a dedicated search engine like Elasticsearch scales better for large text corpora, relevance tuning, faceted search, and typo tolerance.",
    explanation:
      "Postgres's full-text search converts text into a `tsvector` (a normalized, stemmed, indexed representation of the text) and lets you query it with `tsquery`, ranking results by relevance — this is good enough for moderate-scale search needs and avoids the operational overhead of running a separate system, since the data doesn't need to be duplicated or kept in sync elsewhere. Elasticsearch (built on Lucene) is purpose-built for search at scale: it distributes indexes across shards for horizontal scalability, offers much richer relevance tuning (boosting fields, custom scoring), fuzzy/typo-tolerant matching, faceted search and aggregations for filtering UIs, and near-real-time indexing suited for large, frequently-updated text corpora. The tradeoff is operational: Elasticsearch is a separate system that needs its own infrastructure, and data has to be synced from the source-of-truth database to the search index, introducing eventual consistency and a sync pipeline to maintain.",
    code: "-- Postgres full-text search: good enough for moderate scale, no extra infra\nALTER TABLE articles ADD COLUMN search_vector tsvector\n  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;\nCREATE INDEX idx_articles_search ON articles USING GIN(search_vector);\n\nSELECT title, ts_rank(search_vector, query) AS rank\nFROM articles, to_tsquery('english', 'database & performance') query\nWHERE search_vector @@ query\nORDER BY rank DESC;\n\n// Elasticsearch: richer relevance, fuzzy matching, needs a sync pipeline\nPOST /articles/_search\n{ \"query\": { \"fuzzy\": { \"title\": { \"value\": \"databse\", \"fuzziness\": \"AUTO\" } } } }",
    interviewQuestion:
      "At what point does it make sense to move from Postgres full-text search to a dedicated search engine like Elasticsearch, given the added operational complexity?",
  },
  {
    id: "database-vector-databases-for-ai",
    category: "database",
    topic: "Specialized Databases",
    title: "Vector Databases and Embedding Search",
    difficulty: "Advanced",
    summary:
      "Vector databases store high-dimensional embeddings (numeric representations of text, images, or other content produced by AI models) and support approximate nearest-neighbor search to find semantically similar items, powering features like semantic search and RAG (retrieval-augmented generation).",
    explanation:
      "An embedding model converts text (or images/audio) into a fixed-length vector of numbers where semantically similar inputs produce vectors that are close together in that high-dimensional space — 'a fast car' and 'a quick automobile' end up near each other even though they share no keywords, which keyword-based search can't capture. A vector database indexes these embeddings using approximate nearest-neighbor algorithms (like HNSW) to efficiently find the closest vectors to a query vector without exhaustively comparing against every stored vector, which would be too slow at scale. This underpins semantic search (finding conceptually similar documents, not just keyword matches) and RAG, where relevant document chunks are retrieved by embedding similarity and fed into an LLM's context to ground its answers in real data. Purpose-built vector databases (Pinecone, Weaviate, Qdrant) as well as vector extensions for existing databases (pgvector for Postgres, MongoDB Atlas Vector Search) both exist — the choice depends on whether you want a dedicated system or to keep vectors alongside your existing relational/document data.",
    code: "-- pgvector: vector search inside Postgres, no separate system needed\nCREATE EXTENSION vector;\nCREATE TABLE documents (\n  id SERIAL PRIMARY KEY,\n  content TEXT,\n  embedding VECTOR(1536)  -- e.g. OpenAI embedding dimension\n);\n\n-- Find the 5 most semantically similar documents to a query embedding\nSELECT content, embedding <-> '[0.12, -0.03, ...]' AS distance\nFROM documents\nORDER BY distance\nLIMIT 5;",
    interviewQuestion:
      "How does semantic search using vector embeddings find relevant results that a keyword-based search would completely miss?",
  },
  {
    id: "database-migrations-in-production",
    category: "database",
    topic: "Database DevOps",
    title: "Running Schema Migrations Safely in Production",
    difficulty: "Advanced",
    summary:
      "A migration that locks a large table or drops a column the running application still reads from can cause an outage — safe production migrations are broken into backward-compatible steps deployed alongside a rolling application deploy.",
    explanation:
      "Adding a `NOT NULL` column with a default to a huge table can, on some databases, require rewriting every row and locking the table for the duration — unacceptable on a live system. Safe patterns include adding new columns as nullable first (fast, no full rewrite), backfilling data in small batches to avoid long-running transactions and replication lag spikes, and only adding constraints once backfilling is complete. Removing a column or table is even riskier during a rolling deploy, since old and new application versions run simultaneously for a period — dropping a column the old version still reads causes it to fail immediately. The standard safe approach is the 'expand-contract' pattern: expand (add the new column/table alongside the old, deploy code that writes to both), migrate data, deploy code that reads only from the new structure, and only then contract (drop the old column) — a multi-step, multi-deploy process rather than a single migration.",
    code: "-- UNSAFE on a large table: can lock for a long time, old app version breaks instantly\nALTER TABLE users ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT false;\nALTER TABLE users DROP COLUMN legacy_field; -- old running instances still expect this\n\n-- SAFE: expand-contract, multi-step\n-- Step 1 (deploy): add nullable column, no lock, no default backfill yet\nALTER TABLE users ADD COLUMN phone_verified BOOLEAN;\n-- Step 2: backfill in small batches, avoid one giant transaction\nUPDATE users SET phone_verified = false WHERE phone_verified IS NULL AND id BETWEEN 1 AND 10000;\n-- Step 3 (later deploy, once all instances write the new column): add the constraint\nALTER TABLE users ALTER COLUMN phone_verified SET NOT NULL;",
    interviewQuestion:
      "Why is dropping a database column dangerous during a rolling deployment, even if no code in the new version uses it anymore?",
  },
  {
    id: "database-backup-disaster-recovery",
    category: "database",
    topic: "Database DevOps",
    title: "Backup Strategy: RPO, RTO, and Point-in-Time Recovery",
    difficulty: "Advanced",
    summary:
      "Recovery Point Objective (RPO) defines how much data loss is acceptable (measured in time), and Recovery Time Objective (RTO) defines how quickly the system must be restored — together they determine whether daily snapshots are enough or continuous point-in-time recovery is required.",
    explanation:
      "RPO answers 'how much data can we afford to lose' — an RPO of 24 hours means daily backups are acceptable, while an RPO of 5 minutes means you need continuous backup (like streaming WAL/binlog archiving) so you can restore to any point within the last few minutes, not just the last snapshot. RTO answers 'how long can we be down while recovering' — a low RTO requires fast restore procedures (warm standby replicas ready to promote) rather than restoring a large backup from cold storage, which can take hours. Point-in-time recovery (PITR) works by combining a base backup with a continuous log of every change since (Postgres WAL, MySQL binlog); restoring means loading the base backup and replaying the log up to the exact desired moment, which is what lets you recover to '2 minutes before someone ran a bad DELETE' instead of only to the last nightly snapshot. Backup strategy should be driven by actual business RPO/RTO requirements, and — critically — restore procedures should be tested regularly, since an untested backup is not a real backup.",
    code: "-- Point-in-time recovery relies on continuous WAL archiving (Postgres)\narchive_mode = on\narchive_command = 'cp %p /backup/wal_archive/%f'\n\n-- Restore: base backup + replay WAL up to a specific moment\nrestore_command = 'cp /backup/wal_archive/%f %p'\nrecovery_target_time = '2026-07-04 14:32:00'  -- just before the bad DELETE happened",
    interviewQuestion:
      "Someone accidentally ran a DELETE without a WHERE clause on a production table 10 minutes ago. If you only have nightly full backups, what data is unrecoverable — and what backup strategy would have prevented that loss?",
  },
  {
    id: "database-json-columns-relational",
    category: "database",
    topic: "SQL Deep Dive",
    title: "JSON Columns in Relational Databases",
    difficulty: "Intermediate",
    summary:
      "Modern relational databases (Postgres JSONB, MySQL JSON) let you store semi-structured data in a column while still using SQL to query into it — useful for genuinely variable data, but a poor substitute for proper columns when the structure is actually known and consistent.",
    explanation:
      "JSONB in Postgres stores JSON in a decomposed binary format that supports indexing (via GIN indexes) and efficient querying into nested fields, letting you combine the flexibility of a document store with the transactional guarantees and joins of a relational database — useful for things like user preferences, dynamic form responses, or third-party API payloads with a shape you don't fully control. The trap is overusing it: stuffing every attribute into a JSONB blob 'to stay flexible' throws away query planner statistics, foreign key constraints, and type safety that a proper column would give you, and makes the schema implicit and undocumented rather than explicit. The practical rule is to use JSON columns for genuinely variable or sparse attributes, and real typed columns for anything with a known, consistent structure that's queried or constrained often.",
    code: "-- JSONB column with an index for querying into it\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name TEXT,\n  preferences JSONB  -- genuinely variable per user\n);\nCREATE INDEX idx_users_prefs ON users USING GIN(preferences);\n\n-- Query into nested JSON\nSELECT name FROM users WHERE preferences @> '{\"theme\": \"dark\"}';\nSELECT preferences->>'timezone' AS tz FROM users WHERE id = 42;",
    interviewQuestion:
      "When is a JSONB column the right choice over a normal typed column, and what do you lose by overusing JSONB for data that actually has a fixed, known shape?",
  },
  {
    id: "database-soft-deletes-vs-hard-deletes",
    category: "database",
    topic: "Schema Design",
    title: "Soft Deletes vs Hard Deletes",
    difficulty: "Intermediate",
    summary:
      "A soft delete marks a row as deleted (e.g. a deleted_at timestamp) without removing it, preserving history and enabling undo, but every query must now remember to filter out soft-deleted rows or risk showing 'deleted' data.",
    explanation:
      "Hard deletes remove the row entirely — simple, keeps tables smaller, and requires no special handling elsewhere, but the data is genuinely gone, which is a problem for undo features, audit trails, or referential integrity if other tables still reference that row. Soft deletes add a `deleted_at` (or `is_deleted`) column instead of removing the row, preserving history and making 'undo delete' trivial, and are often required for compliance/audit reasons. The cost is that every single query against that table must now include `WHERE deleted_at IS NULL` (easy to forget, causing 'deleted' data to leak back into results), unique constraints get trickier (two 'deleted' rows with the same email would violate a naive unique constraint), and the table grows indefinitely unless old soft-deleted rows are eventually purged by a separate cleanup process. A common middle ground is soft-deleting for a grace period (enabling undo) and then hard-deleting permanently after that window via a scheduled job.",
    code: "-- Soft delete: mark instead of remove\nALTER TABLE posts ADD COLUMN deleted_at TIMESTAMPTZ;\nUPDATE posts SET deleted_at = now() WHERE id = 42;\n\n-- EVERY query must remember this filter, or deleted rows leak through\nSELECT * FROM posts WHERE deleted_at IS NULL;\n\n-- Unique constraint gets tricky with soft deletes\n-- (two \"deleted\" users with the same email would otherwise violate uniqueness)\nCREATE UNIQUE INDEX idx_users_email_active ON users(email) WHERE deleted_at IS NULL;",
    interviewQuestion:
      "What's the most common bug introduced by switching a table from hard deletes to soft deletes, and how do you prevent it systematically rather than remembering it per-query?",
  },
  {
    id: "database-orm-lazy-vs-eager-loading",
    category: "database",
    topic: "SQL Deep Dive",
    title: "ORM Lazy Loading vs Eager Loading",
    difficulty: "Intermediate",
    summary:
      "Lazy loading fetches related data only when accessed, which is convenient but is the root cause of the N+1 query problem; eager loading fetches related data upfront in the same or a batched query, trading some over-fetching for far fewer round trips.",
    explanation:
      "Lazy loading means an ORM doesn't fetch a related object (like a blog post's author) until code actually accesses that property, which feels convenient in code but silently issues a separate database query at that moment — if you loop over 100 posts and access `post.author` inside the loop, you get 1 query for the posts plus 100 more for each author, the classic N+1 problem. Eager loading tells the ORM upfront to fetch related data as part of the initial query (via a JOIN) or as an immediate batched follow-up query (fetch all posts, then one query for all their authors' IDs at once), collapsing what would be N+1 queries into 1 or 2. The tradeoff is that eager loading everything by default over-fetches data you might not need on every code path, so the right approach is being deliberate: eager-load relations you know you'll access in a given code path, and leave others lazy.",
    code: "// Lazy loading: N+1 problem hiding in plain sight\nconst posts = await Post.findAll(); // 1 query\nfor (const post of posts) {\n  console.log(post.author.name); // ANOTHER query, once per post!\n}\n\n// Eager loading: batches related data upfront\nconst posts = await Post.findAll({ include: [Author] }); // 1 query (JOIN) or 2 (batched)\nfor (const post of posts) {\n  console.log(post.author.name); // no extra queries — already loaded\n}",
    interviewQuestion:
      "Your app got slow after adding a feature that displays each post's author. Using an ORM, how would you diagnose whether it's an N+1 problem, and how would you fix it?",
  },
  {
    id: "database-join-types-deep-dive",
    category: "database",
    topic: "SQL Deep Dive",
    title: "SQL Join Types: Inner, Outer, Cross, and Self Joins",
    difficulty: "Basic",
    summary:
      "INNER JOIN returns only matching rows from both tables; LEFT/RIGHT JOIN keep all rows from one side even without a match; FULL OUTER JOIN keeps all rows from both; CROSS JOIN produces every combination; a SELF JOIN joins a table to itself for hierarchical or comparative queries.",
    explanation:
      "INNER JOIN is the most common — it returns only rows where the join condition matches in both tables, silently dropping rows without a match, which is a frequent source of 'missing data' bugs when someone expects every row from one side to appear regardless. LEFT JOIN keeps every row from the left table, filling in NULLs for columns from the right table when there's no match — essential for queries like 'all customers, including those with zero orders.' RIGHT JOIN is the mirror image (rarely used since you can just swap table order and use LEFT JOIN). FULL OUTER JOIN keeps all rows from both sides, matching where possible and filling NULLs elsewhere. CROSS JOIN produces the Cartesian product — every row from table A paired with every row from table B — usually only intentional for generating combinations, not typical data queries. A SELF JOIN treats one table as if it were two by aliasing it, useful for comparing rows within the same table, like finding employees who earn more than their manager.",
    code: "-- LEFT JOIN: keep ALL customers, even with zero orders\nSELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name;\n\n-- SELF JOIN: find employees earning more than their manager\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;",
    interviewQuestion:
      "A report is missing customers who have never placed an order. What join mistake causes this, and how do you fix it?",
  },
  {
    id: "database-constraints-deep-dive",
    category: "database",
    topic: "Schema Design",
    title: "Database Constraints: Enforcing Correctness at the Data Layer",
    difficulty: "Intermediate",
    summary:
      "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, and CHECK constraints enforce data integrity rules directly in the database, which is more reliable than only validating in application code since the database is the last line of defense against bad data.",
    explanation:
      "Application-level validation is easy to bypass — a bug, a script run directly against the database, or a second application sharing the same database can all skip it — but database constraints are enforced no matter what wrote the data. A FOREIGN KEY constraint guarantees a referenced row actually exists, preventing orphaned records; UNIQUE guarantees no duplicate values in a column or column combination; NOT NULL guarantees a required field is always present; CHECK constraints enforce arbitrary conditions like 'price must be positive' or 'status must be one of a fixed set of values.' Relying solely on application validation for these rules means any code path that skips validation — a rushed hotfix, a migration script, direct database access — can silently corrupt data in ways that are often only discovered much later and are painful to clean up. Constraints should be the source of truth for data integrity; application validation is a complementary layer for better error messages, not a substitute.",
    code: "CREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  customer_id INT NOT NULL REFERENCES customers(id),\n  total DECIMAL(10,2) CHECK (total >= 0),\n  status VARCHAR(20) CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),\n  tracking_number VARCHAR(50) UNIQUE\n);\n\n-- This INSERT fails at the database level, regardless of what app wrote it\nINSERT INTO orders (customer_id, total, status) VALUES (999, -50, 'unknown');\n-- ERROR: violates check constraint \"orders_total_check\"",
    interviewQuestion:
      "Why is it risky to rely only on application-level validation for data integrity rules like 'this field must be unique' instead of a database constraint?",
  },
  {
    id: "database-views-vs-materialized-views",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Views vs Materialized Views",
    difficulty: "Intermediate",
    summary:
      "A regular view is a saved query re-executed every time it's referenced, always reflecting live data; a materialized view stores the query's result physically and must be refreshed on a schedule, trading freshness for much faster reads on expensive queries.",
    explanation:
      "A view is essentially a named, reusable SQL query — querying it re-runs the underlying query every time, so results are always current, but if the underlying query is expensive (heavy joins and aggregations), a view offers no performance benefit since the cost is paid on every read. A materialized view executes the query once and physically stores the result set like a table, so subsequent reads are fast lookups instead of re-computation — ideal for expensive aggregate reports that don't need up-to-the-second freshness, like a daily sales summary. The tradeoff is staleness: a materialized view only reflects the data as of its last refresh, which must be triggered manually, on a schedule, or (in some databases) incrementally as underlying data changes. Choosing between them is a freshness-versus-performance decision specific to each use case.",
    code: "-- Regular view: always fresh, but re-runs the full query every time\nCREATE VIEW customer_lifetime_value AS\nSELECT customer_id, SUM(total) AS ltv\nFROM orders\nGROUP BY customer_id;\n\n-- Materialized view: fast reads, but can be stale until refreshed\nCREATE MATERIALIZED VIEW customer_ltv_cached AS\nSELECT customer_id, SUM(total) AS ltv\nFROM orders\nGROUP BY customer_id;\n\nREFRESH MATERIALIZED VIEW customer_ltv_cached; -- run on a schedule",
    interviewQuestion:
      "A dashboard showing lifetime customer value is taking 8 seconds to load because of a heavy aggregation query. Would a regular view help? What would, and what's the tradeoff?",
  },
  {
    id: "database-stored-procedures-triggers",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Stored Procedures and Triggers: Logic Inside the Database",
    difficulty: "Advanced",
    summary:
      "A stored procedure is precompiled logic that runs inside the database, callable like a function; a trigger automatically fires in response to a data change (insert/update/delete) — both push business logic into the database layer, which is powerful but makes that logic harder to version, test, and observe compared to application code.",
    explanation:
      "Stored procedures let you bundle multiple SQL statements (with conditionals and loops, depending on the database) into a single callable unit that runs on the database server, reducing network round trips for multi-step operations and centralizing logic that must be consistent regardless of which application calls it. Triggers automatically execute in response to a table event — for example, automatically updating an `updated_at` timestamp on every row change, or maintaining a denormalized counter whenever a related row is inserted. The downside is that this logic lives outside the application codebase, in the database itself, which makes it harder to version control alongside application code, harder to unit test with normal application testing tools, and easy to forget about — an unexpected trigger firing on a seemingly simple UPDATE can cause confusing, hard-to-trace side effects. Most modern architectures favor keeping business logic in application code and reserving triggers/procedures for narrow, purely data-integrity concerns (like maintaining an audit timestamp), not core business rules.",
    code: "-- Trigger: automatically maintain an updated_at timestamp\nCREATE OR REPLACE FUNCTION set_updated_at()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_set_updated_at\nBEFORE UPDATE ON orders\nFOR EACH ROW EXECUTE FUNCTION set_updated_at();\n-- Now EVERY update to orders silently sets updated_at — even from a migration script",
    interviewQuestion:
      "What's the downside of putting important business logic in a database trigger instead of application code, even though it guarantees the logic always runs?",
  },
  {
    id: "database-prepared-statements-sql-injection",
    category: "database",
    topic: "Security",
    title: "Prepared Statements: Why Parameterized Queries Prevent SQL Injection",
    difficulty: "Intermediate",
    summary:
      "Building a SQL query by concatenating raw user input into a string lets an attacker inject their own SQL logic; a prepared/parameterized statement sends the query structure and the data separately, so user input can never be interpreted as SQL syntax.",
    explanation:
      "Concatenating user input directly into a SQL string — `\"SELECT * FROM users WHERE email = '\" + input + \"'\"` — means anything the user types becomes part of the actual SQL the database executes; an input like `' OR '1'='1` changes the query's logic entirely, and more sophisticated injections can read or modify arbitrary data. A prepared statement instead sends the query template with placeholders (`WHERE email = $1`) to the database separately from the parameter values; the database compiles the query structure first, then substitutes the values purely as data, never as executable SQL syntax, regardless of what characters they contain. This isn't just 'escaping special characters' (which is error-prone and easy to get wrong) — it's a structural guarantee that user input can never change the shape of the query. Virtually every modern database driver and ORM supports parameterized queries by default, and string-concatenating SQL should be treated as an automatic security review flag.",
    code: "// VULNERABLE: user input becomes part of the SQL itself\nconst query = `SELECT * FROM users WHERE email = '${email}'`;\n// input: ' OR '1'='1  ->  query becomes: WHERE email = '' OR '1'='1' (matches everyone!)\n\n// SAFE: parameterized — email is always treated as data, never SQL syntax\nconst result = await db.query(\"SELECT * FROM users WHERE email = $1\", [email]);\n// even if email = \"' OR '1'='1\", it's matched literally, not interpreted as SQL",
    interviewQuestion:
      "Why doesn't simply escaping quotes in user input provide the same guarantee against SQL injection as a parameterized query?",
  },
  {
    id: "database-mvcc-explained",
    category: "database",
    topic: "Transactions",
    title: "MVCC: How Databases Handle Concurrent Reads and Writes",
    difficulty: "Advanced",
    summary:
      "Multi-Version Concurrency Control lets readers see a consistent snapshot of data without blocking writers, and writers create new row versions without blocking readers, by keeping multiple versions of a row and giving each transaction a consistent view based on when it started.",
    explanation:
      "Without MVCC, a naive approach would have readers and writers block each other constantly — a long-running read would prevent any write to the same rows, hurting concurrency badly. MVCC (used by PostgreSQL, MySQL's InnoDB, and others) instead keeps multiple versions of a row: when a transaction updates a row, it doesn't overwrite the old version in place — it creates a new version, and old versions remain visible to transactions that started before the update, based on transaction snapshots. This means readers never block writers and writers never block readers (they might still conflict with each other on the same row for writes), dramatically improving concurrency for read-heavy workloads. The cost is that old row versions need periodic cleanup (Postgres's `VACUUM` process) to prevent unbounded table bloat, since a version isn't physically removed until no transaction could possibly still need to see it.",
    code: "-- Transaction A starts, sees a snapshot of the data\nBEGIN; -- Transaction A\nSELECT balance FROM accounts WHERE id = 1; -- sees $100\n\n-- Transaction B updates the same row and commits\nBEGIN; -- Transaction B\nUPDATE accounts SET balance = 150 WHERE id = 1;\nCOMMIT;\n\n-- Transaction A still sees the ORIGINAL snapshot ($100), not blocked, not seeing B's change\nSELECT balance FROM accounts WHERE id = 1; -- still $100 within A's transaction\nCOMMIT; -- A finishes; a NEW transaction would now see $150",
    interviewQuestion:
      "Why does PostgreSQL need a VACUUM process, and how does that relate to how MVCC stores multiple versions of a row?",
  },
  {
    id: "database-natural-vs-surrogate-keys",
    category: "database",
    topic: "Schema Design",
    title: "Natural Keys vs Surrogate Keys",
    difficulty: "Intermediate",
    summary:
      "A natural key is a real-world attribute that's already unique (like an email or SSN) used as the primary key; a surrogate key is an artificial, meaningless identifier (an auto-incrementing integer or UUID) generated purely for the database — surrogate keys are almost always the safer default.",
    explanation:
      "Using a natural key as a primary key seems appealing since it avoids an extra column, but real-world 'unique' attributes have a habit of changing or turning out not to be as unique as assumed — emails get changed or reused, SSNs have privacy and even occasional duplication issues, and any foreign key referencing that natural key needs to cascade-update everywhere if it ever changes, which is expensive and risky at scale. Surrogate keys (auto-increment integers or UUIDs) are stable for the lifetime of the row, meaningless outside the database (so they never need to change for business reasons), and simpler to reference in foreign keys and URLs. The natural key should still typically get a UNIQUE constraint to enforce the real-world uniqueness rule, just not serve as the primary/foreign key relationships throughout the schema. The main tradeoff of surrogate keys is that auto-increment integers can leak information (sequential IDs reveal approximate row counts and creation order) and UUIDs are larger and less index-friendly than integers, both addressable but worth knowing about.",
    code: "-- Risky: natural key as primary key\nCREATE TABLE users (\n  email VARCHAR(255) PRIMARY KEY, -- what happens when a user changes their email?\n  name VARCHAR(100)\n);\n\n-- Safer: surrogate key, natural key uniquely constrained separately\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,       -- stable, meaningless, never needs to change\n  email VARCHAR(255) UNIQUE,   -- enforces real-world uniqueness, CAN change safely\n  name VARCHAR(100)\n);",
    interviewQuestion:
      "Why is using a user's email as the primary key of a users table risky, even though emails are supposed to be unique?",
  },
  {
    id: "database-mongodb-multi-document-transactions",
    category: "database",
    topic: "MongoDB Deep Dive",
    title: "MongoDB Multi-Document ACID Transactions",
    difficulty: "Advanced",
    summary:
      "MongoDB supports multi-document transactions (since version 4.0) with the same ACID guarantees as relational databases, but they come with a real performance cost and are meant for the exceptional case where atomicity across documents is truly required, not routine use.",
    explanation:
      "MongoDB's document model was designed so that a well-modeled schema (embedding related data) needs single-document atomicity, which MongoDB has always guaranteed — a single document's update either fully happens or doesn't. Multi-document transactions extend this to operations spanning multiple documents or collections, useful when the schema genuinely can't avoid needing atomicity across separate documents, like transferring a value between two separate account documents. However, they carry meaningfully more overhead than single-document operations (holding locks, tracking a session across multiple operations, replicating transaction state), and their existence sometimes signals a schema design that could be revisited — if you find yourself needing transactions constantly, it may indicate data that should be embedded together rather than split across documents in the first place. Used sparingly for genuine cross-document atomicity needs, they're a valuable safety net; used as a default habit, they undermine some of MongoDB's performance characteristics.",
    code: "const session = client.startSession();\ntry {\n  await session.withTransaction(async () => {\n    await accounts.updateOne(\n      { _id: fromId }, { $inc: { balance: -amount } }, { session }\n    );\n    await accounts.updateOne(\n      { _id: toId }, { $inc: { balance: amount } }, { session }\n    );\n  });\n} finally {\n  await session.endSession();\n}",
    interviewQuestion:
      "If you find your application needs MongoDB multi-document transactions constantly, what might that suggest about your schema design?",
  },
  {
    id: "database-mongodb-change-streams",
    category: "database",
    topic: "MongoDB Deep Dive",
    title: "MongoDB Change Streams: Reacting to Data Changes in Real Time",
    difficulty: "Advanced",
    summary:
      "Change streams let an application subscribe to real-time notifications of inserts, updates, and deletes on a collection, without polling — powering use cases like live dashboards, cache invalidation, and syncing data to a search index as it changes.",
    explanation:
      "Before change streams, keeping a secondary system (a cache, a search index, a real-time UI) in sync with MongoDB meant either polling for changes on an interval (adding latency and unnecessary load when nothing changed) or manually emitting events from application code every place data gets written (easy to miss a code path). Change streams tap directly into MongoDB's internal replication oplog and deliver a stream of change events — what changed, on which document, and how — to any subscriber, regardless of which application or process made the change, closing the gap where a forgotten code path could silently skip syncing a change. This is commonly used to keep a search index (Elasticsearch) or cache (Redis) up to date automatically, or to power live-updating UI without the client needing to poll.",
    code: "const changeStream = db.collection(\"orders\").watch();\n\nchangeStream.on(\"change\", (event) => {\n  if (event.operationType === \"insert\") {\n    console.log(\"New order:\", event.fullDocument);\n    syncToSearchIndex(event.fullDocument); // keep Elasticsearch in sync automatically\n  }\n  if (event.operationType === \"update\") {\n    invalidateCache(event.documentKey._id); // evict stale cache entry\n  }\n});",
    interviewQuestion:
      "Why are MongoDB change streams more reliable than having application code manually trigger a cache invalidation every time it writes data?",
  },
  {
    id: "database-redis-eviction-policies",
    category: "database",
    topic: "Redis Deep Dive",
    title: "Redis Eviction Policies: What Happens When Memory Fills Up",
    difficulty: "Advanced",
    summary:
      "Redis is an in-memory store with a configurable maximum memory limit; once full, an eviction policy decides which keys to remove — options range from evicting the least-recently-used key to refusing new writes entirely, and picking the wrong one for your use case can silently lose important data.",
    explanation:
      "`maxmemory-policy` controls behavior once Redis hits its memory limit. `allkeys-lru` evicts the least-recently-used key across all keys, well suited for a pure cache where losing any key is acceptable since it can be recomputed or re-fetched. `volatile-lru` only evicts keys that have an explicit expiry set (`EXPIRE`), leaving keys without a TTL untouched — useful when Redis holds a mix of cache data (with a TTL, safe to evict) and important data with no TTL (like a session store or a job queue) that must never be silently evicted. `noeviction` (the default) simply rejects new write commands once memory is full, which is right when losing data is unacceptable and you'd rather see errors and scale up memory than silently lose something important. Choosing `allkeys-lru` for a use case where Redis stores non-cache, non-recomputable data is a classic mistake that causes silent, hard-to-diagnose data loss under memory pressure.",
    code: "# redis.conf\nmaxmemory 2gb\n\n# Pure cache: safe to evict anything least-recently-used\nmaxmemory-policy allkeys-lru\n\n# Mixed use: cache data has a TTL (safe to evict), other data doesn't (must NOT be evicted)\nmaxmemory-policy volatile-lru\n\n# Critical data, no evictions allowed — writes fail instead of losing data\nmaxmemory-policy noeviction",
    interviewQuestion:
      "You're using Redis both as a cache and as a durable job queue in the same instance, configured with allkeys-lru. What can go wrong?",
  },
  {
    id: "database-columnar-vs-row-storage",
    category: "database",
    topic: "Data Warehousing",
    title: "Columnar vs Row-Oriented Storage",
    difficulty: "Advanced",
    summary:
      "Row-oriented storage keeps all columns of a row physically together on disk, efficient for reading/writing whole records; columnar storage groups each column's values together across all rows, efficient for scanning and aggregating a few columns across millions of rows.",
    explanation:
      "In row storage, reading one full record (like fetching a single order) touches one contiguous block of disk, which is efficient for OLTP-style access patterns that read or write entire rows at a time. In columnar storage, all values for a single column across every row are stored contiguously, so a query that only needs to aggregate one or two columns (like `SUM(revenue)` across a billion rows) reads only the data for those specific columns, skipping every other column entirely — dramatically less I/O than a row-store would need for the same aggregation, since a row-store would have to read every column of every row just to get at the one it needs. Columnar storage also compresses extremely well, since similar values (like a `country` column with only ~200 distinct values) sit next to each other. This is exactly why analytical/data-warehouse databases (BigQuery, Redshift, Snowflake, and column-store extensions like Postgres's Citus) use columnar storage, while transactional databases default to row storage.",
    code: "-- Row storage: physically stored as [id1,name1,price1], [id2,name2,price2], ...\n-- Reading one full row is cheap; aggregating one column means touching every row's full data\n\n-- Columnar storage: physically stored as [id1,id2,id3...], [name1,name2,name3...], [price1,price2,price3...]\n-- This aggregation only reads the 'price' column's data, skipping id and name entirely\nSELECT SUM(price) FROM sales; -- fast in a column-store, even over billions of rows",
    interviewQuestion:
      "Why is a columnar database dramatically faster than a row-oriented one for a query like SUM(revenue) over a billion-row table, but not necessarily faster for fetching one specific order by ID?",
  },
  {
    id: "database-partitioning-vs-sharding",
    category: "database",
    topic: "Scaling Databases",
    title: "Partitioning vs Sharding: Splitting Data Within vs Across Servers",
    difficulty: "Advanced",
    summary:
      "Partitioning splits a large table into smaller physical pieces within the same database instance (for manageability and query performance); sharding splits data across multiple separate database instances or servers entirely (for horizontal scale beyond one machine's capacity).",
    explanation:
      "Partitioning (like Postgres table partitioning) divides one logical table into multiple physical partitions — commonly by range (e.g. one partition per month) — all still living on the same database server, which speeds up queries that only need to touch a specific partition (querying just this month's data skips scanning every other month) and makes maintenance operations like archiving old data or rebuilding an index much faster since they can operate on individual partitions. Sharding takes this further by distributing partitions across entirely separate servers, so the data (and the load of serving it) is spread across multiple machines, which is what actually lets you scale beyond the capacity of a single database server — but it introduces real complexity: cross-shard queries and joins become expensive or impossible without pulling data into the application layer, and choosing a shard key becomes a permanent, hard-to-change architectural decision. Partitioning without sharding is a much simpler first step that solves a lot of the same manageability and performance problems without the operational complexity of a distributed database.",
    code: "-- Partitioning: still one logical table, one server, split physically by range\nCREATE TABLE sales (\n  id SERIAL, sale_date DATE, amount DECIMAL\n) PARTITION BY RANGE (sale_date);\n\nCREATE TABLE sales_2026_01 PARTITION OF sales\n  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');\n\n-- A query for January only scans the January partition, not the whole table\nSELECT SUM(amount) FROM sales WHERE sale_date >= '2026-01-01' AND sale_date < '2026-02-01';\n\n-- Sharding: same idea, but each piece lives on a DIFFERENT server entirely\n-- shard-1.internal: sales for customers 1-1,000,000\n-- shard-2.internal: sales for customers 1,000,001-2,000,000",
    interviewQuestion:
      "Your single Postgres instance is struggling with a 500-million-row table. Would you reach for partitioning or sharding first, and why?",
  },
  {
    id: "database-database-as-a-service-tradeoffs",
    category: "database",
    topic: "Database DevOps",
    title: "Managed Database Services: What You Trade for Convenience",
    difficulty: "Intermediate",
    summary:
      "Managed database services (RDS, MongoDB Atlas, Cloud SQL) handle patching, backups, replication, and failover automatically, removing significant operational burden — at the cost of less low-level control, vendor-specific limitations, and often higher direct cost than self-hosting at scale.",
    explanation:
      "Running your own database means handling OS patching, database version upgrades, backup scheduling and testing, replication setup, failover automation, and monitoring — all real, ongoing operational work that a small team may not have the capacity to do well, and getting any of it wrong (an untested backup, a botched failover) can be catastrophic. A managed service handles all of this automatically and typically offers one-click read replicas, point-in-time recovery, and automated failover, letting a team focus on the application instead of database operations. The tradeoffs: less access to low-level configuration and OS-level tuning, sometimes restricted or delayed access to the newest database version or extensions, being subject to the provider's maintenance windows, and often meaningfully higher direct cost per unit of compute/storage compared to a well-run self-hosted instance at large scale. For most teams below a certain scale, the operational risk reduction from a managed service is worth the premium; for very large, well-resourced infrastructure teams with strict cost or customization requirements, self-hosting can make sense.",
    code: "# Self-hosted: you own all of this\n# - OS patching, DB version upgrades\n# - Backup scheduling AND testing restores\n# - Replication setup, failover automation\n# - Monitoring, alerting, on-call for DB issues\n\n# Managed (e.g. RDS): provider handles all of the above\n# - You configure: instance size, backup retention window, read replica count\n# - You still own: schema design, query optimization, connection pooling, application-level caching",
    interviewQuestion:
      "For a small team without dedicated database administrators, what's the real risk of self-hosting a production database instead of using a managed service, beyond just the extra setup time?",
  },
  {
    id: "database-testing-with-testcontainers",
    category: "database",
    topic: "Database DevOps",
    title: "Testing Against a Real Database with Testcontainers",
    difficulty: "Intermediate",
    summary:
      "Mocking the database in tests can hide real bugs in actual SQL queries and constraints; Testcontainers spins up a real, disposable database instance (in Docker) for each test run, giving confidence that queries work against the real thing without needing a shared test database.",
    explanation:
      "Mocking a database layer in tests means you're testing that your code calls the mock correctly, not that your actual SQL queries, constraints, and transactions behave correctly against a real database engine — a query with a subtle syntax issue or an incorrect JOIN can pass every mocked test and still fail in production. Testcontainers (a library available in many languages) programmatically starts a real, throwaway database in a Docker container as part of the test suite, migrates it to the current schema, runs tests against a real instance, and tears it down afterward — giving genuine confidence that queries work correctly, without needing a shared, stateful test database that different test runs could interfere with. This does make the test suite slower than pure mocks (starting a real container takes time) and requires Docker in the CI environment, but the tradeoff is usually worth it for tests that touch actual query correctness, reserving mocks for higher-level unit tests that don't need real database behavior.",
    code: "// Testcontainers: spin up a REAL disposable Postgres for this test run\nconst container = await new PostgreSqlContainer().start();\nconst db = new Pool({ connectionString: container.getConnectionUri() });\n\nawait runMigrations(db); // apply the real schema\n\ntest(\"creating a duplicate email fails\", async () => {\n  await db.query(\"INSERT INTO users (email) VALUES ($1)\", [\"a@test.com\"]);\n  await expect(\n    db.query(\"INSERT INTO users (email) VALUES ($1)\", [\"a@test.com\"])\n  ).rejects.toThrow(); // tests the REAL unique constraint, not a mock\n});\n\nafterAll(() => container.stop());",
    interviewQuestion:
      "Why might a fully-mocked database test suite pass in CI but still miss a bug that shows up in production?",
  },
  {
    id: "database-composite-indexes-order-matters",
    category: "database",
    topic: "Performance",
    title: "Composite Index Column Order: Why It's Not Arbitrary",
    difficulty: "Advanced",
    summary:
      "A composite (multi-column) B-tree index only efficiently supports queries that filter on a left-to-right prefix of its columns — putting the most selective or most commonly-filtered-alone column first is usually the right default, not an arbitrary choice.",
    explanation:
      "A composite index on `(a, b, c)` is physically sorted first by `a`, then within each `a` value by `b`, then within each `b` value by `c` — like a phone book sorted by last name, then first name. This means the index can efficiently serve queries filtering on `a` alone, `a AND b`, or `a AND b AND c`, but NOT a query filtering on `b` alone or `c` alone, since those aren't a leftmost prefix of the sort order — such a query would need a full index scan or fall back to a table scan entirely. This is why column order in a composite index isn't arbitrary: it should generally match the most common query patterns, with columns used in equality filters before columns used for sorting, before columns used in range filters (the ESR rule also mentioned for MongoDB applies conceptually to relational composite indexes too). Creating a separate index for every possible column combination isn't practical either, since each index adds write overhead — the real skill is designing composite indexes around your actual, measured query patterns.",
    code: "CREATE INDEX idx_orders_status_date ON orders(status, created_at);\n\n-- Uses the index efficiently (leftmost prefix: status, then status+created_at)\nSELECT * FROM orders WHERE status = 'pending';\nSELECT * FROM orders WHERE status = 'pending' AND created_at > '2026-01-01';\n\n-- Does NOT use this index efficiently (created_at isn't a leftmost prefix)\nSELECT * FROM orders WHERE created_at > '2026-01-01';",
    interviewQuestion:
      "You have a composite index on (status, created_at), but a query filtering only on created_at is doing a full table scan. Why, and how would you fix it if that query pattern is common?",
  },
  {
    id: "database-encryption-at-rest-in-transit",
    category: "database",
    topic: "Security",
    title: "Database Encryption: At Rest vs In Transit",
    difficulty: "Intermediate",
    summary:
      "Encryption in transit (TLS) protects data as it travels over the network between the application and the database; encryption at rest protects the data files on disk — both are needed, since they protect against completely different threats.",
    explanation:
      "Encryption in transit ensures that anyone intercepting network traffic between the application and the database (on a shared network, a compromised router, or a cloud provider's internal network) can't read the query contents or results — this is table stakes and enabled via TLS on the database connection. Encryption at rest ensures that if someone gains access to the physical storage — a stolen disk, an improperly decommissioned drive, or unauthorized access to the storage layer in a cloud environment — the data itself is unreadable without the encryption key, typically handled transparently by the database or storage layer (Transparent Data Encryption) without changing how queries work. Neither protects against every threat on its own: encryption in transit does nothing once data is written to disk, and encryption at rest does nothing for data actively flowing over an unencrypted connection — both layers are needed together, and neither protects against a compromised application server or a malicious insider with legitimate query access, which requires separate controls like access management and audit logging.",
    code: "-- Encryption in transit: enforce TLS for all connections\n-- postgresql.conf\nssl = on\n\n-- Client connection string requiring TLS\npostgresql://user:pass@host:5432/db?sslmode=require\n\n-- Encryption at rest: typically enabled at the storage/volume level\n-- (e.g. AWS RDS \"Enable encryption\" checkbox, using AES-256 under the hood)\n-- Transparent to queries — no application code changes needed",
    interviewQuestion:
      "If your database connection uses TLS, is encryption at rest still necessary? What threat does each one protect against that the other doesn't?",
  },
  {
    id: "database-access-control-least-privilege",
    category: "database",
    topic: "Security",
    title: "Database Access Control: Roles, Grants, and Least Privilege",
    difficulty: "Intermediate",
    summary:
      "Every application, service, and person accessing a database should have only the exact permissions they need — a reporting tool should never have DELETE access, and an application's runtime user shouldn't have schema-altering privileges — limiting the damage any single compromised credential can do.",
    explanation:
      "It's common but risky to give an application's database user broad, unrestricted access (effectively admin) purely out of convenience, meaning a SQL injection vulnerability, a leaked credential, or a bug in application code could potentially read, modify, or delete anything in the database, or even alter the schema. Following least privilege means creating distinct roles for distinct purposes — an application runtime role with only SELECT/INSERT/UPDATE/DELETE on the specific tables it needs (no schema-altering DDL permissions), a separate read-only role for reporting/analytics tools, and a migration role with schema-altering permissions used only during deploys, not by the always-running application. This doesn't prevent every attack, but it dramatically limits the blast radius when something does go wrong — a compromised application credential under least privilege can't drop tables or read data from unrelated services sharing the same database instance, which is exactly the difference between a contained incident and a catastrophic one.",
    code: "-- Least privilege: application role gets only what it needs, nothing more\nCREATE ROLE app_runtime WITH LOGIN PASSWORD '...';\nGRANT SELECT, INSERT, UPDATE, DELETE ON orders, order_items TO app_runtime;\n-- Notably NOT granted: DROP, ALTER, CREATE, or access to unrelated tables\n\n-- Separate read-only role for a reporting tool\nCREATE ROLE reporting_readonly WITH LOGIN PASSWORD '...';\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting_readonly;\n-- This role CANNOT modify or delete anything, even if its credentials leak",
    interviewQuestion:
      "Your application's database user currently has full admin privileges 'for convenience.' What's the real-world risk of that, and what would you change?",
  },
  {
    id: "database-row-level-security-deep-dive",
    category: "database",
    topic: "Security",
    title: "Row-Level Security: Enforcing Access Rules Inside the Database",
    difficulty: "Advanced",
    summary:
      "Row-Level Security (RLS) lets the database itself filter which rows a given query is allowed to see or modify, based on policies tied to the current user/session — enforcing access control even if application code forgets a WHERE clause.",
    explanation:
      "Normally, access control for 'which rows can this user see' lives entirely in application code — every query must remember to add the right WHERE clause (like `tenant_id = ?` or `owner_id = ?`), and a single missed filter anywhere in the codebase becomes a data leak. Row-Level Security moves this enforcement into the database itself: a policy is attached to a table, and the database transparently applies it to every query against that table, regardless of whether the application code included the filter or not — so even a forgotten WHERE clause, an ad-hoc query run directly against the database, or a bug in an ORM's generated SQL still can't see rows outside what the policy allows. This is especially valuable in multi-tenant systems as a genuine safety net against the single most damaging class of bug (cross-tenant data leaks) rather than relying purely on application-layer discipline, though it requires setting the relevant session context (like the current tenant ID) correctly on every connection for the policy to work.",
    code: "-- Enable RLS and define a policy\nALTER TABLE invoices ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY tenant_isolation ON invoices\n  USING (tenant_id = current_setting('app.current_tenant')::int);\n\n-- Application sets the session context once per connection/request\nSET app.current_tenant = '42';\n\n-- ANY query against invoices now automatically only sees tenant 42's rows —\n-- even this one, which has NO explicit tenant_id filter at all:\nSELECT * FROM invoices; -- RLS silently restricts this to tenant 42 only",
    interviewQuestion:
      "How does Row-Level Security protect against a cross-tenant data leak even when a developer forgets to add a tenant_id filter to a query?",
  },
  {
    id: "database-geospatial-queries",
    category: "database",
    topic: "Specialized Databases",
    title: "Geospatial Queries: Finding What's Nearby",
    difficulty: "Advanced",
    summary:
      "Answering 'find all locations within 5km' efficiently requires spatial indexes (like PostGIS's GiST indexes or MongoDB's geospatial indexes) — a naive distance calculation across every row doesn't scale, since it can't use a normal B-tree index at all.",
    explanation:
      "A query like 'find all restaurants within 5km of this point' can't be answered efficiently with a normal index, since distance depends on two dimensions (latitude and longitude) combined, not a single sortable column a B-tree can index directly. Spatial indexes (like PostGIS's use of GiST or MongoDB's `2dsphere` index) organize data using structures suited to multi-dimensional range queries, letting the database quickly narrow down to a small candidate set of nearby points instead of computing the distance to every single row in the table. PostGIS (a Postgres extension) adds rich geospatial types and functions — points, polygons, distance calculations that account for the Earth's curvature — while MongoDB has built-in geospatial query operators (`$near`, `$geoWithin`) backed by geospatial indexes. Building 'find nearby' features without a proper spatial index works fine on a small dataset in testing and then becomes unusably slow in production once the table has any real amount of data, since it silently falls back to a full table scan with per-row distance math.",
    code: "-- PostGIS: spatial index + efficient nearby query\nCREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);\n\nSELECT name, ST_Distance(location, ST_MakePoint(-73.99, 40.73)) AS distance\nFROM restaurants\nWHERE ST_DWithin(location, ST_MakePoint(-73.99, 40.73)::geography, 5000) -- 5km\nORDER BY distance\nLIMIT 20;\n\n// MongoDB equivalent with a 2dsphere index\ndb.restaurants.createIndex({ location: \"2dsphere\" });\ndb.restaurants.find({\n  location: { $near: { $geometry: { type: \"Point\", coordinates: [-73.99, 40.73] }, $maxDistance: 5000 } }\n});",
    interviewQuestion:
      "Why can't a normal B-tree index efficiently answer 'find all points within 5km of this location', and what kind of index is needed instead?",
  },
  {
    id: "database-audit-logging-design",
    category: "database",
    topic: "Security",
    title: "Designing an Audit Log: Who Changed What, and When",
    difficulty: "Intermediate",
    summary:
      "An audit log records who made a change, what changed, and when — separately from application logs — and should be append-only and tamper-resistant, since its whole purpose is answering 'what happened' even if the actor was trying to hide it.",
    explanation:
      "Application logs are meant for debugging and operational visibility; an audit log serves a different purpose — a permanent, trustworthy record of significant actions (who deleted this record, who changed this user's role, who accessed this sensitive record) needed for security investigations and compliance requirements. This is commonly implemented as a separate table capturing the actor, the action, the affected entity, a before/after snapshot of changed fields, and a timestamp, populated either by application code at the point of the action or via database triggers that capture changes automatically regardless of which code path caused them. Critically, an audit log should be append-only (no updates or deletes allowed on it, even by administrators, ideally enforced by database permissions) and ideally stored somewhere separate from the primary application database, since its value depends on being trustworthy even if the primary system or an actor with elevated access was compromised or acting maliciously.",
    code: "CREATE TABLE audit_log (\n  id SERIAL PRIMARY KEY,\n  actor_id INT NOT NULL,\n  action VARCHAR(50) NOT NULL,      -- 'user.role_changed', 'invoice.deleted'\n  entity_type VARCHAR(50) NOT NULL,\n  entity_id INT NOT NULL,\n  before_state JSONB,\n  after_state JSONB,\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\n-- Enforce append-only, even against admins\nREVOKE UPDATE, DELETE ON audit_log FROM ALL;\nGRANT INSERT, SELECT ON audit_log TO app_runtime;",
    interviewQuestion:
      "Why should an audit log table have UPDATE and DELETE permissions revoked from literally everyone, including database administrators?",
  },
  {
    id: "database-upsert-operations",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Upserts: Insert-or-Update in One Atomic Operation",
    difficulty: "Intermediate",
    summary:
      "An upsert atomically inserts a row if it doesn't exist or updates it if it does, avoiding the race condition of a naive 'check if exists, then insert or update' pattern where two concurrent requests can both see 'doesn't exist' and both try to insert, causing a duplicate or an error.",
    explanation:
      "A naive approach — query whether a row exists, then either INSERT or UPDATE based on the result — has a race condition under concurrency: two requests can both check simultaneously, both see 'no existing row,' and both attempt to INSERT, causing either a duplicate row (if there's no unique constraint) or an error (if there is). An upsert (Postgres's `INSERT ... ON CONFLICT`, MySQL's `INSERT ... ON DUPLICATE KEY UPDATE`, MongoDB's `updateOne` with `upsert: true`) performs the whole check-and-act as a single atomic database operation, eliminating the race entirely regardless of how many concurrent requests hit it. This is the correct pattern for any 'create or update' operation under concurrent access — like incrementing a view counter, recording a user's latest activity timestamp, or syncing data from an external source where you don't know ahead of time whether a record already exists.",
    code: "-- Postgres upsert: atomic, race-free\nINSERT INTO page_views (page_id, view_count)\nVALUES ($1, 1)\nON CONFLICT (page_id)\nDO UPDATE SET view_count = page_views.view_count + 1;\n\n-- Naive (racy) equivalent — DON'T do this under concurrency:\n-- const existing = await db.query(\"SELECT * FROM page_views WHERE page_id = $1\", [id]);\n-- if (existing) { UPDATE... } else { INSERT... }  // race: two requests can both see \"no row\"",
    interviewQuestion:
      "Why does a 'check if it exists, then insert or update' pattern break under concurrent requests, and how does an upsert fix it?",
  },
  {
    id: "database-bulk-insert-performance",
    category: "database",
    topic: "Performance",
    title: "Bulk Insert Performance: Batching vs Row-by-Row",
    difficulty: "Intermediate",
    summary:
      "Inserting rows one at a time in a loop pays per-statement network round-trip and transaction overhead for every single row; batching many rows into a single multi-row INSERT (or a dedicated bulk-load command) is dramatically faster for large data loads.",
    explanation:
      "Executing a separate INSERT statement for each of 100,000 rows means 100,000 network round trips between the application and the database, each with its own parsing and (if not batched into a transaction) potentially its own commit overhead — this is often the actual bottleneck, not the database's raw insert speed. Combining many rows into a single multi-row INSERT statement, or wrapping many individual inserts inside one transaction (so there's only one commit at the end instead of thousands), removes most of that per-statement overhead and can be an order of magnitude faster. For very large bulk loads (millions of rows), databases offer dedicated bulk-loading mechanisms (Postgres's `COPY`, MySQL's `LOAD DATA INFILE`) that bypass much of the normal per-row processing entirely and are the fastest option by far. The general lesson: when loading substantial amounts of data, always ask whether it can be batched rather than done row-by-row in a loop, since the difference in performance is often not marginal but multiple orders of magnitude.",
    code: "-- Slow: 10,000 separate round trips\nfor (const row of rows) {\n  await db.query(\"INSERT INTO events (type, data) VALUES ($1, $2)\", [row.type, row.data]);\n}\n\n-- Faster: one multi-row INSERT\nconst values = rows.map((r, i) => `($${i*2+1}, $${i*2+2})`).join(\",\");\nconst params = rows.flatMap(r => [r.type, r.data]);\nawait db.query(`INSERT INTO events (type, data) VALUES ${values}`, params);\n\n-- Fastest for huge datasets: dedicated bulk load\nCOPY events (type, data) FROM '/path/to/events.csv' WITH (FORMAT csv);",
    interviewQuestion:
      "Why is inserting 100,000 rows one at a time in a loop dramatically slower than inserting them in batches, even though the database itself can handle the same total data volume quickly?",
  },
  {
    id: "database-cursor-based-result-streaming",
    category: "database",
    topic: "Performance",
    title: "Streaming Large Result Sets with Cursors",
    difficulty: "Advanced",
    summary:
      "Loading a multi-million-row query result entirely into application memory before processing it can exhaust memory; a database cursor streams rows incrementally, processing each one (or small batches) without ever holding the entire result set in memory at once.",
    explanation:
      "A typical query call loads the entire result set into memory before returning it to application code — fine for a few hundred rows, but a query returning millions of rows (a data export, a migration script, a batch processing job) can exhaust application memory entirely if loaded all at once. A cursor keeps the result set on the database side and fetches rows incrementally in small batches as the application asks for more, meaning memory usage stays bounded regardless of how large the total result set is, since only the current batch is ever in memory at once. This is the standard pattern for any operation that needs to process a genuinely large amount of data — exporting a huge table to a file, running a one-time data migration/backfill, or streaming search results — where loading everything into memory upfront simply isn't feasible.",
    code: "// Without a cursor: loads ALL rows into memory at once — can crash on large tables\nconst allRows = await db.query(\"SELECT * FROM events\"); // millions of rows in memory!\n\n// With a cursor: streams rows in bounded batches\nconst cursor = db.query(new Cursor(\"SELECT * FROM events\"));\nlet rows;\nwhile ((rows = await cursor.read(1000)).length > 0) {\n  await processBatch(rows); // only 1000 rows in memory at any moment\n}\nawait cursor.close();",
    interviewQuestion:
      "A data export script that queries a 50-million-row table crashes with an out-of-memory error. What's the likely cause, and how does a database cursor fix it?",
  },
  {
    id: "database-generated-columns",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Generated Columns: Computed Values Maintained by the Database",
    difficulty: "Intermediate",
    summary:
      "A generated column's value is automatically computed from other columns in the same row by the database itself, guaranteeing it's always correct and in sync — unlike maintaining the same computed value in application code, which can drift if any code path forgets to update it.",
    explanation:
      "If a `full_name` value needs to be a combination of `first_name` and `last_name`, or a `total_with_tax` needs to always equal `price * (1 + tax_rate)`, maintaining that computed value manually in application code means every single place that inserts or updates the underlying columns must also remember to recompute and update the derived one — easy to forget in one code path, causing subtly incorrect data. A generated column defines the computation once, at the schema level, and the database automatically keeps it correct on every insert or update, regardless of which application code path caused the change — including migrations, direct database access, or another service entirely. Stored generated columns physically store the computed value (fast to read, uses extra storage, recomputed on write) while virtual/computed generated columns (where supported) compute the value on read instead of storing it, trading storage for a small computation cost per read.",
    code: "-- Generated column: ALWAYS correct, regardless of which code path writes the row\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  price DECIMAL(10,2),\n  tax_rate DECIMAL(4,3),\n  total_with_tax DECIMAL(10,2) GENERATED ALWAYS AS (price * (1 + tax_rate)) STORED\n);\n\nINSERT INTO orders (price, tax_rate) VALUES (100.00, 0.08);\nSELECT total_with_tax FROM orders; -- 108.00, computed automatically, can't drift out of sync",
    interviewQuestion:
      "Why is a database generated column more reliable than computing and storing a derived value in application code every time a row is created or updated?",
  },
  {
    id: "database-capacity-planning",
    category: "database",
    topic: "Database DevOps",
    title: "Database Capacity Planning: Sizing for Growth, Not Just Today",
    difficulty: "Intermediate",
    summary:
      "Capacity planning means projecting future data volume, query load, and connection count based on growth trends, and provisioning (or architecting for elastic scaling) ahead of need — rather than reactively scrambling once the database hits a hard limit under real load.",
    explanation:
      "A database sized for today's traffic can become a production incident within months if data or query volume grows faster than anticipated — running out of disk space, hitting a connection limit, or having query latency degrade as table sizes exceed what indexes and available memory can serve efficiently. Capacity planning involves tracking growth trends (rows per day, storage growth rate, peak concurrent connections, query throughput) and projecting forward to know when current infrastructure will become insufficient, ideally with enough lead time to act deliberately (add read replicas, increase instance size, implement sharding, add caching) rather than reactively during an active incident when working under pressure. Setting proactive alerts on leading indicators — disk usage trending toward a threshold, connection pool utilization climbing, query latency percentiles creeping up — turns capacity planning from a guessing game into a data-driven, scheduled activity rather than a fire drill.",
    code: "-- Track growth trends to project when you'll hit limits\nSELECT\n  date_trunc('month', created_at) AS month,\n  COUNT(*) AS rows_added,\n  pg_size_pretty(pg_total_relation_size('orders')) AS current_table_size\nFROM orders\nGROUP BY month\nORDER BY month;\n\n-- Alert BEFORE hitting a hard limit, not after\n-- e.g. alert when disk usage > 70%, or connection pool utilization > 80% sustained",
    interviewQuestion:
      "Why is reactive database scaling (waiting until you hit a limit) riskier than proactive capacity planning, even if both eventually result in the same infrastructure changes?",
  },
  {
    id: "database-hot-cold-data-tiering",
    category: "database",
    topic: "Database DevOps",
    title: "Hot/Cold Data Tiering and Archiving",
    difficulty: "Advanced",
    summary:
      "Most queries touch recent ('hot') data far more often than old ('cold') data — tiering moves old, rarely-accessed data to cheaper, slower storage (or a separate archive table/database), keeping the primary database smaller, faster, and cheaper without deleting historical data outright.",
    explanation:
      "A table that accumulates data indefinitely (logs, historical orders, old sessions) eventually holds mostly data nobody queries regularly, but that data still consumes storage, bloats indexes, and slows down maintenance operations (backups, vacuum, index rebuilds) on the primary database, even though the vast majority of real query traffic only ever touches the last few weeks or months of data. Tiering addresses this by moving old data out of the primary hot-path table into cheaper storage — a separate archive table, a different (cheaper, slower) storage tier, or a data warehouse — accessible when genuinely needed (compliance requests, historical analysis) but no longer part of the primary database's working set. This keeps indexes smaller and more effective (since they cover less data), backups faster, and costs lower, without needing to permanently delete historical data that might still have business or legal value. Time-based table partitioning (mentioned in partitioning) pairs naturally with this — old partitions can be moved to cold storage or dropped entirely once a retention period expires, without touching current data.",
    code: "-- Move orders older than 2 years to a cheaper archive table\nINSERT INTO orders_archive\nSELECT * FROM orders WHERE created_at < now() - interval '2 years';\n\nDELETE FROM orders WHERE created_at < now() - interval '2 years';\n\n-- Primary 'orders' table stays small and fast — indexes cover only recent, actively-queried data\n-- orders_archive can live on cheaper storage, queried rarely (e.g. compliance requests)",
    interviewQuestion:
      "A table with 5 years of historical data is causing slow backups and degraded query performance, even though 95% of queries only touch the last 3 months. What approach addresses this without deleting historical data?",
  },
  {
    id: "database-redis-distributed-rate-limiting",
    category: "database",
    topic: "Redis Deep Dive",
    title: "Distributed Rate Limiting with Redis",
    difficulty: "Advanced",
    summary:
      "Rate limiting across multiple application server instances needs a shared counter, not one per instance — Redis's atomic INCR/EXPIRE operations make it the standard choice for implementing a rate limit that's consistent regardless of which instance handles a given request.",
    explanation:
      "If each application server instance tracked rate limits in its own local memory, a client could effectively get N times the intended limit by having requests spread across N instances by the load balancer. Redis, being a single shared store all instances can reach, solves this: `INCR` atomically increments a counter and returns the new value in one operation (no race condition even under high concurrency), and setting an expiry on first increment creates a rolling or fixed window automatically. More sophisticated implementations use Redis's sorted sets to implement a true sliding-window log (storing a timestamp per request and counting how many fall within the last N seconds) for more accurate limiting than a simple fixed-window counter allows, at the cost of slightly more memory and computation per check.",
    code: "-- Simple fixed-window rate limit using Redis\nlocal key = \"ratelimit:\" .. user_id\nlocal current = redis.call(\"INCR\", key)\nif current == 1 then\n  redis.call(\"EXPIRE\", key, 60) -- window resets after 60s\nend\nif current > 100 then\n  return \"REJECTED\"\nend\nreturn \"ALLOWED\"\n-- Works identically no matter which of your 10 app server instances handles the request",
    interviewQuestion:
      "Why does implementing rate limiting with each server instance's own local memory break down once you scale to multiple instances behind a load balancer?",
  },
  {
    id: "database-newsql-distributed-sql",
    category: "database",
    topic: "Specialized Databases",
    title: "NewSQL: Distributed SQL Databases",
    difficulty: "Advanced",
    summary:
      "NewSQL databases (CockroachDB, Google Spanner, YugabyteDB) aim to provide traditional SQL and ACID transactions while scaling horizontally across many machines like a NoSQL system — historically you had to choose one or the other.",
    explanation:
      "Traditional relational databases (Postgres, MySQL) scale vertically well and support full ACID transactions with familiar SQL, but scaling writes horizontally across multiple machines while preserving strong consistency is architecturally very hard — which is why sharding a relational database is a manual, application-driven effort. Traditional NoSQL databases scale horizontally more naturally but historically relaxed consistency guarantees (eventual consistency) or transaction scope (no multi-document ACID, or limited support) to make that scaling possible. NewSQL databases specifically target having both: automatic horizontal scaling (data is automatically partitioned and replicated across nodes) AND strong consistency with real multi-row ACID transactions and standard SQL — achieved through more sophisticated distributed consensus protocols (like Raft) under the hood. The tradeoff is operational complexity and typically higher latency per transaction (coordinating consensus across nodes takes time) compared to a single-node database, so they're chosen specifically when an application genuinely needs both horizontal write scale AND strong relational guarantees, which is a narrower need than it might first seem.",
    code: "-- NewSQL (e.g. CockroachDB): looks and feels like Postgres...\nCREATE TABLE accounts (id UUID PRIMARY KEY, balance DECIMAL);\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 'a';\nUPDATE accounts SET balance = balance + 100 WHERE id = 'b';\nCOMMIT;\n-- ...but this transaction might be coordinated across multiple physical\n-- nodes in different data centers automatically, with real ACID guarantees preserved",
    interviewQuestion:
      "What specific gap between traditional relational databases and NoSQL databases are NewSQL databases like CockroachDB trying to close?",
  },
  {
    id: "database-mongodb-schema-versioning",
    category: "database",
    topic: "MongoDB Deep Dive",
    title: "Schema Versioning in a Schema-less Database",
    difficulty: "Advanced",
    summary:
      "MongoDB doesn't enforce a schema, which means old documents created before a schema change don't automatically get the new shape — application code needs to handle multiple document versions gracefully, often via an explicit schemaVersion field.",
    explanation:
      "In a relational database, a migration physically updates every existing row to match a new schema (add a column, backfill a default) as an explicit, atomic step. In MongoDB, since documents don't share an enforced schema, adding a new field to your application's model doesn't retroactively add it to documents already in the collection — old documents simply won't have that field until they're next written. Application code reading documents needs to handle this gracefully (`doc.newField ?? defaultValue`), and for larger changes, an explicit `schemaVersion` field lets code detect which shape a given document is and migrate it on read (lazy migration) or via a one-time background job that walks the whole collection and rewrites documents to the new shape. Ignoring this and assuming every document matches your current model is a common source of production bugs when a schema evolves without a deliberate migration plan.",
    code: "// Document from before a schema change — missing the new field entirely\n{ _id: 1, name: \"Alice\", schemaVersion: 1 }\n\n// Reading code must handle both old and new shapes\nfunction getDisplayName(doc) {\n  if (doc.schemaVersion >= 2) return doc.fullName;\n  return doc.name; // old documents only have this field\n}\n\n// Lazy migration on read/write: upgrade a document the next time it's touched\nif (doc.schemaVersion < 2) {\n  await col.updateOne({ _id: doc._id }, { $set: { fullName: doc.name, schemaVersion: 2 }, $unset: { name: \"\" } });\n}",
    interviewQuestion:
      "Why doesn't adding a new field to your application's data model automatically apply to existing MongoDB documents, and what are the two common ways to handle the gap?",
  },
  {
    id: "database-connection-string-security",
    category: "database",
    topic: "Security",
    title: "Database Connection String Security",
    difficulty: "Basic",
    summary:
      "A database connection string typically contains a plaintext username and password — treating it with the same care as any other secret (never committed to git, injected via environment variables, different credentials per environment) is a basic but frequently-skipped security practice.",
    explanation:
      "A connection string like `postgres://admin:SuperSecret123@db.example.com:5432/mydb` embeds real credentials directly in the URL — if this string ends up in a git repository (even in a since-deleted commit, since git history retains it), a public error message, or a client-side environment variable bundled into a frontend build, the database is effectively compromised. Standard practice: connection strings live only in environment variables or a secrets manager, never hardcoded in source files; `.env` files containing real credentials are gitignored, with only a `.env.example` template (no real values) committed; and production, staging, and development use entirely different credentials, so a leaked development database password doesn't expose production data. It's also worth using a database user with only the permissions the application actually needs (least privilege) rather than a full admin account, so even a leaked connection string doesn't grant unlimited access.",
    code: "# NEVER commit this\nDATABASE_URL=postgres://admin:SuperSecret123@prod-db.example.com:5432/mydb\n\n# .gitignore\n.env\n.env.local\n.env.production\n\n# .env.example — committed, shows the shape without real values\nDATABASE_URL=postgres://user:password@host:5432/dbname\n\n# Different real credentials injected per environment at deploy time, never hardcoded\n# (Render/Heroku/Vercel environment variable settings, not source code)",
    interviewQuestion:
      "If a database connection string was accidentally committed to git and later removed in a follow-up commit, is the credential still considered compromised? Why?",
  },
  {
    id: "database-etl-vs-cdc",
    category: "database",
    topic: "Data Warehousing",
    title: "Change Data Capture (CDC) vs Batch ETL",
    difficulty: "Advanced",
    summary:
      "Batch ETL periodically extracts a full or incremental snapshot of data on a schedule; Change Data Capture streams individual row-level changes (inserts/updates/deletes) as they happen, in near real-time, by reading the database's own internal replication log.",
    explanation:
      "A nightly batch ETL job queries the source database for all rows changed since the last run and loads them into a warehouse — simple to reason about, but data is only ever as fresh as the last run, and detecting 'what changed' often requires either a `updated_at` column (which misses deletes) or comparing full snapshots (expensive). Change Data Capture instead taps directly into the database's own internal mechanism for replication (Postgres's logical replication/WAL, MySQL's binlog — the same mechanism MongoDB's change streams use) and receives a continuous stream of every individual change as it happens, including deletes, without needing to poll or compare anything. Tools like Debezium implement CDC by reading these replication logs and publishing changes to a message queue (Kafka), which downstream consumers (a search index, a data warehouse, a cache) subscribe to. CDC provides much fresher data and captures every change type accurately, at the cost of more complex infrastructure than a scheduled batch job.",
    code: "-- Batch ETL: periodic, can miss deletes, freshness = last run time\nSELECT * FROM orders WHERE updated_at > '2026-07-04T00:00:00Z'; -- misses DELETEs entirely!\n\n-- CDC (conceptual, via Debezium reading Postgres's replication log):\n// Every change streamed in near real-time, including deletes\n{ \"op\": \"c\", \"table\": \"orders\", \"after\": { \"id\": 42, \"total\": 99.99 } }  // create\n{ \"op\": \"u\", \"table\": \"orders\", \"before\": {...}, \"after\": {...} }        // update\n{ \"op\": \"d\", \"table\": \"orders\", \"before\": { \"id\": 42 } }                 // delete — CAPTURED",
    interviewQuestion:
      "Why does a batch ETL job based on an updated_at timestamp column completely miss row deletions, and how does Change Data Capture solve that?",
  },
  {
    id: "database-multi-region-replication",
    category: "database",
    topic: "Scaling Databases",
    title: "Multi-Region Database Replication",
    difficulty: "Advanced",
    summary:
      "Replicating a database across geographic regions reduces read latency for distant users and adds disaster-recovery resilience, but writes are fundamentally harder to distribute globally without either sacrificing consistency or accepting real cross-region latency for every write.",
    explanation:
      "Reading data from a replica in the same region as the user is straightforward and hugely beneficial for latency — a user in Asia reading from an Asia-based replica avoids the round trip to a US-based primary entirely. Writes are the hard part: if only one region can accept writes (single-primary), every write from anywhere in the world pays the network latency to reach that primary region, and that region becomes a single point of failure for all writes globally. Allowing multiple regions to accept writes (multi-primary) removes that bottleneck but reopens the distributed consistency problem — two regions could accept conflicting writes to the same record simultaneously, requiring conflict resolution strategies (last-write-wins, application-level merging, or CRDTs for specific data types that merge automatically and losslessly). Most systems either accept single-primary writes with the latency cost, or partition data by region (a user's data lives in their nearest region, sidestepping the conflict problem for their own data at the cost of complexity for cross-region features).",
    code: "-- Single-primary, multi-region reads: simple, but all writes pay latency to reach the primary\n-- Primary (US-East): accepts ALL writes\n-- Replica (EU-West): fast local reads only\n-- Replica (AP-Southeast): fast local reads only\n-- A write from a user in Singapore still has to reach US-East\n\n-- Multi-primary: writes are fast everywhere, but conflicts become possible\n-- US-East and EU-West BOTH accept writes to the same record simultaneously\n-- -> needs a conflict resolution strategy (last-write-wins, CRDTs, etc.)",
    interviewQuestion:
      "Why is scaling database reads across multiple regions straightforward, while scaling writes across multiple regions is fundamentally harder?",
  },
  {
    id: "database-materialized-view-refresh-strategies",
    category: "database",
    topic: "SQL Deep Dive",
    title: "Materialized View Refresh Strategies",
    difficulty: "Advanced",
    summary:
      "A materialized view can be refreshed by fully recomputing it (simple, but expensive at scale), or incrementally updating only the rows affected by recent changes (efficient, but harder to implement correctly) — the right choice depends on how large the underlying data is and how fresh the view needs to be.",
    explanation:
      "A full refresh (`REFRESH MATERIALIZED VIEW`) drops and recomputes the entire view from scratch — simple to reason about and always correct, but becomes prohibitively slow as the underlying tables grow, since it redoes work for rows that haven't changed since the last refresh. Incremental refresh only recomputes the portion of the view affected by rows that changed since the last refresh, which is far more efficient at scale but requires either database-specific support for incremental materialized views (not universally available) or manually tracking which underlying changes affect which view rows and updating just those. Some systems solve this with triggers that update the materialized view's data directly whenever the underlying table changes (an event-driven incremental update), trading write-time overhead for always-fresh, cheap-to-read aggregated data. Choosing between these should be driven by measuring how expensive a full refresh actually is on real data volume — for small views, an occasional full refresh is simplest and perfectly fine.",
    code: "-- Full refresh: simple, correct, but expensive at scale\nREFRESH MATERIALIZED VIEW customer_ltv_cached;\n\n-- Concurrent refresh (Postgres): doesn't block reads while refreshing, still a full recompute\nREFRESH MATERIALIZED VIEW CONCURRENTLY customer_ltv_cached;\n\n-- Incremental update via trigger: only touches what actually changed\nCREATE TRIGGER update_ltv_on_order\nAFTER INSERT ON orders\nFOR EACH ROW EXECUTE FUNCTION increment_customer_ltv(NEW.customer_id, NEW.total);",
    interviewQuestion:
      "Why does a full materialized view refresh become impractical as the underlying table grows to millions of rows, and what's the alternative?",
  },
  {
    id: "database-orm-migrations-tools",
    category: "database",
    topic: "Database DevOps",
    title: "Migration Tools: Alembic, Flyway, and Liquibase",
    difficulty: "Intermediate",
    summary:
      "Migration tools track which schema changes have already been applied to a given database and apply only the new ones in order, giving every environment (dev, staging, production) a reliable, repeatable, version-controlled path to the same schema state.",
    explanation:
      "Without a migration tool, keeping database schemas in sync across developers' machines, staging, and production relies on someone remembering to manually run the right SQL in the right order everywhere — extremely error-prone as a team and timeline grows. Migration tools (Alembic for Python/SQLAlchemy, Flyway and Liquibase for Java-adjacent stacks, but usable from any language) solve this by keeping a table in the database itself tracking which migrations have already run; each migration is a versioned, ordered script (or auto-generated diff) that the tool applies exactly once, in sequence, catching up any environment to the latest schema regardless of where it started. This makes schema changes reviewable in pull requests just like application code, reproducible identically across every environment, and (with proper down-migrations) reversible if a change needs to be rolled back. Skipping this in favor of manual schema changes is one of the most common sources of 'works on my machine but not in staging' bugs.",
    code: "# Alembic migration file (auto-generated diff, then reviewed/edited)\ndef upgrade():\n    op.add_column('users', sa.Column('phone_verified', sa.Boolean(), nullable=True))\n\ndef downgrade():\n    op.drop_column('users', 'phone_verified')\n\n# Applying migrations catches ANY environment up to the latest schema\nalembic upgrade head\n\n# Alembic tracks what's already applied in its own table\nSELECT * FROM alembic_version; -- one row: the current migration version",
    interviewQuestion:
      "Without a migration tool, what specifically goes wrong when three developers each make different schema changes locally and then try to deploy to a shared staging environment?",
  },
  {
    id: "database-soft-delete-unique-constraint-pattern",
    category: "database",
    topic: "Schema Design",
    title: "Partial Unique Indexes: Uniqueness That Ignores Soft-Deleted Rows",
    difficulty: "Advanced",
    summary:
      "A normal unique constraint on email would block creating a new account with the same email as a soft-deleted one — a partial (filtered) unique index scopes the uniqueness rule to only active rows, letting a deleted email be reused while still preventing duplicates among real, active users.",
    explanation:
      "Once a table supports soft deletes, a plain `UNIQUE` constraint on `email` becomes a problem: if a user 'deletes' their account (setting `deleted_at`) and someone else later tries to sign up with that same email, the database rejects it — the constraint doesn't know or care that the earlier row is logically gone, because it still physically exists in the table. A partial unique index (Postgres calls it a partial index; other databases have similar filtered index features) adds a `WHERE` condition to the constraint itself, so uniqueness is only enforced among rows matching that condition — typically `WHERE deleted_at IS NULL`, meaning only currently-active rows need distinct emails, while soft-deleted rows are excluded from the uniqueness check entirely. This is the correct, database-enforced fix for exactly the soft-delete-plus-uniqueness problem, rather than trying to handle it manually in application code (which is exactly the kind of check-then-insert race condition an upsert or constraint is meant to avoid).",
    code: "-- Plain unique constraint: blocks reusing an email even from a soft-deleted account\nALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email); -- WRONG for soft deletes\n\n-- Partial unique index: only active (non-deleted) rows need distinct emails\nCREATE UNIQUE INDEX users_email_active_unique\nON users (email)\nWHERE deleted_at IS NULL;\n\n-- Now this works correctly:\n-- 1. alice@test.com signs up, then deletes their account (deleted_at set)\n-- 2. A NEW person signs up with alice@test.com — succeeds, since the old row is excluded",
    interviewQuestion:
      "After adding soft deletes to a users table, new signups with a previously-used (but now soft-deleted) email start failing. What's the root cause and the correct fix?",
  },
  {
    id: "database-database-per-tenant-vs-shared",
    category: "database",
    topic: "Scaling Databases",
    title: "Database-per-Tenant: When Full Isolation Is Worth the Cost",
    difficulty: "Advanced",
    summary:
      "Giving each tenant their own entirely separate database instance provides the strongest possible isolation and the simplest per-tenant operations (backup, restore, data residency, deletion) — but multiplies operational overhead linearly with tenant count, making it a choice for specific needs, not a default.",
    explanation:
      "A dedicated database per tenant means a bug or a misconfigured query literally cannot leak data across tenants, since there's no shared storage layer at all to leak across — a categorically stronger guarantee than row-level security or schema-per-tenant. It also makes tenant-specific operations trivial: exporting a specific tenant's complete data for a compliance request is 'back up this one database,' permanently deleting a tenant (right-to-be-forgotten style requests) is 'drop this one database,' and hosting a specific tenant's data in a specific geographic region for data residency requirements is just choosing where that one database physically lives. The cost is real: connection pooling, migrations, monitoring, and backups all need to happen per-database instead of once, and this overhead scales linearly (sometimes worse) with tenant count — workable for tens or low hundreds of large enterprise tenants each paying significant revenue, but impractical for a consumer product with hundreds of thousands of small tenants. This is why database-per-tenant is typically reserved for B2B products with a smaller number of high-value tenants who specifically need or pay for that isolation guarantee, not a default architecture.",
    code: "-- Database-per-tenant: complete isolation, but N databases to manage\n-- tenant_acme.db      (Acme Corp's entire data, isolated)\n-- tenant_globex.db     (Globex Corp's entire data, isolated)\n-- tenant_initech.db    (Initech's entire data, isolated)\n\n-- Compliance deletion request for Globex: just drop their database entirely\nDROP DATABASE tenant_globex;\n-- No risk of accidentally leaving behind or accidentally deleting another tenant's rows",
    interviewQuestion:
      "For which kind of product does database-per-tenant make sense, and for which kind does it become impractical — and why does tenant count matter so much to that answer?",
  },
];
