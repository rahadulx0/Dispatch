---
title: "Database Fundamentals for Junior Software Developers"
description: "A comprehensive guide to database concepts, SQL, NoSQL, database design, and practical interview questions for Junior Software Developers."
tags: ["Database", "SQL", "NoSQL"]
---

## Core Database Concepts

**Q1. What is a database?**

**A:** A database is an organized collection of structured data, stored and accessed electronically.  It provides a way to store, retrieve, modify, and delete data efficiently.  Crucially, it provides *persistence* – data survives even when the application using it closes.

**Q2. What is a Database Management System (DBMS)?**

**A:** A DBMS is the software that allows you to interact with a database. It provides an interface for creating, managing, querying, updating, and controlling access to databases.  Examples include MySQL, PostgreSQL, Microsoft SQL Server (MSSQL), Oracle Database (RDBMS), MongoDB, Cassandra (NoSQL).

**Q3. Why are databases important for software applications?**

**A:** Databases are essential because they provide:

*   **Data Persistence:** Storing data reliably for the long term.
*   **Data Integrity:** Ensuring data is accurate, consistent, and valid through constraints and rules.
*   **Data Security:** Protecting sensitive data from unauthorized access through authentication, authorization, and encryption.
*   **Data Scalability:** Handling increasing amounts of data and user traffic efficiently.
*   **Data Concurrency:** Allowing multiple users and applications to access and modify data simultaneously without conflicts.
*   **Data Retrieval Efficiency:**  Optimized methods for rapidly searching and retrieving specific data.
*   **Data Relationships:** Defining connections between related data elements.

**Q4. What is the difference between Relational and Non-Relational (NoSQL) databases?**

**A:**

| Feature           | Relational (SQL)                                 | Non-Relational (NoSQL)                                  |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------- |
| Data Model        | Tables with rows and columns, defined schema       | Documents, key-value pairs, graphs, columnar, etc.      |
| Schema            | Strict, predefined schema                         | Flexible, dynamic, or schema-less                       |
| Scalability       | Primarily vertical (scaling up server resources)    | Primarily horizontal (adding more servers)             |
| Data Consistency | Strong consistency (ACID properties)            | Eventual consistency (BASE properties), but can vary |
| Query Language    | SQL (Structured Query Language)                    | Varies (e.g., MongoDB Query Language, GraphQL)          |
| Use Cases         | Transaction-heavy applications, structured data, reporting, complex joins    | Unstructured or semi-structured data, high-volume, agile development, real-time applications. |
| Examples         | MySQL, PostgreSQL, SQL Server, Oracle            | MongoDB, Cassandra, Redis, DynamoDB, Neo4j               |

**Q5. Explain ACID properties in the context of database transactions.**

**A:** ACID stands for:

*   **Atomicity:**  A transaction is treated as a single, indivisible unit of work.  Either all changes within the transaction are applied, or none are. If any part of the transaction fails, the entire transaction is rolled back.
*   **Consistency:** A transaction must maintain the integrity of the database.  It moves the database from one valid state to another.  Constraints and rules are enforced.
*   **Isolation:**  Concurrent transactions must be isolated from each other.  One transaction should not interfere with or see the intermediate changes of another transaction.  Isolation levels control the degree of isolation.
*   **Durability:** Once a transaction is committed, its changes are permanent and will survive even system failures (e.g., power outage). Data is written to persistent storage.

**Q6. What are the CAP Theorem and BASE properties, and how do they relate to NoSQL databases?**

**A:**

*   **CAP Theorem:**  States that it's impossible for a distributed system to simultaneously guarantee all three of the following:
    *   **Consistency:** All nodes see the same data at the same time.
    *   **Availability:** Every request receives a response, without guarantee that it contains the most recent version of the information.
    *   **Partition Tolerance:** The system continues to operate despite network partitions (nodes being unable to communicate with each other).
    *   CAP theorem implies you can only pick 2 out of 3 in a distributed system.
