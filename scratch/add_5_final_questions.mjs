// scratch/add_5_final_questions.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ---------------------------------------------------------
// NEW PYTHON QUESTIONS (5 for each set: Q21 to Q25)
// ---------------------------------------------------------
const PYTHON_NEW_Q_SETA = [
  {
    id: "py-set-a-21",
    questionNumber: 21,
    topic: "Decorators & Metadata Preservation",
    questionText: "When decorating a target function with a custom wrapper function, which tool from Python's standard library should be applied to the wrapper to preserve the original function's name, docstring, and parameter signature?",
    codeSnippet: `from functools import wraps

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Before execution")
        return func(*args, **kwargs)
    return wrapper`,
    options: [
      "functools.lru_cache(func)",
      "functools.wraps(func)",
      "sys.settrace(func)",
      "inspect.signature(func)"
    ],
    correctAnswer: 1,
    explanation: "@functools.wraps(func) copies the __name__, __doc__, and module metadata from the decorated target function to the wrapper function, preventing reflection tools and debuggers from losing function identity."
  },
  {
    id: "py-set-a-22",
    questionNumber: 22,
    topic: "Context Managers & Exception Handling",
    questionText: "In a custom class implementing Python's Context Manager protocol (__enter__ and __exit__), how can __exit__ explicitly suppress an exception raised inside the 'with' block?",
    codeSnippet: `class SuppressErrorContext:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is ValueError:
            return True  # Suppress ValueError
        return False`,
    options: [
      "By returning True (or any truthy value) from the __exit__ method",
      "By raising StopIteration inside __exit__",
      "By returning None from __enter__",
      "Exceptions inside a 'with' block cannot be suppressed by __exit__"
    ],
    correctAnswer: 0,
    explanation: "If __exit__() returns True (or a truthy value), Python catches and suppresses the exception raised inside the 'with' block, allowing code execution to proceed immediately after the block."
  },
  {
    id: "py-set-a-23",
    questionNumber: 23,
    topic: "Generators & Memory Management",
    questionText: "What is the primary memory advantage of returning a generator expression using the yield keyword compared to returning a full list from a function processing 10 million records?",
    codeSnippet: `def stream_records():
    for i in range(10_000_000):
        yield f"Record_{i}"`,
    options: [
      "Generators compile the records into C machine code to execute 100x faster",
      "Generators evaluate items lazily one at a time on-demand, maintaining a constant O(1) memory footprint regardless of dataset size",
      "Generators automatically store records in RAM cache to eliminate garbage collection overhead",
      "Generators allow multi-threaded parallel execution across all CPU cores"
    ],
    correctAnswer: 1,
    explanation: "Generators produce values on-demand using lazy evaluation. Instead of allocating memory for all 10 million items simultaneously (O(N) RAM), a generator requires constant O(1) memory space."
  },
  {
    id: "py-set-a-24",
    questionNumber: 24,
    topic: "Metaclasses & Class Construction",
    questionText: "In Python's Object Model, what is a metaclass and which special method is invoked when creating a new class definition?",
    codeSnippet: `class MetaSingleton(type):
    def __call__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super().__call__(*args, **kwargs)
        return cls._instance`,
    options: [
      "A metaclass is a class decorator; it invokes __init__ when an instance is deleted",
      "A metaclass is the class of a class (such as 'type'); its __new__ or __call__ method constructs the class object itself",
      "A metaclass is an abstract base class that prevents subclasses from using inheritance",
      "A metaclass is a C-extension module built into the standard garbage collector"
    ],
    correctAnswer: 1,
    explanation: "Classes in Python are instances of metaclasses (default is 'type'). A metaclass defines how class objects are constructed, validated, and initialized when the class statement is evaluated."
  },
  {
    id: "py-set-a-25",
    questionNumber: 25,
    topic: "Concurrency: Threading vs Multiprocessing",
    questionText: "Due to CPython's Global Interpreter Lock (GIL), which module should be chosen to maximize performance for CPU-heavy tasks like image processing or matrix multiplication across multiple CPU cores?",
    codeSnippet: `from concurrent.futures import ProcessPoolExecutor

def compute_heavy_task(data):
    return sum(i * i for i in data)

if __name__ == '__main__':
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(compute_heavy_task, chunks))`,
    options: [
      "threading module with ThreadPoolExecutor",
      "multiprocessing module or ProcessPoolExecutor",
      "asyncio module with event loops",
      "queue module with ThreadQueue"
    ],
    correctAnswer: 1,
    explanation: "CPython's GIL permits only one thread to execute Python bytecode at a time per process. For CPU-bound tasks, multiprocessing/ProcessPoolExecutor spawns separate OS processes with independent GIL instances across all CPU cores."
  }
];

