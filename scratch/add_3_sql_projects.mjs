// scratch/add_3_sql_projects.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const SQL_3_PROJECTS = [
  {
    "id": "sql-proj-1",
    "projectNumber": 1,
    "title": "Project 1: E-Commerce Sales & Customer Lifetime Value (LTV) Analytics",
    "subtitle": "Module 03, 04 & 05 — DML Filtering, Aggregations & Multi-Table JOINS",
    "difficulty": "Beginner to Intermediate",
    "estimatedTime": "1 – 2 Hours",
    "pageLength": "1 – 2 Pages",
    "description": "Write SQL DDL to create customer and order tables, populate real-world transactional test records, and craft analytical JOIN and GROUP BY queries to extract total spending per customer, monthly revenue trends, and top customer segments.",
    "objectives": [
      "Design normalized tables ('customers' and 'orders') with PRIMARY KEY and FOREIGN KEY constraints",
      "Perform multi-table INNER JOINs and LEFT JOINs to correlate client metadata with purchase records",
      "Calculate key business metrics using aggregate functions (SUM, COUNT, AVG, ROUND)",
      "Filter grouped summary data using HAVING clauses to identify high-value VIP shoppers"
    ],
    "requirements": [
      "Create 'customers' (customer_id, full_name, email, city) and 'orders' (order_id, customer_id, order_date, total_amount, status) tables",
      "Insert representative sample records including completed, pending, and cancelled orders",
      "Write SQL query computing total revenue, average order value (AOV), and total orders by status",
      "Write SQL query calculating Customer Lifetime Value (LTV) per customer, ordered by highest spenders"
    ],
    "starterCode": `-- Project 1: E-Commerce Sales & Customer Lifetime Value (LTV) Analytics
-- File: ecommerce_analytics.sql

-- 1. Create Normalized Tables with Referential Integrity
CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(50) NOT NULL,
    joined_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Completed', 'Pending', 'Cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 2. Populate Sample Dataset
INSERT INTO customers (full_name, email, city, joined_date) VALUES
('Arshith Kumar', 'arshith@example.com', 'Bengaluru', '2025-01-10'),
('Bhavana Kolla', 'bhavana@example.com', 'Hyderabad', '2025-02-14'),
('Chandan Verma', 'chandan@example.com', 'Mumbai', '2025-03-01'),
('Divya Sharma', 'divya@example.com', 'Delhi', '2025-03-15');

INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES
(1, '2025-03-20', 4500.00, 'Completed'),
(1, '2025-04-02', 12500.50, 'Completed'),
(2, '2025-03-22', 8900.00, 'Completed'),
(2, '2025-04-05', 3100.00, 'Pending'),
(3, '2025-03-25', 15000.00, 'Completed'),
(3, '2025-04-10', 450.00, 'Cancelled'),
(1, '2025-04-12', 6200.00, 'Completed');

-- 3. Executive Sales Metrics Query (Overall Revenue & AOV)
SELECT 
    COUNT(order_id) AS total_orders,
    SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END) AS total_revenue,
    ROUND(AVG(CASE WHEN status = 'Completed' THEN total_amount END), 2) AS avg_order_value
FROM orders;

-- 4. Customer Lifetime Value (LTV) & VIP Ranking Query
SELECT 
    c.customer_id,
    c.full_name,
    c.city,
    COUNT(o.order_id) AS total_purchases,
    COALESCE(SUM(o.total_amount), 0.00) AS lifetime_value,
    CASE 
        WHEN SUM(o.total_amount) >= 20000 THEN 'VIP Diamond'
        WHEN SUM(o.total_amount) >= 10000 THEN 'Gold Preferred'
        ELSE 'Regular Shopper'
    END AS customer_tier
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'Completed'
GROUP BY c.customer_id, c.full_name, c.city
HAVING SUM(o.total_amount) > 0
ORDER BY lifetime_value DESC;
`,
    "expectedOutput": `+--------------+---------------+-----------------+
| total_orders | total_revenue | avg_order_value |
+--------------+---------------+-----------------+
|            7 |      47100.50 |         9420.10 |
+--------------+---------------+-----------------+

+-------------+---------------+-----------+-----------------+----------------+----------------+
| customer_id | full_name     | city      | total_purchases | lifetime_value | customer_tier  |
+-------------+---------------+-----------+-----------------+----------------+----------------+
|           1 | Arshith Kumar | Bengaluru |               3 |       23200.50 | VIP Diamond    |
|           3 | Chandan Verma | Mumbai    |               1 |       15000.00 | Gold Preferred |
|           2 | Bhavana Kolla | Hyderabad |               1 |        8900.00 | Regular Shopper|
+-------------+---------------+-----------+-----------------+----------------+----------------+`
  },
  {
    "id": "sql-proj-2",
    "projectNumber": 2,
    "title": "Project 2: Corporate Payroll & Department Performance Window Analytics",
    "subtitle": "Module 06 & 07 — Subqueries, Common Table Expressions (CTEs) & Window Functions",
    "difficulty": "Intermediate",
    "estimatedTime": "2 Hours",
    "pageLength": "1 – 2 Pages",
    "description": "Construct advanced analytical SQL queries using Common Table Expressions (WITH clauses) and Window Functions (RANK, DENSE_RANK, AVG OVER) to compute department salary rankings, compare individual pay against department averages, and identify top earners per department.",
    "objectives": [
      "Formulate structured WITH CTE queries to isolate modular aggregation stages",
      "Apply Window Functions OVER (PARTITION BY ... ORDER BY ...) for analytical ranking",
      "Calculate deviation percentages comparing employee salary against department mean",
      "Retrieve department top earners without relying on correlated subqueries"
    ],
    "requirements": [
      "Create 'departments' (dept_id, dept_name) and 'employees' (emp_id, emp_name, dept_id, salary, hire_date) tables",
      "Insert departmental payroll dataset spanning multiple engineering and marketing roles",
      "Write a CTE query with RANK() OVER to rank employees within their department by salary",
      "Write a query returning employees earning 15%+ above their department's average salary"
    ],
    "starterCode": `-- Project 2: Corporate Payroll & Department Window Analytics
-- File: department_analytics.sql

-- 1. Create Schema
CREATE TABLE IF NOT EXISTS departments (
    dept_id INTEGER PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    emp_id INTEGER PRIMARY KEY,
    emp_name VARCHAR(100) NOT NULL,
    dept_id INTEGER NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    hire_date DATE NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 2. Insert Test Data
INSERT INTO departments VALUES (101, 'Engineering'), (102, 'Data Science'), (103, 'Marketing');

INSERT INTO employees VALUES
(1, 'Arshith Kumar', 101, 145000.00, '2022-03-15'),
(2, 'Bhavana Kolla', 101, 120000.00, '2023-01-10'),
(3, 'Chandan Verma', 101, 95000.00,  '2024-06-01'),
(4, 'Deepak Rao',    102, 160000.00, '2021-11-20'),
(5, 'Esha Gupta',    102, 135000.00, '2023-05-12'),
(6, 'Farhan Khan',   103, 88000.00,  '2022-09-01'),
(7, 'Gita Patel',    103, 92000.00,  '2021-04-15');

-- 3. Advanced CTE + Window Function Analytical Query
WITH DeptStats AS (
    SELECT 
        e.emp_id,
        e.emp_name,
        d.dept_name,
        e.salary,
        AVG(e.salary) OVER (PARTITION BY e.dept_id) AS dept_avg_salary,
        RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS salary_rank_in_dept
    FROM employees e
    JOIN departments d ON e.dept_id = d.dept_id
)
SELECT 
    emp_id,
    emp_name,
    dept_name,
    salary,
    ROUND(dept_avg_salary, 2) AS dept_avg,
    salary_rank_in_dept,
    ROUND(((salary - dept_avg_salary) / dept_avg_salary) * 100, 1) AS pct_above_avg
FROM DeptStats
ORDER BY dept_name, salary_rank_in_dept;
`,
    "expectedOutput": `+--------+---------------+--------------+-----------+-----------+---------------------+---------------+
| emp_id | emp_name      | dept_name    | salary    | dept_avg  | salary_rank_in_dept | pct_above_avg |
+--------+---------------+--------------+-----------+-----------+---------------------+---------------+
|      4 | Deepak Rao    | Data Science | 160000.00 | 147500.00 |                   1 |           8.5 |
|      5 | Esha Gupta    | Data Science | 135000.00 | 147500.00 |                   2 |          -8.5 |
|      1 | Arshith Kumar | Engineering  | 145000.00 | 120000.00 |                   1 |          20.8 |
|      2 | Bhavana Kolla | Engineering  | 120000.00 | 120000.00 |                   2 |           0.0 |
|      3 | Chandan Verma | Engineering  |  95000.00 | 120000.00 |                   3 |         -20.8 |
|      7 | Gita Patel    | Marketing    |  92000.00 |  90000.00 |                   1 |           2.2 |
|      6 | Farhan Khan   | Marketing    |  88000.00 |  90000.00 |                   2 |          -2.2 |
+--------+---------------+--------------+-----------+-----------+---------------------+---------------+`
  },
  {
    "id": "sql-proj-3",
    "projectNumber": 3,
    "title": "Project 3: Persistent Library Inventory & Transaction Management System",
    "subtitle": "Module 08, 10 & 14 — DDL Views, Transactions (COMMIT/ROLLBACK) & Python SQLite Integration",
    "difficulty": "Intermediate to Advanced",
    "estimatedTime": "2 – 3 Hours",
    "pageLength": "1 – 2 Pages",
    "description": "Build a robust SQL database pipeline featuring DDL table creation, audit triggers, transactional borrowing workflows with COMMIT/ROLLBACK error handling, and a Python script using sqlite3 to execute parameterized inventory queries.",
    "objectives": [
      "Define triggers (AFTER UPDATE) to automatically decrease available book inventory copies",
      "Enforce data integrity with CHECK constraints (copies_available >= 0)",
      "Implement ACID compliant SQL transactions using BEGIN TRANSACTION, COMMIT, and ROLLBACK",
      "Create reusable SQL VIEWs for active loan tracking and build a Python SQLite client wrapper"
    ],
    "requirements": [
      "Create 'books' (book_id, title, author, total_copies, available_copies) and 'borrow_log' tables",
      "Create a Trigger 'update_book_inventory' that decrements available copies upon borrow insertion",
      "Create a SQL View 'v_active_loans' summarizing member borrowing activity",
      "Write a complete Python script demonstrating connection, transaction execution, and exception handling"
    ],
    "starterCode": `# Project 3: Persistent Library Inventory & Transaction Management System
# File: library_system.py

import sqlite3

class LibraryDatabase:
    def __init__(self, db_path=":memory:"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("PRAGMA foreign_keys = ON;")
        self.cursor = self.conn.cursor()
        self.setup_schema()

    def setup_schema(self):
        # 1. Books Table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS books (
                book_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                total_copies INTEGER NOT NULL CHECK(total_copies >= 0),
                available_copies INTEGER NOT NULL CHECK(available_copies >= 0)
            );
        ''')

        # 2. Borrow Log Table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS borrow_log (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER NOT NULL,
                member_name TEXT NOT NULL,
                borrow_date DATE DEFAULT (DATE('now')),
                return_date DATE,
                FOREIGN KEY (book_id) REFERENCES books(book_id)
            );
        ''')

        # 3. View for Active Loans
        self.cursor.execute('''
            CREATE VIEW IF NOT EXISTS v_active_loans AS
            SELECT 
                l.log_id,
                b.title,
                b.author,
                l.member_name,
                l.borrow_date
            FROM borrow_log l
            JOIN books b ON l.book_id = b.book_id
            WHERE l.return_date IS NULL;
        ''')

        # 4. Insert Initial Books
        self.cursor.executemany('''
            INSERT INTO books (title, author, total_copies, available_copies)
            VALUES (?, ?, ?, ?)
        ''', [
            ("SQL & Relational Database Mastery", "Siddharth Nair", 5, 5),
            ("Python for Data Analysis", "Charles Severance", 3, 3),
            ("Designing Data-Intensive Applications", "Martin Kleppmann", 2, 2)
        ])
        self.conn.commit()

    def borrow_book(self, book_id, member_name):
        """Executes borrow workflow in an ACID Compliant Transaction"""
        try:
            self.cursor.execute("BEGIN TRANSACTION;")
            
            # Check availability
            self.cursor.execute("SELECT available_copies, title FROM books WHERE book_id = ?", (book_id,))
            row = self.cursor.fetchone()
            
            if not row:
                raise ValueError("Book ID not found.")
            
            available, title = row
            if available <= 0:
                raise ValueError(f"No copies of '{title}' currently available!")

            # Log borrow event
            self.cursor.execute('''
                INSERT INTO borrow_log (book_id, member_name)
                VALUES (?, ?)
            ''', (book_id, member_name))

            # Deduct inventory
            self.cursor.execute('''
                UPDATE books SET available_copies = available_copies - 1
                WHERE book_id = ?
            ''', (book_id,))

            self.conn.commit()
            print(f"✓ Successfully borrowed '{title}' for {member_name}.")
            return True

        except Exception as e:
            self.conn.rollback()
            print(f"✗ Transaction Aborted: {e}")
            return False

    def display_active_loans(self):
        self.cursor.execute("SELECT * FROM v_active_loans;")
        rows = self.cursor.fetchall()
        print("\\n=== CURRENT ACTIVE LIBRARY LOANS ===")
        print(f"{'ID':<4} {'Title':<35} {'Member':<15} {'Borrow Date':<12}")
        print("-" * 70)
        for r in rows:
            print(f"{r[0]:<4} {r[1]:<35} {r[3]:<15} {r[4]:<12}")
        print("-" * 70)

if __name__ == '__main__':
    lib = LibraryDatabase()
    lib.borrow_book(1, "Arshith Kumar")
    lib.borrow_book(1, "Bhavana Kolla")
    lib.borrow_book(2, "Chandan Verma")
    lib.display_active_loans()
`,
    "expectedOutput": `✓ Successfully borrowed 'SQL & Relational Database Mastery' for Arshith Kumar.
✓ Successfully borrowed 'SQL & Relational Database Mastery' for Bhavana Kolla.
✓ Successfully borrowed 'Python for Data Analysis' for Chandan Verma.

=== CURRENT ACTIVE LIBRARY LOANS ===
ID   Title                               Member          Borrow Date 
----------------------------------------------------------------------
1    SQL & Relational Database Mastery   Arshith Kumar   2026-10-10  
2    SQL & Relational Database Mastery   Bhavana Kolla   2026-10-10  
3    Python for Data Analysis            Chandan Verma   2026-10-10  
----------------------------------------------------------------------`
  }
];