*   **BASE Properties:** Represents a different approach to data consistency, often adopted by NoSQL databases:
    *   **Basically Available:** The system guarantees availability of data.
    *   **Soft State:** The state of the system may change over time, even without any input.
    *   **Eventually Consistent:** The system will eventually become consistent, given no new updates.

NoSQL databases often prioritize Availability and Partition Tolerance (AP) or Consistency and Partition Tolerance (CP) over strong consistency, thus adhering to the CAP theorem. They use BASE properties to manage data in a distributed environment.

**Q7. When would you choose a Relational database over a NoSQL database, and vice versa?**

**A:**

*   **Relational:**
    *   When you need strong data consistency and ACID properties.
    *   When your data is highly structured and requires complex relationships.
    *   When you need to perform complex joins and aggregations.
    *   When your application requires transactional integrity (e.g., financial systems).
*   **NoSQL:**
    *   When you need to handle large volumes of unstructured or semi-structured data.
    *   When you need high scalability and availability.
    *   When you need to support rapid development and frequent schema changes.
    *   When your application is read-heavy (e.g., social media, content management).
    *   When eventual consistency is acceptable.

## SQL (Structured Query Language)

**Q8. What is SQL?**

**A:** SQL (Structured Query Language) is the standard language for interacting with relational databases. It's used for creating, querying, updating, and managing data and database structures.

**Q9. List common SQL commands and their functions.**

**A:**

*   **SELECT:** Retrieves data from one or more tables.
*   **INSERT:** Adds new data into a table.
*   **UPDATE:** Modifies existing data in a table.
*   **DELETE:** Removes data from a table.
*   **CREATE TABLE:** Creates a new table in the database.
*   **ALTER TABLE:** Modifies the structure of an existing table (e.g., add/remove columns, change data types).
*   **DROP TABLE:** Removes a table from the database.
*   **CREATE INDEX:** Creates an index to improve query performance.
*   **DROP INDEX:** Removes an index.
*   **WHERE:** Filters data based on specified conditions.
*   **JOIN:** Combines data from multiple tables based on a related column.
*   **GROUP BY:** Groups rows based on specific columns for aggregation.
*   **ORDER BY:** Sorts the result set based on specific columns.
*   **HAVING:** Filters groups created by the GROUP BY clause.
*   **LIMIT:** Restricts the number of rows returned by a query.

**Q10. Give examples of basic SQL queries:**

**A:**

*   **SELECT:** `SELECT name, email FROM users WHERE age > 25;` (Retrieves the names and email addresses of users who are over 25 years old).
*   **INSERT:** `INSERT INTO users (name, email, age) VALUES ('John Doe', 'john.doe@example.com', 30);` (Inserts a new user record).
*   **UPDATE:** `UPDATE users SET age = 31 WHERE email = 'john.doe@example.com';` (Updates the age of a user).
*   **DELETE:** `DELETE FROM users WHERE id = 123;` (Deletes a user with a specific ID).

**Q11. What are Primary and Foreign Keys?  Explain their purpose.**

**A:**

*   **Primary Key:** A column (or a set of columns) in a table that uniquely identifies each row.
    *   It must have a unique value for each record.
    *   It cannot contain NULL values.
    *   There can be only one primary key per table.
    *   *Purpose:* Ensures each record in a table is uniquely identifiable.

*   **Foreign Key:** A column (or a set of columns) in one table that references the primary key in *another* table.
    *   It establishes a link/relationship between two tables.
    *   It can contain NULL values (unless specifically constrained).
    *   A table can have multiple foreign keys.
    *   *Purpose:* Enforces referential integrity – ensuring that relationships between tables are valid.

**Q12. What is a JOIN operation in SQL? Explain different JOIN types with examples.**

**A:** A JOIN operation combines rows from two or more tables based on a related column between them.

*   **INNER JOIN:** Returns only rows where there is a match in *both* tables.

    ```sql
    SELECT orders.order_id, customers.customer_name
    FROM orders
    INNER JOIN customers ON orders.customer_id = customers.customer_id;
    ```
    (Returns order IDs and customer names for orders that have a matching customer ID in the customers table).