const PYTHON_NEW_Q_SETB = [
  {
    id: "py-set-b-21",
    questionNumber: 21,
    topic: "List Comprehensions & Flattening",
    questionText: "What is the correct syntax for a list comprehension that flattens a 2D matrix `[[1, 2], [3, 4], [5, 6]]` into a 1D list `[1, 2, 3, 4, 5, 6]`?",
    codeSnippet: `matrix = [[1, 2], [3, 4], [5, 6]]
flat = [num for row in matrix for num in row]`,
    options: [
      "[num for num in row for row in matrix]",
      "[num for row in matrix for num in row]",
      "[row for num in matrix for num in row]",
      "[num for row in matrix if num in row]"
    ],
    correctAnswer: 1,
    explanation: "In nested list comprehensions, the 'for' loops follow the exact same order as traditional nested for-loops: 'for row in matrix:' followed by 'for num in row:'."
  },
  {
    id: "py-set-b-22",
    questionNumber: 22,
    topic: "Memory Optimization with __slots__",
    questionText: "What is the primary benefit of declaring `__slots__` inside a Python class definition when instantiating millions of small objects?",
    codeSnippet: `class Point:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y`,
    options: [
      "It suppresses all AttributeError exceptions raised when accessing invalid properties",
      "It prevents Python from creating a dynamic __dict__ per instance, significantly reducing memory consumption",
      "It automatically converts instance attributes into thread-safe atomic variables",
      "It serializes class instances into SQLite binary database records"
    ],
    correctAnswer: 1,
    explanation: "By default, Python instances store attributes in a dynamic instance dictionary (__dict__). Defining __slots__ allocates a fixed array space instead, saving substantial memory for millions of instances."
  },
  {
    id: "py-set-b-23",
    questionNumber: 23,
    topic: "Exception Chaining & Tracebacks",
    questionText: "In Python 3, how do you re-raise a custom exception while explicitly linking it to the original caught exception to maintain clean cause tracking?",
    codeSnippet: `try:
    connect_to_database()
except ConnectionError as err:
    raise DatabaseException("Service unavailable") from err`,
    options: [
      "raise DatabaseException() with err",
      "raise DatabaseException() from err",
      "raise DatabaseException() cause err",
      "raise DatabaseException() using err"
    ],
    correctAnswer: 1,
    explanation: "The 'raise NewException() from original_err' syntax sets the __cause__ attribute on the new exception, producing an explicit 'The above exception was the direct cause of the following exception' traceback message."
  },
  {
    id: "py-set-b-24",
    questionNumber: 24,
    topic: "Structural Pattern Matching (match / case)",
    questionText: "Introduced in Python 3.10, which statement describes how structural pattern matching evaluates data structures?",
    codeSnippet: `def handle_command(cmd):
    match cmd.split():
        case ["quit"]:
            return "Exiting"
        case ["move", ("left" | "right" | "up" | "down") as direction]:
            return f"Moving {direction}"
        case _:
            return "Unknown command"`,
    options: [
      "It is a simple replacement for C-style switch statements that only evaluates integer constants",
      "It inspects data shape, sequences, dynamic patterns, and binding variables with guards and wildcards (_)",
      "It compiles Python statements into regular expressions before runtime matching",
      "It runs only inside asynchronous event loops"
    ],
    correctAnswer: 1,
    explanation: "Python 3.10 match/case supports structural pattern matching, destructuring tuples/lists, binding dynamic variables, matching dict keys, applying guards ('if'), and wildcards ('_')."
  },
  {
    id: "py-set-b-25",
    questionNumber: 25,
    topic: "Asynchronous IO & Event Loops",
    questionText: "In Python's `asyncio` framework, how do you execute multiple asynchronous coroutines concurrently and await all their completed results simultaneously?",
    codeSnippet: `import asyncio

async def fetch_api(endpoint):
    await asyncio.sleep(1)
    return f"Data from {endpoint}"

async def main():
    results = await asyncio.gather(
        fetch_api("/users"),
        fetch_api("/orders"),
        fetch_api("/products")
    )`,
    options: [
      "asyncio.run_parallel()",
      "asyncio.gather()",
      "asyncio.thread_wait()",
      "asyncio.join_all()"
    ],
    correctAnswer: 1,
    explanation: "`asyncio.gather(*aws)` takes multiple asynchronous awaitables/coroutines, schedules them concurrently on the active event loop, and returns an ordered list of their return values."
  }
];

