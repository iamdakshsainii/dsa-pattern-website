export function getQuizQuestions(roadmapId) {
  const questionBank = {
    "data-analyst-roadmap": [
      {
        id: "da-q1",
        question: "Which SQL clause is used to filter rows based on a condition?",
        options: ["SELECT", "WHERE", "GROUP BY", "ORDER BY"],
        correct: "WHERE",
        explanation: "WHERE clause filters rows based on conditions. SELECT retrieves columns, GROUP BY groups data, ORDER BY sorts results.",
        resources: [
          { type: "youtube", title: "SQL WHERE Clause Tutorial", url: "https://youtube.com/watch?v=XqIk2PwP0To" },
          { type: "article", title: "SQL WHERE Guide", url: "https://www.w3schools.com/sql/sql_where.asp" }
        ],
        topic: "SQL Basics",
        difficulty: "easy",
        company: "Amazon"
      },
      {
        id: "da-q2",
        question: "What does the INNER JOIN clause do in SQL?",
        options: [
          "Returns all rows from both tables",
          "Returns only matching rows from both tables",
          "Returns rows from left table only",
          "Returns rows from right table only"
        ],
        correct: "Returns only matching rows from both tables",
        explanation: "INNER JOIN returns only rows where there's a match in both tables. LEFT/RIGHT JOIN include non-matching rows from one side.",
        resources: [
          { type: "youtube", title: "SQL Joins Explained", url: "https://youtube.com/watch?v=9yeOJ0ZMUYw" },
          { type: "article", title: "Visual Guide to SQL Joins", url: "https://www.sql-join.com/" }
        ],
        topic: "SQL Joins",
        difficulty: "medium",
        company: "Google"
      },
      {
        id: "da-q3",
        question: "Which Python library is most commonly used for data manipulation?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        correct: "Pandas",
        explanation: "Pandas is built for data manipulation with DataFrames. NumPy handles arrays, Matplotlib for visualization, Scikit-learn for ML.",
        resources: [
          { type: "youtube", title: "Pandas Complete Tutorial", url: "https://youtube.com/watch?v=vmEHCJofslg" },
          { type: "article", title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" }
        ],
        topic: "Python Data Analysis",
        difficulty: "easy",
        company: "Meta"
      },
      {
        id: "da-q4",
        question: "What is the purpose of GROUP BY in SQL?",
        options: [
          "To sort data",
          "To filter data",
          "To aggregate data by categories",
          "To join tables"
        ],
        correct: "To aggregate data by categories",
        explanation: "GROUP BY groups rows with same values and allows aggregate functions like COUNT, SUM, AVG. ORDER BY sorts, WHERE filters.",
        resources: [
          { type: "youtube", title: "SQL GROUP BY Explained", url: "https://youtube.com/watch?v=mSb1VP-H8yw" },
          { type: "article", title: "GROUP BY Tutorial", url: "https://mode.com/sql-tutorial/sql-group-by/" }
        ],
        topic: "SQL Aggregations",
        difficulty: "medium",
        company: "Microsoft"
      },
      {
        id: "da-q5",
        question: "Which visualization is best for showing distribution of a single variable?",
        options: ["Scatter plot", "Histogram", "Line chart", "Pie chart"],
        correct: "Histogram",
        explanation: "Histogram shows frequency distribution of continuous data. Scatter plots show relationships, line charts show trends, pie charts show proportions.",
        resources: [
          { type: "youtube", title: "Data Visualization Types", url: "https://youtube.com/watch?v=hEWY6kkBdpo" },
          { type: "article", title: "Choosing Chart Types", url: "https://www.storytellingwithdata.com/chart-guide" }
        ],
        topic: "Data Visualization",
        difficulty: "medium",
        company: "Netflix"
      },
      {
        id: "da-q6",
        question: "What does ETL stand for in data engineering?",
        options: [
          "Extract, Transform, Load",
          "Execute, Test, Launch",
          "Encode, Transfer, Link",
          "Export, Translate, List"
        ],
        correct: "Extract, Transform, Load",
        explanation: "ETL is the process of extracting data from sources, transforming it to fit business needs, and loading it into a data warehouse.",
        resources: [
          { type: "youtube", title: "ETL Process Explained", url: "https://youtube.com/watch?v=OW5OgsLpDCQ" },
          { type: "article", title: "ETL vs ELT Guide", url: "https://www.integrate.io/blog/etl-vs-elt/" }
        ],
        topic: "Data Engineering",
        difficulty: "easy",
        company: "Uber"
      },
      {
        id: "da-q7",
        question: "Which measure of central tendency is most affected by outliers?",
        options: ["Mean", "Median", "Mode", "Range"],
        correct: "Mean",
        explanation: "Mean is sensitive to extreme values as it uses all data points. Median uses middle value and is robust to outliers. Mode is the most frequent value.",
        resources: [
          { type: "youtube", title: "Mean, Median, Mode Explained", url: "https://youtube.com/watch?v=h8EYEJ32oQ8" },
          { type: "article", title: "Central Tendency Guide", url: "https://www.statisticshowto.com/probability-and-statistics/statistics-definitions/mean-median-mode/" }
        ],
        topic: "Statistics Basics",
        difficulty: "medium",
        company: "Apple"
      },
      {
        id: "da-q8",
        question: "What is the purpose of a PRIMARY KEY in a database?",
        options: [
          "To speed up queries",
          "To uniquely identify each row",
          "To create relationships",
          "To sort data"
        ],
        correct: "To uniquely identify each row",
        explanation: "PRIMARY KEY uniquely identifies each record and cannot be NULL. It creates a unique index but that's a side effect, not the main purpose.",
        resources: [
          { type: "youtube", title: "Database Keys Explained", url: "https://youtube.com/watch?v=yMYH0zP1m8U" },
          { type: "article", title: "Primary vs Foreign Keys", url: "https://www.guru99.com/difference-between-primary-key-and-foreign-key.html" }
        ],
        topic: "Database Design",
        difficulty: "easy",
        company: "Airbnb"
      },
      {
        id: "da-q9",
        question: "Which type of chart is best for showing trends over time?",
        options: ["Bar chart", "Pie chart", "Line chart", "Histogram"],
        correct: "Line chart",
        explanation: "Line charts excel at showing trends over continuous time periods. Bar charts compare categories, pie charts show proportions, histograms show distributions.",
        resources: [
          { type: "youtube", title: "Time Series Visualization", url: "https://youtube.com/watch?v=r50BKIFKEDQ" },
          { type: "article", title: "Chart Selection Guide", url: "https://chartio.com/learn/charts/how-to-choose-data-visualization/" }
        ],
        topic: "Data Visualization",
        difficulty: "easy",
        company: "LinkedIn"
      },
      {
        id: "da-q10",
        question: "What is the difference between UNION and UNION ALL in SQL?",
        options: [
          "UNION removes duplicates, UNION ALL keeps them",
          "UNION ALL removes duplicates, UNION keeps them",
          "They are exactly the same",
          "UNION is faster than UNION ALL"
        ],
        correct: "UNION removes duplicates, UNION ALL keeps them",
        explanation: "UNION performs DISTINCT operation removing duplicates, making it slower. UNION ALL returns all rows including duplicates and is faster.",
        resources: [
          { type: "youtube", title: "UNION vs UNION ALL", url: "https://youtube.com/watch?v=NvH-vKgvung" },
          { type: "article", title: "SQL Set Operations", url: "https://www.sqlshack.com/sql-union-vs-union-all/" }
        ],
        topic: "SQL Advanced",
        difficulty: "medium",
        company: "Tesla"
      }
    ],
    "dsa-mastery-roadmap": [
      {
        id: "dsa-q1",
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: "O(log n)",
        explanation: "Binary search divides the search space in half each iteration, resulting in logarithmic time complexity. Works only on sorted arrays.",
        resources: [
          { type: "youtube", title: "Binary Search Visualized", url: "https://youtube.com/watch?v=P3YID7liBug" },
          { type: "article", title: "Binary Search Guide", url: "https://www.geeksforgeeks.org/binary-search/" }
        ],
        topic: "Search Algorithms",
        difficulty: "medium",
        company: "Google"
      },
      {
        id: "dsa-q2",
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Stack", "Array", "Tree"],
        correct: "Stack",
        explanation: "Stack follows LIFO - last element added is first removed. Queue uses FIFO (First In First Out). Used in function calls, undo operations.",
        resources: [
          { type: "youtube", title: "Stack Data Structure", url: "https://youtube.com/watch?v=F1F2imiOJfk" },
          { type: "article", title: "Stack Implementation", url: "https://www.programiz.com/dsa/stack" }
        ],
        topic: "Data Structures",
        difficulty: "easy",
        company: "Amazon"
      },
      {
        id: "dsa-q3",
        question: "What is the worst-case time complexity of QuickSort?",
        options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"],
        correct: "O(n²)",
        explanation: "QuickSort worst case is O(n²) when pivot is always smallest/largest element. Average case is O(n log n). Use randomized pivot to avoid worst case.",
        resources: [
          { type: "youtube", title: "QuickSort Algorithm", url: "https://youtube.com/watch?v=Hoixgm4-P4M" },
          { type: "article", title: "QuickSort Analysis", url: "https://www.khanacademy.org/computing/computer-science/algorithms/quick-sort/a/analysis-of-quicksort" }
        ],
        topic: "Sorting Algorithms",
        difficulty: "hard",
        company: "Microsoft"
      },
      {
        id: "dsa-q4",
        question: "Which traversal visits left subtree, root, then right subtree?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correct: "Inorder",
        explanation: "Inorder: Left → Root → Right. Gives sorted order in BST. Preorder: Root → Left → Right. Postorder: Left → Right → Root.",
        resources: [
          { type: "youtube", title: "Tree Traversals Explained", url: "https://youtube.com/watch?v=gm8DUJJhmY4" },
          { type: "article", title: "Binary Tree Traversals", url: "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/" }
        ],
        topic: "Trees",
        difficulty: "medium",
        company: "Meta"
      },
      {
        id: "dsa-q5",
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: "O(n)",
        explanation: "Merge sort needs O(n) auxiliary space for temporary arrays during merge. Time complexity is O(n log n) in all cases.",
        resources: [
          { type: "youtube", title: "Merge Sort Visualized", url: "https://youtube.com/watch?v=4VqmGXwpLqc" },
          { type: "article", title: "Merge Sort Guide", url: "https://www.hackerearth.com/practice/algorithms/sorting/merge-sort/tutorial/" }
        ],
        topic: "Sorting Algorithms",
        difficulty: "medium",
        company: "Apple"
      },
      {
        id: "dsa-q6",
        question: "Which algorithm is used to find shortest path in weighted graphs?",
        options: ["BFS", "DFS", "Dijkstra", "Binary Search"],
        correct: "Dijkstra",
        explanation: "Dijkstra's algorithm finds shortest path in weighted graphs with non-negative weights. BFS works for unweighted graphs. Bellman-Ford handles negative weights.",
        resources: [
          { type: "youtube", title: "Dijkstra's Algorithm", url: "https://youtube.com/watch?v=pVfj6mxhdMw" },
          { type: "article", title: "Graph Algorithms Guide", url: "https://www.programiz.com/dsa/dijkstra-algorithm" }
        ],
        topic: "Graph Algorithms",
        difficulty: "hard",
        company: "Uber"
      },
      {
        id: "dsa-q7",
        question: "What is a complete binary tree?",
        options: [
          "All levels filled except possibly last",
          "All nodes have 2 children",
          "Height is log n",
          "Root has no parent"
        ],
        correct: "All levels filled except possibly last",
        explanation: "Complete binary tree has all levels filled except possibly the last level, which is filled from left to right. Used in heaps.",
        resources: [
          { type: "youtube", title: "Binary Tree Types", url: "https://youtube.com/watch?v=H5JubkIy_p8" },
          { type: "article", title: "Tree Types Explained", url: "https://www.geeksforgeeks.org/types-of-binary-tree/" }
        ],
        topic: "Trees",
        difficulty: "medium",
        company: "Netflix"
      },
      {
        id: "dsa-q8",
        question: "Which data structure is best for implementing LRU cache?",
        options: ["Array", "Stack", "HashMap + Doubly Linked List", "Tree"],
        correct: "HashMap + Doubly Linked List",
        explanation: "HashMap provides O(1) lookup, doubly linked list maintains access order. HashMap stores key-node pairs, list tracks LRU order for O(1) eviction.",
        resources: [
          { type: "youtube", title: "LRU Cache Implementation", url: "https://youtube.com/watch?v=7ABFKPK2hD4" },
          { type: "article", title: "LRU Cache Design", url: "https://leetcode.com/problems/lru-cache/solution/" }
        ],
        topic: "System Design",
        difficulty: "hard",
        company: "Airbnb"
      },
      {
        id: "dsa-q9",
        question: "What is the average time complexity of hash table lookup?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: "O(1)",
        explanation: "Hash tables provide O(1) average lookup via direct indexing. Worst case is O(n) with many collisions. Good hash function is crucial.",
        resources: [
          { type: "youtube", title: "Hash Tables Explained", url: "https://youtube.com/watch?v=shs0KM3wKv8" },
          { type: "article", title: "Hash Table Guide", url: "https://www.cs.usfca.edu/~galles/visualization/OpenHash.html" }
        ],
        topic: "Hash Tables",
        difficulty: "easy",
        company: "LinkedIn"
      },
      {
        id: "dsa-q10",
        question: "Which sorting algorithm is stable and has O(n log n) worst case?",
        options: ["QuickSort", "HeapSort", "MergeSort", "BubbleSort"],
        correct: "MergeSort",
        explanation: "MergeSort is stable (preserves order of equal elements) with O(n log n) worst case. QuickSort and HeapSort are not stable. BubbleSort is O(n²).",
        resources: [
          { type: "youtube", title: "Sorting Algorithms Comparison", url: "https://youtube.com/watch?v=kPRA0W1kECg" },
          { type: "article", title: "Stable vs Unstable Sorts", url: "https://www.geeksforgeeks.org/stable-and-unstable-sorting-algorithms/" }
        ],
        topic: "Sorting Algorithms",
        difficulty: "medium",
        company: "Tesla"
      }
    ],
    "full-stack-web-dev-roadmap": [
      {
        id: "fs-q1",
        question: "What does REST stand for?",
        options: [
          "Representational State Transfer",
          "Remote Execution State Transfer",
          "Resource Execution System Transfer",
          "Real Estate Transfer"
        ],
        correct: "Representational State Transfer",
        explanation: "REST is an architectural style for distributed systems using HTTP methods (GET, POST, PUT, DELETE) with stateless communication and resource-based URLs.",
        resources: [
          { type: "youtube", title: "REST API Tutorial", url: "https://youtube.com/watch?v=-MTSQjw5DrM" },
          { type: "article", title: "REST Principles", url: "https://restfulapi.net/" }
        ],
        topic: "APIs",
        difficulty: "easy",
        company: "Netflix"
      },
      {
        id: "fs-q2",
        question: "Which HTTP method is idempotent?",
        options: ["POST", "PUT", "PATCH", "All of the above"],
        correct: "PUT",
        explanation: "PUT is idempotent - multiple identical requests produce same result. POST creates new resources each time. PATCH can be non-idempotent depending on implementation.",
        resources: [
          { type: "youtube", title: "HTTP Methods Explained", url: "https://youtube.com/watch?v=guYMSP7JVTA" },
          { type: "article", title: "Idempotency in APIs", url: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent" }
        ],
        topic: "HTTP",
        difficulty: "medium",
        company: "Amazon"
      },
      {
        id: "fs-q3",
        question: "What is the Virtual DOM in React?",
        options: [
          "A copy of real DOM in memory",
          "A database for DOM elements",
          "A CSS framework",
          "A server-side rendering tool"
        ],
        correct: "A copy of real DOM in memory",
        explanation: "Virtual DOM is a lightweight copy of the real DOM. React compares changes (diffing) and updates only modified parts, improving performance over direct DOM manipulation.",
        resources: [
          { type: "youtube", title: "Virtual DOM Explained", url: "https://youtube.com/watch?v=BYbgopx44vo" },
          { type: "article", title: "React Reconciliation", url: "https://react.dev/learn/preserving-and-resetting-state" }
        ],
        topic: "React",
        difficulty: "medium",
        company: "Meta"
      },
      {
        id: "fs-q4",
        question: "Which database type is MongoDB?",
        options: ["Relational", "NoSQL Document", "Graph", "Key-Value"],
        correct: "NoSQL Document",
        explanation: "MongoDB is a document database storing data in JSON-like documents. Relational DBs use tables, graph DBs use nodes/edges, key-value DBs use simple pairs.",
        resources: [
          { type: "youtube", title: "MongoDB Crash Course", url: "https://youtube.com/watch?v=-56x56UppqQ" },
          { type: "article", title: "SQL vs NoSQL", url: "https://www.mongodb.com/nosql-explained/nosql-vs-sql" }
        ],
        topic: "Databases",
        difficulty: "easy",
        company: "Google"
      },
      {
        id: "fs-q5",
        question: "What is middleware in Express.js?",
        options: [
          "Functions that execute during request-response cycle",
          "A database connection",
          "A frontend framework",
          "A CSS preprocessor"
        ],
        correct: "Functions that execute during request-response cycle",
        explanation: "Middleware functions have access to req, res objects and next(). They execute sequentially and can modify requests, end responses, or pass to next middleware.",
        resources: [
          { type: "youtube", title: "Express Middleware Tutorial", url: "https://youtube.com/watch?v=lY6icfhap2o" },
          { type: "article", title: "Express Middleware Guide", url: "https://expressjs.com/en/guide/using-middleware.html" }
        ],
        topic: "Node.js/Express",
        difficulty: "medium",
        company: "Uber"
      },
      {
        id: "fs-q6",
        question: "What does CORS stand for?",
        options: [
          "Cross-Origin Resource Sharing",
          "Cross-Origin Request System",
          "Central Origin Resource System",
          "Cross-Object Resource Sharing"
        ],
        correct: "Cross-Origin Resource Sharing",
        explanation: "CORS is a security mechanism allowing servers to specify which origins can access resources. Prevents malicious sites from making unauthorized API calls.",
        resources: [
          { type: "youtube", title: "CORS Explained", url: "https://youtube.com/watch?v=4KHiSt0oLJ0" },
          { type: "article", title: "CORS Tutorial", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" }
        ],
        topic: "Web Security",
        difficulty: "medium",
        company: "Microsoft"
      },
      {
        id: "fs-q7",
        question: "Which CSS property is used for responsive design?",
        options: ["display", "media queries", "position", "float"],
        correct: "media queries",
        explanation: "Media queries apply different styles based on device characteristics (width, height, orientation). Core of responsive design for mobile-first development.",
        resources: [
          { type: "youtube", title: "Responsive Design Tutorial", url: "https://youtube.com/watch?v=srvUrASNj0s" },
          { type: "article", title: "Media Queries Guide", url: "https://css-tricks.com/a-complete-guide-to-css-media-queries/" }
        ],
        topic: "CSS",
        difficulty: "easy",
        company: "Apple"
      },
      {
        id: "fs-q8",
        question: "What is JWT used for?",
        options: [
          "Styling",
          "Authentication",
          "Database queries",
          "File storage"
        ],
        correct: "Authentication",
        explanation: "JSON Web Token (JWT) is a compact, URL-safe token for securely transmitting user information between client and server. Contains header, payload, signature.",
        resources: [
          { type: "youtube", title: "JWT Authentication", url: "https://youtube.com/watch?v=7Q17ubqLfaM" },
          { type: "article", title: "JWT Introduction", url: "https://jwt.io/introduction" }
        ],
        topic: "Authentication",
        difficulty: "medium",
        company: "Airbnb"
      },
      {
        id: "fs-q9",
        question: "What is the purpose of useEffect hook in React?",
        options: [
          "Manage state",
          "Handle side effects",
          "Create components",
          "Style components"
        ],
        correct: "Handle side effects",
        explanation: "useEffect handles side effects like API calls, subscriptions, timers, DOM manipulation. Runs after render. useState manages state, not useEffect.",
        resources: [
          { type: "youtube", title: "useEffect Deep Dive", url: "https://youtube.com/watch?v=0ZJgIjIuY7U" },
          { type: "article", title: "React Hooks Guide", url: "https://react.dev/reference/react/useEffect" }
        ],
        topic: "React Hooks",
        difficulty: "medium",
        company: "LinkedIn"
      },
      {
        id: "fs-q10",
        question: "Which status code indicates successful POST request creation?",
        options: ["200", "201", "204", "301"],
        correct: "201",
        explanation: "201 Created means resource was successfully created. 200 OK for general success, 204 No Content for successful requests with no body, 301 for redirects.",
        resources: [
          { type: "youtube", title: "HTTP Status Codes", url: "https://youtube.com/watch?v=wJa5CTIFj7U" },
          { type: "article", title: "Status Code Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" }
        ],
        topic: "HTTP",
        difficulty: "easy",
        company: "Tesla"
      }
    ]
  }

  return questionBank[roadmapId] || []
}