*   **LEFT JOIN (or LEFT OUTER JOIN):** Returns all rows from the *left* table, and matching rows from the *right* table. If no match exists, it returns NULL values for columns from the right table.

    ```sql
    SELECT customers.customer_name, orders.order_id
    FROM customers
    LEFT JOIN orders ON customers.customer_id = orders.customer_id;
    ```
    (Returns all customer names, and their associated order IDs if they exist. Customers without orders will have a NULL order_id).

*   **RIGHT JOIN (or RIGHT OUTER JOIN):** Returns all rows from the *right* table, and matching rows from the *left* table. If no match exists, it returns NULL values for columns from the left table. (Less commonly used than LEFT JOIN).

    ```sql
    SELECT customers.customer_name, orders.order_id
    FROM customers
    RIGHT JOIN orders ON customers.customer_id = orders.customer_id;
    ```

*   **FULL OUTER JOIN:** Returns all rows from *both* tables. If no match is found, NULL values are returned for columns from the missing table.  (Not supported in all database systems).

    ```sql
    SELECT customers.customer_name, orders.order_id
    FROM customers
    FULL OUTER JOIN orders ON customers.customer_id = orders.customer_id;
    ```

*   **CROSS JOIN:** Returns the Cartesian product of the tables.  Every row from the first table is combined with every row from the second table.  Generally avoided unless you have a *very* specific reason to use it.

    ```sql
    SELECT customers.customer_name, products.product_name
    FROM customers
    CROSS JOIN products;
    ```

**Q13. What is the difference between WHERE and HAVING clauses?**

**A:**

*   **WHERE:** Filters rows *before* grouping (before the `GROUP BY` clause is applied). It operates on individual rows.
*   **HAVING:** Filters groups *after* grouping (after the `GROUP BY` clause is applied). It operates on aggregated results.

    ```sql
    SELECT department, AVG(salary) AS average_salary
    FROM employees
    WHERE age > 25  -- Filters employees older than 25 BEFORE grouping
    GROUP BY department
    HAVING AVG(salary) > 60000; -- Filters departments where the average salary is greater than 60000
    ```

**Q14. Explain the purpose of indexes in SQL. How do they improve performance?**

**A:** An index is a data structure that improves the speed of data retrieval in a database table. It's similar to an index in a book. Instead of scanning the entire table (a full table scan), the database can use the index to quickly locate the rows that match a query's `WHERE` clause.

*   *How they improve performance:* Indexes allow the database to quickly jump to the relevant rows, significantly reducing the amount of data it needs to read.  This is especially beneficial for large tables.

*   *Trade-offs:* Indexes consume storage space, and they can slow down `INSERT`, `UPDATE`, and `DELETE` operations because the index needs to be updated as well. Therefore, it's important to create indexes strategically on columns that are frequently used in `WHERE` clauses.

**Q15. What are different types of SQL indexes?**

**A:**

*   **Clustered Index:** Determines the physical order of data in a table. A table can have only one clustered index. Usually the Primary Key is a clustered index.
*   **Non-Clustered Index:**  A separate data structure that stores a pointer to the actual data rows. A table can have multiple non-clustered indexes.
*   **Composite Index:** An index created on multiple columns.
*   **Unique Index:** Ensures that the indexed column(s) contain unique values.

**Q16. What are subqueries in SQL? Give an example.**

**A:** A subquery (or inner query) is a query nested inside another SQL query.  It's used to retrieve data that will be used in the main query.

```sql
SELECT product_name
FROM products
WHERE price > (SELECT AVG(price) FROM products);  --Subquery to find average price
```

(This query selects the names of products whose price is greater than the average price of all products).

**Q17. What is a stored procedure? What are the benefits of using stored procedures?**

**A:** A stored procedure is a precompiled set of SQL statements stored within the database. It's like a function in a programming language.

*   *Benefits:*
    *   **Improved Performance:**  Precompiled and stored in the database, reducing parsing and compilation overhead.
    *   **Enhanced Security:**  Can grant permissions to execute the procedure without granting direct access to the underlying tables.
    *   **Reduced Network Traffic:**  Only the procedure call needs to be sent over the network, not the entire SQL code.
    *   **Code Reusability:**  Stored procedures can be called from multiple applications.
    *   **Data Integrity:** Can enforce data validation rules within the procedure.