const PYTHON_NEW_Q_SETC = [
  {
    id: "py-set-c-21",
    questionNumber: 21,
    topic: "Dictionary Union Operators",
    questionText: "In Python 3.9+, what is the result of applying the dictionary merge operator `d1 | d2` when both dictionaries contain overlapping keys?",
    codeSnippet: `d1 = {'a': 1, 'b': 2}
d2 = {'b': 99, 'c': 3}
result = d1 | d2`,
    options: [
      "{'a': 1, 'b': 2, 'c': 3} (left operand d1 takes priority)",
      "{'a': 1, 'b': 99, 'c': 3} (right operand d2 overrides overlapping keys)",
      "A KeyError is raised due to duplicate key collision",
      "{'a': 1, 'b': [2, 99], 'c': 3} (values are merged into lists)"
    ],
    correctAnswer: 1,
    explanation: "The dictionary union operator `|` merges two dictionaries. If there are duplicate keys, the right-hand dictionary (`d2`) overwrites the values of the left-hand dictionary (`d1`)."
  },
  {
    id: "py-set-c-22",
    questionNumber: 22,
    topic: "Object Copying: Shallow vs Deep",
    questionText: "What distinguishes `copy.deepcopy()` from `copy.copy()` when duplicating a nested object structure containing lists inside dictionaries?",
    codeSnippet: `import copy
original = {'items': [1, 2, 3]}
shallow = copy.copy(original)
deep = copy.deepcopy(original)`,
    options: [
      "copy.copy() creates a new outer object and recursively copies all nested child objects",
      "copy.deepcopy() creates a completely independent recursive copy of both outer and all nested mutable objects",
      "copy.deepcopy() converts all list elements into immutable tuples automatically",
      "copy.copy() only works on primitive integers and strings"
    ],
    correctAnswer: 1,
    explanation: "Shallow copy (`copy.copy`) creates a new outer object but inserts references to the nested objects. Deep copy (`copy.deepcopy`) recursively duplicates every nested child object."
  },
  {
    id: "py-set-c-23",
    questionNumber: 23,
    topic: "LRU Caching & Memoization",
    questionText: "Which requirement must function arguments satisfy to be compatible with `@functools.lru_cache` memoization?",
    codeSnippet: `from functools import lru_cache

@lru_cache(maxsize=128)
def compute_factorial(n):
    return 1 if n <= 1 else n * compute_factorial(n - 1)`,
    options: [
      "All arguments passed to the function must be mutable data structures like lists or dicts",
      "All arguments passed to the function must be hashable (immutable data types like int, str, tuple)",
      "The function must be defined inside a class inheriting from dict",
      "The function must be declared with the async keyword"
    ],
    correctAnswer: 1,
    explanation: "`@lru_cache` stores cached results in an internal dictionary indexed by function arguments. Therefore, all positional and keyword arguments must be hashable."
  },
  {
    id: "py-set-c-24",
    questionNumber: 24,
    topic: "Custom Iterator Protocol",
    questionText: "To build a custom Iterator class in Python, which two special dunder methods must be implemented?",
    codeSnippet: `class NumberCounter:
    def __init__(self, low, high):
        self.current = low
        self.high = high

    def __iter__(self):
        return self

    def __next__(self):
        if self.current > self.high:
            raise StopIteration
        self.current += 1
        return self.current - 1`,
    options: [
      "__init__ and __del__",
      "__iter__ and __next__",
      "__enter__ and __exit__",
      "__getitem__ and __setitem__"
    ],
    correctAnswer: 1,
    explanation: "Python's Iterator Protocol requires `__iter__()` (which returns the iterator object itself) and `__next__()` (which returns the next item or raises `StopIteration`)."
  },
  {
    id: "py-set-c-25",
    questionNumber: 25,
    topic: "Dataclasses & Default Factories",
    questionText: "In Python's `@dataclass` decorator, why is setting a mutable default argument like `tags: list = []` invalid, and how should it be declared?",
    codeSnippet: `from dataclasses import dataclass, field

@dataclass
class UserProfile:
    username: str
    tags: list = field(default_factory=list)`,
    options: [
      "Dataclasses do not allow list attributes under any circumstances",
      "Mutable default arguments are shared across all class instances; `field(default_factory=list)` creates a fresh list instance per object",
      "default_factory is used exclusively for serializing objects to JSON",
      "tags must be declared as a tuple instead of a list"
    ],
    correctAnswer: 1,
    explanation: "Python prevents mutable defaults in dataclass definitions to avoid sharing the same list reference across all class instances. `field(default_factory=list)` calls the factory function to produce a new list for each instance."
  }
];

