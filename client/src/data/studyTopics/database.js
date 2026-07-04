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
];
