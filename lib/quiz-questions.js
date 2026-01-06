export const quizQuestions = {
  "data-analyst-roadmap": [
    {
      id: "da-q1",
      question: "What is the primary difference between RANK() and DENSE_RANK() window functions in SQL?",
      options: [
        "RANK() is faster than DENSE_RANK()",
        "DENSE_RANK() doesn't skip rank numbers after ties, while RANK() does",
        "RANK() only works with integers",
        "DENSE_RANK() requires an ORDER BY clause, RANK() doesn't"
      ],
      correctAnswer: "DENSE_RANK() doesn't skip rank numbers after ties, while RANK() does",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "da-q2",
      question: "In Pandas, what does the .loc[] method do?",
      options: [
        "Selects data by integer position",
        "Selects data by label-based indexing",
        "Removes null values from dataframe",
        "Sorts dataframe by column"
      ],
      correctAnswer: "Selects data by label-based indexing",
      difficulty: "beginner",
      company: "Mid-tier"
    },
    {
      id: "da-q3",
      question: "What is a LEFT JOIN in SQL?",
      options: [
        "Returns only matching rows from both tables",
        "Returns all rows from left table and matching rows from right table",
        "Returns all rows from both tables",
        "Returns only non-matching rows"
      ],
      correctAnswer: "Returns all rows from left table and matching rows from right table",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "da-q4",
      question: "Which Python library is best suited for creating interactive dashboards?",
      options: [
        "Matplotlib",
        "Seaborn",
        "Plotly",
        "NumPy"
      ],
      correctAnswer: "Plotly",
      difficulty: "intermediate",
      company: "Mid-tier"
    },
    {
      id: "da-q5",
      question: "What does the GROUP BY clause do in SQL?",
      options: [
        "Sorts data in ascending order",
        "Filters rows based on conditions",
        "Groups rows that have the same values in specified columns",
        "Joins multiple tables"
      ],
      correctAnswer: "Groups rows that have the same values in specified columns",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "da-q6",
      question: "In data analysis, what is the purpose of normalization?",
      options: [
        "To remove duplicate data",
        "To scale features to a standard range",
        "To delete null values",
        "To create database indexes"
      ],
      correctAnswer: "To scale features to a standard range",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "da-q7",
      question: "What is a subquery in SQL?",
      options: [
        "A query that runs before the main query",
        "A query nested inside another query",
        "A query that only returns one row",
        "A query that updates data"
      ],
      correctAnswer: "A query nested inside another query",
      difficulty: "intermediate",
      company: "All"
    },
    {
      id: "da-q8",
      question: "Which Pandas method is used to handle missing data by filling it with a specific value?",
      options: [
        ".dropna()",
        ".fillna()",
        ".replace()",
        ".isnull()"
      ],
      correctAnswer: ".fillna()",
      difficulty: "beginner",
      company: "Mid-tier"
    },
    {
      id: "da-q9",
      question: "What does the HAVING clause do in SQL?",
      options: [
        "Filters rows before grouping",
        "Filters groups after GROUP BY",
        "Joins two tables",
        "Orders results"
      ],
      correctAnswer: "Filters groups after GROUP BY",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "da-q10",
      question: "In Matplotlib, which function is used to create a bar chart?",
      options: [
        "plt.plot()",
        "plt.bar()",
        "plt.scatter()",
        "plt.hist()"
      ],
      correctAnswer: "plt.bar()",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "da-q11",
      question: "What is the time complexity of searching for an element in a hash table (average case)?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: "O(1)",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "da-q12",
      question: "Which SQL clause is used to remove duplicate rows from result set?",
      options: [
        "UNIQUE",
        "DISTINCT",
        "REMOVE",
        "NO_DUPLICATES"
      ],
      correctAnswer: "DISTINCT",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "da-q13",
      question: "What is the primary use of the CASE statement in SQL?",
      options: [
        "To create conditional logic in queries",
        "To join tables",
        "To create indexes",
        "To delete rows"
      ],
      correctAnswer: "To create conditional logic in queries",
      difficulty: "intermediate",
      company: "Mid-tier"
    },
    {
      id: "da-q14",
      question: "In Python Pandas, what does .merge() do?",
      options: [
        "Concatenates dataframes vertically",
        "Joins dataframes based on common columns",
        "Removes duplicate rows",
        "Sorts dataframe"
      ],
      correctAnswer: "Joins dataframes based on common columns",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "da-q15",
      question: "What is a Primary Key in a database?",
      options: [
        "A column that can contain duplicate values",
        "A unique identifier for each record in a table",
        "A foreign key from another table",
        "An index for faster queries"
      ],
      correctAnswer: "A unique identifier for each record in a table",
      difficulty: "beginner",
      company: "All"
    }
  ],

  "dsa-mastery": [
    {
      id: "dsa-q1",
      question: "What is the time complexity of binary search?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(1)"
      ],
      correctAnswer: "O(log n)",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "dsa-q2",
      question: "Which data structure uses LIFO (Last In First Out)?",
      options: [
        "Queue",
        "Stack",
        "Heap",
        "Tree"
      ],
      correctAnswer: "Stack",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "dsa-q3",
      question: "What is the worst-case time complexity of QuickSort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: "O(n²)",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "dsa-q4",
      question: "In a Binary Search Tree, what property must be satisfied?",
      options: [
        "Left child > Parent > Right child",
        "Left child < Parent < Right child",
        "All nodes must be balanced",
        "Parent must be larger than all children"
      ],
      correctAnswer: "Left child < Parent < Right child",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "dsa-q5",
      question: "What is the space complexity of merge sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)"
      ],
      correctAnswer: "O(n)",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "dsa-q6",
      question: "Which algorithm is used to find the shortest path in a weighted graph?",
      options: [
        "BFS",
        "DFS",
        "Dijkstra's Algorithm",
        "Binary Search"
      ],
      correctAnswer: "Dijkstra's Algorithm",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "dsa-q7",
      question: "What is a hash collision?",
      options: [
        "When two keys hash to the same index",
        "When hash function returns null",
        "When hash table is full",
        "When key doesn't exist"
      ],
      correctAnswer: "When two keys hash to the same index",
      difficulty: "intermediate",
      company: "Mid-tier"
    },
    {
      id: "dsa-q8",
      question: "What is the time complexity of accessing an element in an array by index?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: "O(1)",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "dsa-q9",
      question: "Which traversal visits nodes level by level in a tree?",
      options: [
        "Inorder",
        "Preorder",
        "Postorder",
        "Level-order (BFS)"
      ],
      correctAnswer: "Level-order (BFS)",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "dsa-q10",
      question: "What is dynamic programming?",
      options: [
        "A greedy algorithm approach",
        "An optimization technique using memoization",
        "A sorting algorithm",
        "A graph traversal method"
      ],
      correctAnswer: "An optimization technique using memoization",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "dsa-q11",
      question: "What is the height of a balanced binary tree with n nodes?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(1)"
      ],
      correctAnswer: "O(log n)",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "dsa-q12",
      question: "Which data structure is best for implementing LRU cache?",
      options: [
        "Array",
        "Stack",
        "HashMap + Doubly Linked List",
        "Binary Tree"
      ],
      correctAnswer: "HashMap + Doubly Linked List",
      difficulty: "advanced",
      company: "FAANG"
    },
    {
      id: "dsa-q13",
      question: "What is the time complexity of inserting at the head of a linked list?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)"
      ],
      correctAnswer: "O(1)",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "dsa-q14",
      question: "What is a topological sort used for?",
      options: [
        "Sorting arrays",
        "Finding shortest paths",
        "Ordering vertices in a directed acyclic graph (DAG)",
        "Balancing trees"
      ],
      correctAnswer: "Ordering vertices in a directed acyclic graph (DAG)",
      difficulty: "advanced",
      company: "FAANG"
    },
    {
      id: "dsa-q15",
      question: "Which sorting algorithm is best for nearly sorted data?",
      options: [
        "QuickSort",
        "MergeSort",
        "Insertion Sort",
        "Selection Sort"
      ],
      correctAnswer: "Insertion Sort",
      difficulty: "intermediate",
      company: "Mid-tier"
    }
  ],

  "web-dev-fullstack": [
    {
      id: "web-q1",
      question: "What is the Virtual DOM in React?",
      options: [
        "A direct copy of the real DOM",
        "A lightweight representation of the real DOM",
        "A database for storing DOM elements",
        "A CSS framework"
      ],
      correctAnswer: "A lightweight representation of the real DOM",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q2",
      question: "What does REST stand for?",
      options: [
        "Representational State Transfer",
        "Remote Execution State Transfer",
        "Real-time Execution State Transaction",
        "Resource Execution State Transfer"
      ],
      correctAnswer: "Representational State Transfer",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q3",
      question: "Which HTTP method is idempotent?",
      options: [
        "POST",
        "PUT",
        "PATCH",
        "All of the above"
      ],
      correctAnswer: "PUT",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "web-q4",
      question: "What is middleware in Express.js?",
      options: [
        "A database connector",
        "Functions that execute during request-response cycle",
        "A frontend framework",
        "A CSS preprocessor"
      ],
      correctAnswer: "Functions that execute during request-response cycle",
      difficulty: "intermediate",
      company: "Mid-tier"
    },
    {
      id: "web-q5",
      question: "What is the purpose of useEffect hook in React?",
      options: [
        "To manage state",
        "To handle side effects",
        "To create components",
        "To style components"
      ],
      correctAnswer: "To handle side effects",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q6",
      question: "What is JWT used for?",
      options: [
        "Styling websites",
        "Database queries",
        "Authentication and authorization",
        "Image optimization"
      ],
      correctAnswer: "Authentication and authorization",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "web-q7",
      question: "What is the difference between localStorage and sessionStorage?",
      options: [
        "localStorage persists after browser close, sessionStorage doesn't",
        "sessionStorage is faster",
        "localStorage is more secure",
        "No difference"
      ],
      correctAnswer: "localStorage persists after browser close, sessionStorage doesn't",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q8",
      question: "What is CORS?",
      options: [
        "A CSS framework",
        "Cross-Origin Resource Sharing",
        "A database protocol",
        "A JavaScript library"
      ],
      correctAnswer: "Cross-Origin Resource Sharing",
      difficulty: "intermediate",
      company: "Mid-tier"
    },
    {
      id: "web-q9",
      question: "What does SSR stand for in web development?",
      options: [
        "Server-Side Rendering",
        "Static Site Rendering",
        "Secure Socket Rendering",
        "Session State Rendering"
      ],
      correctAnswer: "Server-Side Rendering",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "web-q10",
      question: "Which HTTP status code indicates a successful request?",
      options: [
        "404",
        "500",
        "200",
        "301"
      ],
      correctAnswer: "200",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q11",
      question: "What is the purpose of Redux?",
      options: [
        "State management",
        "Routing",
        "API calls",
        "CSS styling"
      ],
      correctAnswer: "State management",
      difficulty: "intermediate",
      company: "Mid-tier"
    },
    {
      id: "web-q12",
      question: "What is a Promise in JavaScript?",
      options: [
        "A synchronous operation",
        "An object representing eventual completion of an async operation",
        "A CSS animation",
        "A database query"
      ],
      correctAnswer: "An object representing eventual completion of an async operation",
      difficulty: "intermediate",
      company: "FAANG"
    },
    {
      id: "web-q13",
      question: "What is the box model in CSS?",
      options: [
        "A 3D rendering technique",
        "Margin, border, padding, and content",
        "A JavaScript framework",
        "A database schema"
      ],
      correctAnswer: "Margin, border, padding, and content",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q14",
      question: "What is the purpose of package.json?",
      options: [
        "To store CSS styles",
        "To manage project dependencies and metadata",
        "To configure database",
        "To create HTML templates"
      ],
      correctAnswer: "To manage project dependencies and metadata",
      difficulty: "beginner",
      company: "All"
    },
    {
      id: "web-q15",
      question: "What is the event loop in Node.js?",
      options: [
        "A for loop",
        "Mechanism that handles async operations",
        "A database connection pool",
        "A CSS animation"
      ],
      correctAnswer: "Mechanism that handles async operations",
      difficulty: "advanced",
      company: "FAANG"
    }
  ]
}

// Function to get random 10 questions for a roadmap
export function getQuizQuestions(roadmapId, count = 10) {
  const questions = quizQuestions[roadmapId]

  if (!questions || questions.length === 0) {
    return []
  }

  // Shuffle and pick 10 questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