const PYTHON_NEW_Q_SETD = [
  {
    id: "py-set-d-21",
    questionNumber: 21,
    topic: "Scope & Nonlocal Keyword",
    questionText: "Inside an inner nested function, which keyword allows you to modify a variable bound in the outer enclosing function's scope (without making it global)?",
    codeSnippet: `def outer_counter():
    count = 0
    def inner_increment():
        nonlocal count
        count += 1
        return count
    return inner_increment`,
    options: [
      "global",
      "nonlocal",
      "outer",
      "self"
    ],
    correctAnswer: 1,
    explanation: "The `nonlocal` keyword allows a nested function to modify variables defined in its outer (enclosing) scope rather than creating a new local variable."
  },
  {
    id: "py-set-d-22",
    questionNumber: 22,
    topic: "Default Mutable Arguments Idiom",
    questionText: "What occurs when calling a function multiple times if default parameter values are initialized with mutable objects like `def append_to(element, target=[])`?",
    codeSnippet: `def append_to(element, target=[]):
    target.append(element)
    return target

print(append_to(1))  # [1]
print(append_to(2))  # Expected [2], but output is [1, 2]!`,
    options: [
      "Python creates a new empty list on every function call",
      "The default list is created once when the function is defined, causing state to persist across successive calls",
      "A TypeError is raised during module import",
      "The list is automatically cleared when the function returns"
    ],
    correctAnswer: 1,
    explanation: "Default parameter values are evaluated once when the function definition is executed. Passing a mutable default retains modifications across subsequent function calls."
  },
  {
    id: "py-set-d-23",
    questionNumber: 23,
    topic: "Weak References & Memory Leaks",
    questionText: "Which standard library module allows you to create references to objects without preventing the garbage collector from reclaiming their memory space?",
    codeSnippet: `import weakref

class LargeCache:
    pass

obj = LargeCache()
ref = weakref.ref(obj)  # Does not increment refcount`,
    options: [
      "sys.memref",
      "weakref",
      "gc.collect",
      "ctypes.pointer"
    ],
    correctAnswer: 1,
    explanation: "The `weakref` module enables weak references to objects. A weak reference does not keep the target object alive if its strong reference count drops to zero."
  },
  {
    id: "py-set-d-24",
    questionNumber: 24,
    topic: "Subprocess Command Execution",
    questionText: "When executing system shell commands using `subprocess.run()`, which options capture standard output as text and raise CalledProcessError on non-zero exit status?",
    codeSnippet: `import subprocess

result = subprocess.run(
    ["git", "status"],
    capture_output=True,
    text=True,
    check=True
)`,
    options: [
      "shell=True, debug=True",
      "capture_output=True, text=True, check=True",
      "stdout=PIPE, async=True",
      "raise_on_error=True, format='string'"
    ],
    correctAnswer: 1,
    explanation: "`capture_output=True` captures stdout/stderr, `text=True` decodes bytes into UTF-8 strings, and `check=True` raises a CalledProcessError if the command fails."
  },
  {
    id: "py-set-d-25",
    questionNumber: 25,
    topic: "Type Hinting & Generics",
    questionText: "In Python's `typing` module, what does `Optional[str]` represent?",
    codeSnippet: `from typing import Optional

def get_user_name(user_id: int) -> Optional[str]:
    if user_id == 1:
        return "Arshith"
    return None`,
    options: [
      "A string that is automatically converted to lower case",
      "Shorthand for Union[str, None], indicating the return value can be either a string or None",
      "A string that is optional to pass as an argument but required as a return value",
      "A thread-safe string wrapper"
    ],
    correctAnswer: 1,
    explanation: "`Optional[T]` is equivalent to `Union[T, None]`. It signals to static type checkers (like mypy) that the variable can hold a value of type T or None."
  }
];

// ---------------------------------------------------------
// NEW SQL QUESTIONS (5 for each set: Q21 to Q25)
// ---------------------------------------------------------
const SQL_NEW_Q_SETA = [
  {
    id: "sql-set-a-21",
    questionNumber: 21,
    topic: "Covering Indexes & Index-Only Scans",
    questionText: "Under what condition can a Relational Database Query Optimizer perform an Index-Only Scan to fulfill a SELECT query without fetching table rows from disk heaps?",
    codeSnippet: `-- Table: employees (id, name, dept_id, salary)
CREATE INDEX idx_dept_salary ON employees(dept_id, salary);

SELECT dept_id, salary FROM employees WHERE dept_id = 101;`,
    options: [
      "When the table contains fewer than 100 rows",
      "When all columns requested in the SELECT clause and WHERE filter are contained directly within the B-Tree index itself",
      "When the database uses SQLite in memory mode exclusively",
      "When a FULL OUTER JOIN is executed on primary keys"
    ],
    correctAnswer: 1,
    explanation: "An Index-Only Scan occurs when a covering index contains all requested query fields (SELECT and WHERE). The engine reads data directly from the index in RAM without disk heap I/O."
  },
  {
    id: "sql-set-a-22",
    questionNumber: 22,
    topic: "Window Functions: LEAD and LAG",
    questionText: "Which SQL Window Function allows a query to access data from the next or previous row in the result set without performing a self-join?",
    codeSnippet: `SELECT 
    order_date,
    total_amount,
    LAG(total_amount, 1) OVER (ORDER BY order_date) AS prev_order_amount,
    total_amount - LAG(total_amount, 1) OVER (ORDER BY order_date) AS diff
FROM orders;`,
    options: [
      "FIRST_VALUE() and LAST_VALUE()",
      "LAG() and LEAD()",
      "ROW_NUMBER() and RANK()",
      "NTILE() and CUME_DIST()"
    ],
    correctAnswer: 1,
    explanation: "`LAG()` accesses data from a previous row, and `LEAD()` accesses data from a subsequent row relative to the current position within the defined window partition."
  },
  {
    id: "sql-set-a-23",
    questionNumber: 23,
    topic: "Recursive Common Table Expressions (CTEs)",
    questionText: "What is the primary usage of a `WITH RECURSIVE` CTE in relational databases?",
    codeSnippet: `WITH RECURSIVE OrgChart AS (
    SELECT emp_id, name, manager_id, 1 AS level
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.emp_id, e.name, e.manager_id, o.level + 1
    FROM employees e
    JOIN OrgChart o ON e.manager_id = o.emp_id
)
SELECT * FROM OrgChart;`,
    options: [
      "To automatically create foreign key triggers across multiple databases",
      "To query hierarchical, tree-structured, or graph network data like organizational charts and bill of materials",
      "To bypass database security permissions and grant superuser access",
      "To encrypt passwords stored in text columns"
    ],
    correctAnswer: 1,
    explanation: "`WITH RECURSIVE` enables traversal of hierarchical or graph-structured datasets (such as parent-child employee org charts, categories, or network paths) by repeatedly executing an anchor query."
  },
  {
    id: "sql-set-a-24",
    questionNumber: 24,
    topic: "ACID Transaction Isolation Levels",
    questionText: "Which ANSI SQL Transaction Isolation level guarantees protection against Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
    codeSnippet: `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
-- Guarantees complete isolation
COMMIT;`,
    options: [
      "READ UNCOMMITTED",
      "READ COMMITTED",
      "REPEATABLE READ",
      "SERIALIZABLE"
    ],
    correctAnswer: 3,
    explanation: "`SERIALIZABLE` is the highest isolation level. It enforces strict transaction execution sequence as if transactions occurred serially, preventing Dirty Reads, Non-Repeatable Reads, and Phantom Reads."
  },
  {
    id: "sql-set-a-25",
    questionNumber: 25,
    topic: "Three-Valued Logic & NULL Handling",
    questionText: "In SQL Three-Valued Logic (TRUE, FALSE, UNKNOWN), what is the evaluation result of the expression `SELECT * FROM users WHERE status = NULL;`?",
    codeSnippet: `SELECT * FROM users WHERE status = NULL; -- Returns 0 rows!`,
    options: [
      "It returns all rows where status is NULL",
      "It evaluates to UNKNOWN (falsy), returning 0 rows; `IS NULL` must be used instead",
      "It raises a SyntaxError during execution",
      "It converts NULL to an empty string ''"
    ],
    correctAnswer: 1,
    explanation: "In SQL, NULL represents an unknown value. Comparisons using `=`, `<>`, or `!=` with NULL evaluate to UNKNOWN, which fails WHERE conditions. Developers must use `IS NULL` or `IS NOT NULL`."
  }
];