// Helper to inject projects into course objects in JSON / JS file content
function updateCourseProjectsInDbJson(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  const sqlCourse = data.courses.find(c => c.id === 'sql-data-analysis');
  if (sqlCourse) {
    sqlCourse.projects = SQL_3_PROJECTS;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Updated SQL projects in ${filePath}`);
  } else {
    console.error(`sql-data-analysis course not found in ${filePath}`);
  }
}

// 1. Update server/data/db.json
updateCourseProjectsInDbJson(path.join(rootDir, 'server/data/db.json'));

// 2. Update server/seed.js
let seedContent = fs.readFileSync(path.join(rootDir, 'server/seed.js'), 'utf-8');
const sqlPosSeed = seedContent.indexOf('"id": "sql-data-analysis"');
if (sqlPosSeed !== -1) {
  // Check if projects array already exists or where to insert
  // We can parse or replace carefully in seed.js
  const pyProjectsStr = `"projects": ${JSON.stringify(SQL_3_PROJECTS, null, 8)}`;
  // Find "id": "sql-data-analysis" block and insert/replace projects key
  const afterSqlPosSeed = seedContent.indexOf('{', sqlPosSeed - 20);
  // insert before the closing object of sql-data-analysis course
  // Let's use string manipulation or Regex
}

console.log("Script executed.");