**Q18. What is a view in SQL?**

**A:** A view is a virtual table based on the result set of a SQL query. It doesn't store data physically; instead, it stores the query definition. Views provide a simplified and customized view of the underlying data.

**Q19. What is a transaction in SQL?**

**A:** A transaction is a sequence of one or more SQL operations that are treated as a single unit of work.  Either all operations succeed, or none do (rollback). Transactions are essential for maintaining data integrity.

**Q20. Explain different isolation levels in SQL transactions.**

**A:** Isolation levels control the degree to which concurrent transactions are isolated from each other. Higher isolation levels provide more protection but can also reduce concurrency. Common isolation levels include:

*   **Read Uncommitted:** The lowest level. A transaction can read uncommitted changes made by other transactions.  This can lead to *dirty reads*.
*   **Read Committed:** A transaction can only read committed changes made by other transactions. Prevents dirty reads but can still lead to *non-repeatable reads*.
*   **Repeatable Read:** A transaction can read the same data multiple times and get the same results, even if other transactions modify the data in between. Prevents dirty reads and non-repeatable reads but can still lead to *phantom reads*.
*   **Serializable:** The highest level. Transactions are completely isolated from each other, as if they were executed serially. Prevents dirty reads, non-repeatable reads, and phantom reads, but it can significantly reduce concurrency.

## Database Design & Modeling

**Q21. What is database normalization? Why is it important?**

**A:** Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing databases into tables and defining relationships between them according to specific rules (normal forms).

*   *Importance:*
    *   **Reduces Data Redundancy:** Minimizes duplicate data, saving storage space.
    *   **Improves Data Integrity:** Ensures data consistency by avoiding inconsistencies due to duplicate entries.
    *   **Facilitates Data Modification:** Makes it easier to update and manage data efficiently.
    *   **Improves Query Performance:** Leads to faster query execution by retrieving data from smaller and more organized tables.

**Q22. Briefly describe the first three normal forms (1NF, 2NF, 3NF).**

**A:**

*   **1NF (First Normal Form):** Eliminates repeating groups of data by creating separate tables for each set of related attributes and using a primary key to identify the rows.  Each column should contain only atomic (indivisible) values.
*   **2NF (Second Normal Form):** Must be in 1NF and eliminates redundant data that depends only on *part* of a primary key. This is only relevant if the primary key is a composite key (multiple columns). It requires creating separate tables for sets of values that apply to multiple records.
*   **3NF (Third Normal Form):** Must be in 2NF and eliminates columns that are *not* dependent on the primary key but are dependent on another *non-primary key* attribute. This eliminates transitive dependencies.

**Q23. What is an Entity-Relationship Diagram (ERD)? What are the key components of an ERD?**

**A:** An Entity-Relationship Diagram (ERD) is a visual representation of a database's structure. It shows the entities (tables), attributes (columns), and relationships between them. It is used to model and design databases before implementation.

*   *Key Components:*
    *   **Entities:** Represented by rectangles.  An entity is a real-world object or concept about which you want to store information (e.g., Customer, Product, Order).
    *   **Attributes:** Represented by ovals. An attribute is a characteristic or property of an entity (e.g., Customer Name, Product Price, Order Date).
    *   **Relationships:** Represented by diamonds or lines with symbols indicating cardinality. A relationship defines how entities are related to each other (e.g., a Customer *places* an Order).
    *   **Cardinality:** Specifies the number of instances of one entity that can be related to another entity (e.g., one-to-one, one-to-many, many-to-many).

**Q24. What are the common types of relationships between tables in database design? Give examples.**

**A:**

*   **One-to-One:** One record in table A is associated with *at most one* record in table B, and vice-versa.  (Example: A person has one passport, and a passport belongs to one person).

*   **One-to-Many:** One record in table A is associated with *multiple* records in table B. (Example: A customer can place multiple orders, but each order belongs to only one customer).