const SQL_NEW_Q_SETB = [
  {
    id: "sql-set-b-21",
    questionNumber: 21,
    topic: "Correlated Subqueries vs EXISTS",
    questionText: "Why is using `WHERE EXISTS (SELECT 1 FROM ...)` generally faster than `WHERE id IN (SELECT id FROM ...)` when querying large subquery datasets with potential NULL values?",
    codeSnippet: `SELECT c.full_name FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id AND o.total_amount > 10000
);`,
    options: [
      "EXISTS converts the query into a C-extension function",
      "EXISTS short-circuits evaluation as soon as a single matching record is found, and avoids three-valued NULL logic pitfalls",
      "IN creates a temporary table on physical disk for every row",
      "EXISTS automatically disables table indexing"
    ],
    correctAnswer: 1,
    explanation: "`EXISTS` short-circuits as soon as a matching row is found without scanning the entire subquery. Furthermore, `NOT IN` fails to return rows if the subquery contains a single NULL value."
  },
  {
    id: "sql-set-b-22",
    questionNumber: 22,
    topic: "Advanced Grouping: ROLLUP & CUBE",
    questionText: "Which GROUP BY extension generates aggregate summary rows for all possible combinations of specified grouping columns, including sub-totals and a grand total?",
    codeSnippet: `SELECT region, category, SUM(sales)
FROM sales_data
GROUP BY CUBE(region, category);`,
    options: [
      "GROUP BY HAVING",
      "GROUP BY ROLLUP",
      "GROUP BY CUBE",
      "GROUP BY OVER"
    ],
    correctAnswer: 2,
    explanation: "`GROUP BY CUBE(a, b)` generates aggregations for all $2^N$ dimension combinations ((a, b), (a), (b), and grand total ()). `ROLLUP` produces hierarchical sub-totals."
  },
  {
    id: "sql-set-b-23",
    questionNumber: 23,
    topic: "Database Normalization (3NF vs BCNF)",
    questionText: "A relational table is in Third Normal Form (3NF) if it is in 2NF and satisfies which key structural condition?",
    codeSnippet: `-- 3NF Rule: Every non-key attribute must depend on the key, the whole key, and nothing but the key!`,
    options: [
      "It contains no multi-valued array columns",
      "There are no transitive dependencies (non-key columns depending on other non-key columns)",
      "All columns are indexed with B-Tree indexes",
      "Every column must be declared with NOT NULL constraints"
    ],
    correctAnswer: 1,
    explanation: "3NF requires removing transitive functional dependencies where a non-prime attribute depends on another non-prime attribute rather than directly on candidate keys."
  },
  {
    id: "sql-set-b-24",
    questionNumber: 24,
    topic: "Foreign Key Referential Integrity Actions",
    questionText: "What happens when a parent record in a primary table is deleted if its Foreign Key constraint specifies `ON DELETE SET NULL`?",
    codeSnippet: `CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);`,
    options: [
      "The deletion of the parent customer is rejected with an IntegrityError",
      "The corresponding child order records in orders table automatically have their customer_id updated to NULL",
      "All child orders are permanently deleted from disk",
      "The customer_id is assigned to value 0"
    ],
    correctAnswer: 1,
    explanation: "`ON DELETE SET NULL` preserves child records when a referenced parent row is deleted by automatically updating the foreign key column in child rows to NULL."
  },
  {
    id: "sql-set-b-25",
    questionNumber: 25,
    topic: "Full-Text Search vs Pattern Matching",
    questionText: "Why is a wildcard query like `SELECT * FROM articles WHERE content LIKE '%database%';` inefficient on large text datasets, and how is it optimized?",
    codeSnippet: `-- Inefficient: Leading wildcard forces Full Table Scan
SELECT * FROM articles WHERE content LIKE '%database%';`,
    options: [
      "Leading wildcards (%term) prevent B-Tree index lookup, requiring a Full Table Scan; Full-Text Search (FTS) uses GIN/GiST inverted indexes for fast word searches",
      "LIKE queries automatically lock the entire database server",
      "LIKE statements only work on integer columns",
      "Full-Text Search converts text into floating point numbers"
    ],
    correctAnswer: 0,
    explanation: "Standard B-Tree indexes cannot index pattern searches starting with wildcards (`%text`). Full-Text Search indexes build inverted key-to-document indexes (GIN/GiST) for fast text matching."
  }
];

const SQL_NEW_Q_SETC = [
  {
    id: "sql-set-c-21",
    questionNumber: 21,
    topic: "Self JOINs for Sequential Analytics",
    questionText: "Which SQL query pattern correlates rows within the same table to compare events or calculate intervals between consecutive user interactions?",
    codeSnippet: `SELECT 
    a.user_id,
    a.login_time AS current_login,
    b.login_time AS previous_login
FROM user_logins a
JOIN user_logins b 
  ON a.user_id = b.user_id AND a.login_id = b.login_id + 1;`,
    options: [
      "CROSS JOIN",
      "Self JOIN",
      "FULL OUTER JOIN",
      "NATURAL JOIN"
    ],
    correctAnswer: 1,
    explanation: "A Self JOIN joins a table to itself using aliases (e.g., `a` and `b`), allowing row-to-row comparisons within the same dataset."
  },
  {
    id: "sql-set-c-22",
    questionNumber: 22,
    topic: "COUNT(*) vs COUNT(column_name)",
    questionText: "What is the critical behavioral difference between `COUNT(*)` and `COUNT(status)` when analyzing a table where 5 out of 10 rows have a NULL status?",
    codeSnippet: `-- Table has 10 total rows (5 have NULL status)
SELECT COUNT(*) AS total_rows, COUNT(status) AS status_count FROM orders;`,
    options: [
      "Both queries return 10",
      "COUNT(*) returns 10 (all rows), while COUNT(status) returns 5 (ignores NULLs)",
      "COUNT(status) raises an error when encountering NULL values",
      "COUNT(*) returns 5 and COUNT(status) returns 10"
    ],
    correctAnswer: 1,
    explanation: "`COUNT(*)` counts all rows in the dataset regardless of content. `COUNT(column_name)` counts only non-NULL occurrences in that specific column."
  },
  {
    id: "sql-set-c-23",
    questionNumber: 23,
    topic: "Database Triggers & Audit Logging",
    questionText: "When creating a database Trigger to write audit log entries whenever a user's email address is updated, which timing and event specification should be defined?",
    codeSnippet: `CREATE TRIGGER audit_user_email_update
AFTER UPDATE OF email ON users
FOR EACH ROW
BEGIN
    INSERT INTO email_audit_log(user_id, old_email, new_email, updated_at)
    VALUES (OLD.id, OLD.email, NEW.email, DATETIME('now'));
END;`,
    options: [
      "BEFORE DELETE ON users",
      "AFTER UPDATE OF email ON users FOR EACH ROW",
      "INSTEAD OF SELECT ON users",
      "BEFORE INSERT ON users"
    ],
    correctAnswer: 1,
    explanation: "An `AFTER UPDATE OF email ON users FOR EACH ROW` trigger executes after an update statement finishes, exposing `OLD.email` (previous value) and `NEW.email` (updated value) for audit records."
  },
  {
    id: "sql-set-c-24",
    questionNumber: 24,
    topic: "Temporary Tables vs CTEs",
    questionText: "When should a developer choose a Temporary Table (`CREATE TEMP TABLE`) over a Common Table Expression (`WITH cte AS ...`) in a complex multi-step stored procedure?",
    codeSnippet: `CREATE TEMP TABLE temp_active_users AS
SELECT user_id, registration_date FROM users WHERE status = 'Active';

CREATE INDEX idx_temp_user ON temp_active_users(user_id);`,
    options: [
      "CTEs cannot perform JOIN operations",
      "When the intermediate result set is referenced multiple times across separate queries or requires explicit indexing",
      "Temporary tables are stored permanently on network disk backup drives",
      "CTEs only work inside SQLite"
    ],
    correctAnswer: 1,
    explanation: "CTEs are scoped to a single query execution. Temporary tables persist across multiple queries in the session, allowing index creation and repeated references without recomputing data."
  },
  {
    id: "sql-set-c-25",
    questionNumber: 25,
    topic: "Upsert Logic (ON CONFLICT DO UPDATE)",
    questionText: "Which SQL clause implements 'Upsert' functionality by updating an existing record if a UNIQUE key conflict occurs during insertion?",
    codeSnippet: `INSERT INTO user_stats (user_id, login_count)
VALUES (101, 1)
ON CONFLICT(user_id) DO UPDATE SET
    login_count = user_stats.login_count + 1;`,
    options: [
      "ON CONFLICT(...) DO UPDATE",
      "WHERE DUPLICATE REPLACE",
      "TRY INSERT CATCH UPDATE",
      "IF EXISTS ALTER"
    ],
    correctAnswer: 0,
    explanation: "`INSERT INTO ... ON CONFLICT(key) DO UPDATE SET ...` (standard SQL / PostgreSQL / SQLite) atomizes insertion or updating upon primary key or unique constraint collisions."
  }
];