*   **Many-to-Many:** Multiple records in table A are associated with multiple records in table B. This is typically resolved using an intermediate table (a junction table or linking table). (Example: A student can enroll in multiple courses, and a course can have multiple students.  A linking table called `StudentCourses` would store the relationships).

**Q25. How would you handle a many-to-many relationship in a relational database?**

**A:** Create a junction table (also called a linking table or associative entity). This table contains foreign keys referencing the primary keys of the two tables involved in the many-to-many relationship. The primary key of the junction table is typically a composite key consisting of the foreign keys.

**Example:**

*   `Students` table (StudentID, Name, ...)
*   `Courses` table (CourseID, Title, ...)
*   `StudentCourses` table (StudentID, CourseID)  - This is the junction table.  Its primary key is (StudentID, CourseID).

**Q26. What are the considerations when designing a database schema for scalability?**

**A:**

*   **Normalization:**  Proper normalization reduces redundancy and improves data integrity, but over-normalization can lead to complex joins that impact performance.  Strike a balance.
*   **Indexing:**  Use indexes strategically to improve query performance, but be mindful of the overhead on write operations.
*   **Partitioning/Sharding:** Divide large tables into smaller, more manageable pieces (partitions or shards). This can improve query performance and allow for horizontal scaling.
*   **Caching:**  Implement caching mechanisms to store frequently accessed data in memory.
*   **Read Replicas:**  Create read-only replicas of the database to handle read traffic, reducing the load on the primary database.
*   **Data Types:**  Choose appropriate data types to minimize storage space.
*   **Connection Pooling:**  Use connection pooling to reuse database connections, reducing the overhead of establishing new connections.
*   **Consider NoSQL:** If the relational model becomes a bottleneck, consider using a NoSQL database for certain parts of the application.

## NoSQL Databases in Detail

**Q27. What are the different types of NoSQL databases? Explain with examples.**

**A:**

*   **Key-Value Stores:** Data is stored as key-value pairs.  Simple and fast for retrieval.  (Examples: Redis, Memcached). *Use Case:* Caching, session management.
*   **Document Databases:** Data is stored as JSON-like documents. Flexible schema. (Examples: MongoDB, Couchbase). *Use Case:* Content management, catalogs, user profiles.
*   **Column-Family Stores:** Data is organized into columns within column families. Highly scalable and efficient for read-heavy workloads. (Examples: Cassandra, HBase). *Use Case:* Time-series data, sensor data, analytics.
*   **Graph Databases:** Data is stored as nodes and edges, representing relationships between data points.  (Examples: Neo4j, JanusGraph). *Use Case:* Social networks, recommendation engines, fraud detection.

**Q28. What are the advantages and disadvantages of document databases?**

**A:**

*   **Advantages:**
    *   **Flexible Schema:**  Documents can have different structures within the same collection.
    *   **Easy to Evolve:**  Schema changes can be made easily without disrupting the entire database.
    *   **Good for Semi-Structured Data:**  Well-suited for data that doesn't fit neatly into tables.
    *   **Developer-Friendly:**  JSON-like document format is easy to work with.
*   **Disadvantages:**
    *   **Lack of Transactions:**  ACID properties are not always fully supported.
    *   **Data Redundancy:**  Data may be duplicated across multiple documents.
    *   **Complex Queries:**  Performing joins across collections can be less efficient than in relational databases.

**Q29. Explain the use cases for graph databases.**

**A:**

*   **Social Networks:** Modeling relationships between users, posts, and groups.
*   **Recommendation Engines:** Recommending products or content based on user preferences and connections.
*   **Fraud Detection:** Identifying fraudulent activities by analyzing patterns of relationships.
*   **Knowledge Graphs:** Storing and querying knowledge from various sources.
*   **Identity and Access Management:** Managing user identities and access privileges.

**Q30. How does eventual consistency work in NoSQL databases?**

**A:** Eventual consistency means that after a data update, it may take some time for all nodes in the distributed database to reflect the change.  During this time, different clients may see different versions of the data.  Eventually, all nodes will converge to the same, consistent state.