const SQL_NEW_Q_SETD = [
  {
    id: "sql-set-d-21",
    questionNumber: 21,
    topic: "DENSE_RANK() vs ROW_NUMBER()",
    questionText: "How does `DENSE_RANK()` behave differently from `ROW_NUMBER()` when ranking employees with identical salaries?",
    codeSnippet: `-- Two employees earn $100,000 (tied)
SELECT name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rk
FROM employees;`,
    options: [
      "ROW_NUMBER assigns distinct sequential numbers (1, 2, 3); DENSE_RANK assigns tied ranks (1, 1, 2) without skipping numbers",
      "DENSE_RANK skips numbers after ties (1, 1, 3)",
      "ROW_NUMBER raises an error on ties",
      "DENSE_RANK produces floating-point numbers"
    ],
    correctAnswer: 0,
    explanation: "`ROW_NUMBER()` assigns unique sequential integers (1, 2, 3). `DENSE_RANK()` assigns identical ranks to tied values without skipping subsequent rank numbers (1, 1, 2)."
  },
  {
    id: "sql-set-d-22",
    questionNumber: 22,
    topic: "Database Deadlocks & Lock Ordering",
    questionText: "What causes a Deadlock scenario in concurrent relational database transactions, and how is it mitigated?",
    codeSnippet: `-- Transaction 1: Locks Row A, waits for Row B
-- Transaction 2: Locks Row B, waits for Row A`,
    options: [
      "Deadlocks occur when disk space runs out; they are mitigated by clearing logs",
      "Deadlocks occur when two or more transactions hold locks on resources the other requires; mitigated by accessing tables/rows in a consistent deterministic order",
      "Deadlocks occur when foreign keys are deleted",
      "Deadlocks are prevented by disabling index locks"
    ],
    correctAnswer: 1,
    explanation: "Deadlocks occur when transactions wait mutually for locks held by each other. Mitigate by acquiring locks in a consistent order and keeping transaction windows short."
  },
  {
    id: "sql-set-d-23",
    questionNumber: 23,
    topic: "Table Partitioning Strategies",
    questionText: "What is the primary performance benefit of Table Partitioning (`PARTITION BY RANGE`) on multi-terabyte transactional tables?",
    codeSnippet: `CREATE TABLE sales (
    sale_id INT,
    sale_date DATE NOT NULL,
    amount DECIMAL
) PARTITION BY RANGE (sale_date);`,
    options: [
      "It compresses text columns using ZIP compression",
      "Partition Pruning enables the query engine to scan only relevant data partitions, skipping unneeded date ranges entirely",
      "It converts relational tables into NoSQL document stores",
      "It eliminates the need for primary keys"
    ],
    correctAnswer: 1,
    explanation: "Partition Pruning excludes non-relevant table partitions from query execution plans based on WHERE filtering (e.g., filtering `sale_date = '2025-04-01'` scans only the Q2 2025 partition)."
  },
  {
    id: "sql-set-d-24",
    questionNumber: 24,
    topic: "Conditional Aggregations",
    questionText: "Which SQL technique allows calculating multiple conditional metrics in a single SELECT query pass over a dataset?",
    codeSnippet: `SELECT 
    COUNT(*) AS total_orders,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM orders;`,
    options: [
      "Running separate SELECT queries and combining them with UNION",
      "Using SUM(CASE WHEN ... END) or FILTER (WHERE ...)",
      "Using GROUP BY HAVING on status",
      "Executing nested cursor loops"
    ],
    correctAnswer: 1,
    explanation: "Combining aggregate functions with CASE statements (or ANSI `FILTER (WHERE ...)`) computes distinct subset counts in a single table scan."
  },
  {
    id: "sql-set-d-25",
    questionNumber: 25,
    topic: "Foreign Key Indexing & Table Locking",
    questionText: "Why should database administrators always build indexes on Foreign Key columns in relational database schemas?",
    codeSnippet: `CREATE TABLE order_items (
    item_id INT PRIMARY KEY,
    order_id INT NOT NULL, -- Foreign Key
    product_id INT NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id); -- Critical!`,
    options: [
      "Without an index on Foreign Keys, deleting a row from the parent table can cause a full table lock or full scan on the child table",
      "Foreign Keys cannot be created unless an index already exists",
      "Indexes convert foreign keys into primary keys",
      "Foreign key indexes automatically encrypt table rows"
    ],
    correctAnswer: 0,
    explanation: "When modifying parent rows, database engines verify child table constraints. Un-indexed Foreign Key columns force full table scans or share locks on the child table, hindering concurrency."
  }
];