*   *Mechanisms:*
    *   **Replication:** Data is replicated across multiple nodes.
    *   **Gossip Protocol:** Nodes exchange information about data updates with each other.
    *   **Conflict Resolution:** Mechanisms to handle conflicting updates (e.g., last-write-wins).

## Practical Junior Developer Questions

**Q31. As a junior engineer, how would you approach creating a database schema for a new application? Walk me through your process.**

**A:**

1.  **Requirements Gathering:** Start by thoroughly understanding the application's requirements. What data needs to be stored? What are the relationships between different data elements? Talk to stakeholders and the development team to get a clear picture.
2.  **Entity Identification:** Identify the key entities (objects) that need to be represented in the database. Examples: Users, Products, Orders, Articles.
3.  **Attribute Definition:** For each entity, define the attributes (properties) that need to be stored. Determine appropriate data types for each attribute (e.g., string, integer, date, boolean).
4.  **Relationship Establishment:** Determine how the entities are related to each other. Identify one-to-one, one-to-many, and many-to-many relationships.
5.  **Normalization (for Relational Databases):** Apply normalization principles (1NF, 2NF, 3NF) to reduce redundancy and improve data integrity. This might involve breaking down tables into smaller, more manageable pieces.
6.  **ERD Creation (Optional but Recommended):** Create an Entity-Relationship Diagram (ERD) to visually represent the database schema. This helps to communicate the design to others and identify potential issues.
7.  **Data Type Selection:** Choosing the best data types for each column (e.g. INTEGER, VARCHAR, TEXT, DATE, BOOLEAN). Consider storage space and the operations that will be performed on the data.
8.  **Primary and Foreign Key Definition:** Define primary keys for each table to uniquely identify records. Establish foreign keys to enforce relationships between tables.
9.  **Indexing Strategy:** Plan out the indexes that will be needed for performant query operations.
10. **Technology Choice:** Choose the database technology that best suits the application's needs (Relational vs. NoSQL).
11. **Schema Implementation:** Create the database schema using SQL DDL (Data Definition Language) statements (e.g., `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`).
12. **Testing and Refinement:** Test the schema with sample data and queries. Refine the design as needed based on performance and usability.

**Q32. What is your role related to the database as a junior engineer? What tasks might you be assigned?**

**A:** My role as a junior engineer related to the database might involve:

*   **Writing SQL Queries:** Crafting SQL queries to retrieve, insert, update, and delete data. This includes writing `SELECT` statements with `WHERE` clauses, `JOIN` operations, and aggregate functions.
*   **Data Modeling Assistance:** Assisting senior engineers in designing database schemas. This could involve contributing to ERDs or implementing schemas in SQL.
*   **Database Testing:** Performing database testing to ensure that the database is functioning correctly. This includes testing data integrity, query performance, and security.
*   **Data Analysis and Reporting:** Using SQL queries to analyze data and generate reports.
*   **Database Troubleshooting:** Investigating and resolving database-related issues.
*   **Code Review:** Participating in code reviews to ensure that SQL code is efficient, secure, and follows best practices.
*   **Documentation:** Documenting database schemas, queries, and procedures.
*   **Learning and Mentorship:**  Continuously learning about database technologies and best practices, and seeking mentorship from senior engineers.

**Q33. How would you ensure that your SQL code is efficient and performs well?**

**A:** I would focus on these key areas:

*   **Specific Columns:** Instead of using `SELECT *`, specify the exact columns needed to reduce the amount of data transferred.
*   **Filtering with WHERE:** Use the `WHERE` clause to filter records as early as possible in the query to minimize the amount of data processed.
*   **Appropriate Joins:** Use the correct type of `JOIN` (INNER, LEFT, RIGHT) for the desired result set. Avoid `CROSS JOIN` unless absolutely necessary.
*   **Indexes:** Ensure that appropriate indexes are in place on columns used in `WHERE` clauses and `JOIN` conditions.
*   **Avoiding `LIKE` with Leading Wildcards:** Avoid using the `LIKE` operator with a leading wildcard (`%`) because it prevents the database from using indexes.
*   **Using `EXPLAIN`:** Use the `EXPLAIN` statement (or equivalent in your DBMS) to analyze the query execution plan and identify potential bottlenecks.
*   **Query Optimization Tools:** Use database-specific query optimization tools to identify slow-running queries and get recommendations for improvement.
*   **Batching Operations:** When performing bulk updates or inserts, use batching to reduce the number of round trips to the database.
*   **Connection Pooling:** Use connection pooling to reuse database connections and reduce the overhead of establishing new connections.
*   **Testing and Monitoring:** Test queries with realistic data volumes and monitor database performance to identify and address issues proactively.
*   **Stay Updated:** Keep current on database-specific best practices and performance tuning techniques.

**Q34. How do you approach debugging a slow SQL query?**

**A:** My approach would be:

1.  **Identify the Slow Query:** Use database monitoring tools or logs to identify queries that are taking longer than expected.
2.  **Use `EXPLAIN`:** Use the `EXPLAIN` statement (or the equivalent in your DBMS) to understand the query execution plan. This will show how the database is accessing the data and identify potential bottlenecks (e.g., full table scans, missing indexes).
3.  **Check Indexes:** Verify that appropriate indexes are in place on the columns used in the `WHERE` clause, `JOIN` conditions, and `ORDER BY` clause.
4.  **Analyze Table Statistics:** Ensure that the database has up-to-date statistics about the data in the tables. This helps the query optimizer make better decisions.
5.  **Simplify the Query:** Try simplifying the query by removing unnecessary `JOIN`s, `WHERE` conditions, or `ORDER BY` clauses.
6.  **Test with Different Data Sets:** Test the query with different data sets to see if the performance varies.
7.  **Consult Documentation:** Consult the database documentation for specific performance tuning recommendations.
8.  **Seek Assistance:** If I'm unable to resolve the issue on my own, I would seek assistance from senior engineers or database administrators.

**Q35. How do you protect a database from SQL injection attacks?**

**A:** SQL injection attacks occur when malicious SQL code is inserted into an application's input fields, potentially allowing attackers to bypass security measures and access sensitive data.

*   **Parameterized Queries (Prepared Statements):** Use parameterized queries or prepared statements. This separates the SQL code from the data, preventing the data from being interpreted as code.  This is the *most important* defense.
*   **Input Validation:** Validate all user inputs to ensure that they conform to the expected format and length.
*   **Escaping User Input:** Escape special characters in user input to prevent them from being interpreted as SQL code.
*   **Principle of Least Privilege:** Grant database users only the minimum privileges required to perform their tasks.
*   **Web Application Firewall (WAF):** Use a WAF to detect and block SQL injection attacks.
*   **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.
*   **Keep Software Up-to-Date:** Keep the database server and web application software up-to-date with the latest security patches.

**Q36. What are some common database performance bottlenecks you might encounter and how would you address them?**

**A:**

*   **Full Table Scans:** Queries that scan the entire table instead of using an index. *Solution:* Add appropriate indexes to the columns used in `WHERE` clauses.
*   **Missing Indexes:** Lack of indexes on frequently queried columns. *Solution:* Create indexes on those columns.
*   **Inefficient Queries:** Poorly written SQL queries that perform unnecessary operations. *Solution:* Rewrite the queries to be more efficient. Use `EXPLAIN` to analyze the query execution plan.
*   **Locking Conflicts:** Concurrent transactions that are competing for the same resources. *Solution:* Optimize transactions to be shorter and less frequent. Use appropriate isolation levels.
*   **Network Latency:** High network latency between the application server and the database server. *Solution:* Move the application server and database server closer together. Use connection pooling.
*   **Hardware Limitations:** Insufficient CPU, memory, or disk I/O. *Solution:* Upgrade the hardware.
*   **Database Configuration Issues:** Improperly configured database settings (e.g., buffer pool size, connection limits). *Solution:* Consult the database documentation and adjust the settings accordingly.