// Read db.json
const dbPath = path.join(rootDir, 'server', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function append5Questions(courseId, newQuestionsMap) {
  const course = db.courses.find(c => c.id === courseId || c.category?.toLowerCase() === courseId.toLowerCase() || (courseId === 'sql' && c.id === 'sql-mastery'));
  if (!course || !course.finalTest || !course.finalTest.questionPapers) {
    console.error(`Course ${courseId} not found or missing questionPapers!`);
    return;
  }

  const papers = course.finalTest.questionPapers;
  papers.forEach(paper => {
    let newQSet = [];
    if (paper.paperCode.endsWith('SETA')) newQSet = newQuestionsMap.SETA;
    else if (paper.paperCode.endsWith('SETB')) newQSet = newQuestionsMap.SETB;
    else if (paper.paperCode.endsWith('SETC')) newQSet = newQuestionsMap.SETC;
    else if (paper.paperCode.endsWith('SETD')) newQSet = newQuestionsMap.SETD;
    else newQSet = newQuestionsMap.SETA;

    // Filter out existing IDs to prevent duplicates if re-run
    const existingIds = new Set(paper.questions.map(q => q.id));
    newQSet.forEach(q => {
      if (!existingIds.has(q.id)) {
        paper.questions.push(q);
      }
    });

    console.log(`Updated ${paper.paperCode} now has ${paper.questions.length} questions.`);
  });

  // Also update default questions array
  course.finalTest.questions = papers[0].questions;
}

// Append Python Questions
append5Questions('python-programming', {
  SETA: PYTHON_NEW_Q_SETA,
  SETB: PYTHON_NEW_Q_SETB,
  SETC: PYTHON_NEW_Q_SETC,
  SETD: PYTHON_NEW_Q_SETD
});

// Append SQL Questions
append5Questions('sql', {
  SETA: SQL_NEW_Q_SETA,
  SETB: SQL_NEW_Q_SETB,
  SETC: SQL_NEW_Q_SETC,
  SETD: SQL_NEW_Q_SETD
});

// 1. Write server/data/db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Updated server/data/db.json successfully.');

// 2. Write server/seed.js
const seedPath = path.join(rootDir, 'server', 'seed.js');
fs.writeFileSync(seedPath, `// Database Seed Data\nexport const initialData = ${JSON.stringify(db, null, 2)};\n`, 'utf8');
console.log('Updated server/seed.js successfully.');

// 3. Write src/data/coursesData.js
const coursesDataPath = path.join(rootDir, 'src', 'data', 'coursesData.js');
const categoriesCode = `export const CATEGORIES = [
  "All Categories",
  "Programming",
  "SQL",
  "Data Science",
  "Web Development",
  "Cloud & DevOps",
  "Cybersecurity",
  "AI"
];\n\n`;

const studentProfileCode = `export const STUDENT_PROFILE = {
  "name": "Arshith Kumar",
  "email": "arshith@arshithbootcamp.com",
  "role": "Learner",
  "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "joinDate": "January 2026",
  "completedCoursesCount": 1,
  "enrolledCoursesCount": 4,
  "certificatesEarned": 1
};\n\nexport const SAMPLE_STUDENT = STUDENT_PROFILE;\n\n`;

const certificatesCode = `export const SAMPLE_CERTIFICATES = [
  {
    "id": "ABC-2026-PY0128",
    "courseId": "python-programming",
    "courseTitle": "Python Programming",
    "studentName": "Arshith Kumar",
    "issueDate": "October 1, 2026",
    "instructorName": "Dr. Ananya Sharma",
    "grade": "98% Distinction",
    "skills": [
      "Python 3",
      "OOP",
      "File I/O",
      "SQLite",
      "Automation"
    ]
  }
];\n\nexport const COURSES = INITIAL_COURSES;\n`;

const coursesCode = categoriesCode + `export const INITIAL_COURSES = ${JSON.stringify(db.courses, null, 2)};\n\n` + studentProfileCode + certificatesCode;

fs.writeFileSync(coursesDataPath, coursesCode, 'utf8');
console.log('Updated src/data/coursesData.js successfully.');

console.log('Finished updating 5 extra questions for Python and SQL final assessments!');
