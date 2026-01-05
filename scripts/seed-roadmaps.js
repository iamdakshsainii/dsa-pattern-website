import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority'

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!')
  console.error('Please set MONGODB_URI in your .env.local file')
  process.exit(1)
}

const roadmapsData = [
  {
    slug: "data-analyst-roadmap",
    title: "Data Analyst Roadmap",
    description: "Master data analysis from scratch to advanced techniques. Learn SQL, Python, Excel, and data visualization.",
    category: "Data Science",
    difficulty: "Beginner",
    estimatedWeeks: 16,
    icon: "📊",
    color: "#3b82f6",
    prerequisites: ["Basic computer skills", "High school mathematics"],
    outcomes: ["SQL Mastery", "Python for Data Analysis", "Data Visualization", "Statistical Analysis", "Excel Advanced"],
    targetRoles: ["Data Analyst", "Business Analyst", "Data Scientist"],
    published: true,
    order: 1,
    notesAttachments: [
      {
        fileUrl: "https://example.com/sql-cheatsheet.pdf",
        fileName: "SQL Cheatsheet.pdf",
        fileSize: "1.2 MB",
        uploadedAt: new Date()
      },
      {
        fileUrl: "https://example.com/python-basics.pdf",
        fileName: "Python Basics Guide.pdf",
        fileSize: "2.5 MB",
        uploadedAt: new Date()
      }
    ]
  },
  {
    slug: "dsa-mastery",
    title: "DSA Mastery",
    description: "Complete data structures and algorithms roadmap for coding interviews and competitive programming.",
    category: "DSA",
    difficulty: "Intermediate",
    estimatedWeeks: 20,
    icon: "🧠",
    color: "#8b5cf6",
    prerequisites: ["Basic programming in any language", "Understanding of loops and functions"],
    outcomes: ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "System Design", "Interview Ready"],
    targetRoles: ["Software Engineer", "Full Stack Developer", "Competitive Programmer"],
    published: true,
    order: 2
  },
  {
    slug: "web-dev-fullstack",
    title: "Full Stack Web Development",
    description: "Become a full-stack web developer. Learn frontend, backend, databases, and deployment.",
    category: "Web Development",
    difficulty: "Beginner",
    estimatedWeeks: 24,
    icon: "🌐",
    color: "#10b981",
    prerequisites: ["Basic HTML/CSS knowledge", "Interest in web technologies"],
    outcomes: ["React.js", "Node.js", "MongoDB", "REST APIs", "Deployment", "Authentication"],
    targetRoles: ["Full Stack Developer", "Frontend Developer", "Backend Developer"],
    published: true,
    order: 3
  }
]

const dataAnalystNodes = [
  {
    nodeId: "da-node-1",
    roadmapId: "data-analyst-roadmap",
    title: "Introduction to Databases",
    description: "Learn what databases are, types of databases, and why they're essential for data analysis.",
    weekNumber: 1,
    estimatedHours: 6,
    order: 1,
    published: true, // 🎯 CRITICAL FIX
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "da-1-1",
        title: "What is a Database?",
        description: "Understanding the fundamentals of databases and their importance in modern applications",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Tk1t3WKK-ZY",
          article: "https://www.geeksforgeeks.org/what-is-database/",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 15,
        order: 1
      },
      {
        subtopicId: "da-1-2",
        title: "Relational vs Non-Relational Databases",
        description: "Compare SQL and NoSQL databases, understand when to use each",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=E9AgJnsEvG4",
          article: "https://www.mongodb.com/databases/types",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 20,
        order: 2
      },
      {
        subtopicId: "da-1-3",
        title: "Database Management Systems (DBMS)",
        description: "Learn about popular DBMS like MySQL, PostgreSQL, MongoDB",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=FR4QIeZaPeM",
          article: "https://www.ibm.com/topics/database-management-system",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 25,
        order: 3
      }
    ]
  },
  {
    nodeId: "da-node-2",
    roadmapId: "data-analyst-roadmap",
    title: "SQL Fundamentals",
    description: "Master the basics of SQL - the language for interacting with databases.",
    weekNumber: 2,
    estimatedHours: 10,
    order: 2,
    published: true, // 🎯 ADDED
    prerequisites: ["da-node-1"],
    subtopics: [
      {
        subtopicId: "da-2-1",
        title: "SELECT Statement Basics",
        description: "Learn to query data from tables using SELECT",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=9Pzj7Aj25lw",
          article: "https://www.w3schools.com/sql/sql_select.asp",
          practice: "https://sqlzoo.net/wiki/SELECT_basics",
          pdf: null
        },
        estimatedMinutes: 30,
        order: 1
      },
      {
        subtopicId: "da-2-2",
        title: "WHERE Clause and Filtering",
        description: "Filter data using WHERE clause with conditions",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=33dIH7ik0IQ",
          article: "https://www.w3schools.com/sql/sql_where.asp",
          practice: "https://sqlzoo.net/wiki/SELECT_from_WORLD_Tutorial",
          pdf: null
        },
        estimatedMinutes: 25,
        order: 2
      },
      {
        subtopicId: "da-2-3",
        title: "ORDER BY and Sorting",
        description: "Sort query results in ascending or descending order",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=jH-2Qjiv0mU",
          article: "https://www.w3schools.com/sql/sql_orderby.asp",
          practice: "https://www.hackerrank.com/domains/sql",
          pdf: null
        },
        estimatedMinutes: 20,
        order: 3
      },
      {
        subtopicId: "da-2-4",
        title: "Aggregate Functions (COUNT, SUM, AVG)",
        description: "Perform calculations on data using aggregate functions",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=m1KcNV-Zhmc",
          article: "https://www.sqlshack.com/sql-aggregate-functions/",
          practice: "https://www.hackerrank.com/domains/sql",
          pdf: null
        },
        estimatedMinutes: 35,
        order: 4
      }
    ]
  },
  {
    nodeId: "da-node-3",
    roadmapId: "data-analyst-roadmap",
    title: "Intermediate SQL",
    description: "Learn JOINs, subqueries, and more advanced SQL concepts.",
    weekNumber: 3,
    estimatedHours: 12,
    order: 3,
    published: true, // 🎯 ADDED
    prerequisites: ["da-node-2"],
    subtopics: [
      {
        subtopicId: "da-3-1",
        title: "INNER JOIN",
        description: "Combine rows from two or more tables based on a related column",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
          article: "https://www.w3schools.com/sql/sql_join_inner.asp",
          practice: "https://sqlzoo.net/wiki/The_JOIN_operation",
          pdf: null
        },
        estimatedMinutes: 40,
        order: 1
      },
      {
        subtopicId: "da-3-2",
        title: "LEFT, RIGHT, and FULL JOINs",
        description: "Understanding different types of JOINs and when to use them",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=zGSv0VaOtR0",
          article: "https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/",
          practice: "https://www.hackerrank.com/domains/sql",
          pdf: null
        },
        estimatedMinutes: 45,
        order: 2
      },
      {
        subtopicId: "da-3-3",
        title: "Subqueries",
        description: "Write queries within queries for complex data retrieval",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=nJIEIzF7tDw",
          article: "https://www.sqlshack.com/sql-subquery-basics/",
          practice: "https://leetcode.com/problemset/database/",
          pdf: null
        },
        estimatedMinutes: 50,
        order: 3
      },
      {
        subtopicId: "da-3-4",
        title: "GROUP BY and HAVING",
        description: "Group data and filter groups using HAVING clause",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=mWWVrPyVkjM",
          article: "https://www.w3schools.com/sql/sql_groupby.asp",
          practice: "https://www.hackerrank.com/domains/sql",
          pdf: null
        },
        estimatedMinutes: 40,
        order: 4
      }
    ]
  },
  {
    nodeId: "da-node-4",
    roadmapId: "data-analyst-roadmap",
    title: "Python Basics for Data Analysis",
    description: "Learn Python fundamentals needed for data analysis work.",
    weekNumber: 4,
    estimatedHours: 8,
    order: 4,
    published: true, // 🎯 ADDED
    prerequisites: ["da-node-1"],
    subtopics: [
      {
        subtopicId: "da-4-1",
        title: "Python Setup and Environment",
        description: "Install Python, set up Jupyter Notebook, understand virtual environments",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=YYXdXT2l-Gg",
          article: "https://realpython.com/installing-python/",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 30,
        order: 1
      },
      {
        subtopicId: "da-4-2",
        title: "Variables, Data Types, and Operators",
        description: "Learn Python basics: strings, numbers, booleans, lists, dictionaries",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
          article: "https://www.w3schools.com/python/python_datatypes.asp",
          practice: "https://www.hackerrank.com/domains/python",
          pdf: null
        },
        estimatedMinutes: 45,
        order: 2
      },
      {
        subtopicId: "da-4-3",
        title: "Control Flow (if/else, loops)",
        description: "Master conditionals and loops for data processing",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=PqFKRqpHrjw",
          article: "https://realpython.com/python-conditional-statements/",
          practice: "https://www.codewars.com/kata/search/python",
          pdf: null
        },
        estimatedMinutes: 40,
        order: 3
      },
      {
        subtopicId: "da-4-4",
        title: "Functions and Modules",
        description: "Write reusable code with functions and import modules",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
          article: "https://realpython.com/defining-your-own-python-function/",
          practice: "https://exercism.org/tracks/python",
          pdf: null
        },
        estimatedMinutes: 50,
        order: 4
      }
    ]
  },
  {
    nodeId: "da-node-5",
    roadmapId: "data-analyst-roadmap",
    title: "Pandas Library",
    description: "Master Pandas - the most important Python library for data analysis.",
    weekNumber: 5,
    estimatedHours: 14,
    order: 5,
    published: true, // 🎯 ADDED
    prerequisites: ["da-node-4"],
    subtopics: [
      {
        subtopicId: "da-5-1",
        title: "Introduction to Pandas",
        description: "What is Pandas and why it's essential for data analysis",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=vmEHCJofslg",
          article: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/01_table_oriented.html",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 30,
        order: 1
      },
      {
        subtopicId: "da-5-2",
        title: "DataFrames and Series",
        description: "Understand the core data structures in Pandas",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=e60ItwlZTKM",
          article: "https://pandas.pydata.org/docs/user_guide/dsintro.html",
          practice: "https://www.kaggle.com/learn/pandas",
          pdf: null
        },
        estimatedMinutes: 50,
        order: 2
      },
      {
        subtopicId: "da-5-3",
        title: "Reading and Writing Data",
        description: "Load CSV, Excel, JSON files into Pandas and save results",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Xi52tx6phRU",
          article: "https://realpython.com/pandas-read-write-files/",
          practice: "https://www.kaggle.com/datasets",
          pdf: null
        },
        estimatedMinutes: 40,
        order: 3
      },
      {
        subtopicId: "da-5-4",
        title: "Data Selection and Filtering",
        description: "Select, filter, and slice data using loc, iloc, and boolean indexing",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=xvpNA7bC8cs",
          article: "https://pandas.pydata.org/docs/user_guide/indexing.html",
          practice: "https://www.w3resource.com/python-exercises/pandas/index.php",
          pdf: null
        },
        estimatedMinutes: 60,
        order: 4
      },
      {
        subtopicId: "da-5-5",
        title: "Data Cleaning and Handling Missing Values",
        description: "Deal with null values, duplicates, and data quality issues",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=PcvsOaixUh8",
          article: "https://realpython.com/python-data-cleaning-numpy-pandas/",
          practice: "https://www.kaggle.com/learn/data-cleaning",
          pdf: null
        },
        estimatedMinutes: 70,
        order: 5
      }
    ]
  },
  {
    nodeId: "da-node-6",
    roadmapId: "data-analyst-roadmap",
    title: "Data Visualization with Matplotlib",
    description: "Create compelling visualizations to communicate insights.",
    weekNumber: 6,
    estimatedHours: 10,
    order: 6,
    published: true, // 🎯 ADDED
    prerequisites: ["da-node-5"],
    subtopics: [
      {
        subtopicId: "da-6-1",
        title: "Introduction to Matplotlib",
        description: "Setup and basic plotting with Matplotlib",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=DAQNHzOcO5A",
          article: "https://matplotlib.org/stable/tutorials/introductory/pyplot.html",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 30,
        order: 1
      },
      {
        subtopicId: "da-6-2",
        title: "Line Charts and Scatter Plots",
        description: "Visualize trends and relationships in data",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=nKxLfUrkLE8",
          article: "https://realpython.com/python-matplotlib-guide/",
          practice: "https://www.kaggle.com/learn/data-visualization",
          pdf: null
        },
        estimatedMinutes: 40,
        order: 2
      },
      {
        subtopicId: "da-6-3",
        title: "Bar Charts and Histograms",
        description: "Display categorical data and distributions",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=YEdscCNBfqc",
          article: "https://www.geeksforgeeks.org/matplotlib-tutorial/",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 35,
        order: 3
      },
      {
        subtopicId: "da-6-4",
        title: "Customizing Plots",
        description: "Add labels, legends, colors, and styling to make professional charts",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=UO98lJQ3QGI",
          article: "https://matplotlib.org/stable/tutorials/introductory/customizing.html",
          practice: null,
          pdf: null
        },
        estimatedMinutes: 45,
        order: 4
      }
    ]
  }
]

const dsaMasteryNodes = [
  {
    nodeId: "dsa-node-1",
    roadmapId: "dsa-mastery",
    title: "Arrays and Strings Fundamentals",
    description: "Master the basics of arrays and string manipulation.",
    weekNumber: 1,
    estimatedHours: 8,
    order: 1,
    published: true, // 🎯 ADDED
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "dsa-1-1",
        title: "Array Basics and Operations",
        description: "Understanding arrays, indexing, and basic operations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=55l-aZ7_F24",
          article: "https://www.geeksforgeeks.org/array-data-structure/",
          practice: "https://leetcode.com/tag/array/",
          pdf: null
        },
        estimatedMinutes: 45,
        order: 1
      },
      {
        subtopicId: "dsa-1-2",
        title: "Two Pointer Technique",
        description: "Solve array problems efficiently using two pointers",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=On03HWe2tZM",
          article: "https://www.geeksforgeeks.org/two-pointers-technique/",
          practice: "https://leetcode.com/tag/two-pointers/",
          pdf: null
        },
        estimatedMinutes: 50,
        order: 2
      },
      {
        subtopicId: "dsa-1-3",
        title: "String Manipulation",
        description: "Common string operations and pattern matching",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=qQ8vS2btsxI",
          article: "https://www.geeksforgeeks.org/string-data-structure/",
          practice: "https://leetcode.com/tag/string/",
          pdf: null
        },
        estimatedMinutes: 40,
        order: 3
      }
    ]
  },
  {
    nodeId: "dsa-node-2",
    roadmapId: "dsa-mastery",
    title: "Linked Lists",
    description: "Learn linked list concepts and common interview problems.",
    weekNumber: 2,
    estimatedHours: 10,
    order: 2,
    published: true, // 🎯 ADDED
    prerequisites: ["dsa-node-1"],
    subtopics: [
      {
        subtopicId: "dsa-2-1",
        title: "Singly Linked Lists",
        description: "Implementation and basic operations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=R9PTBwOzceo",
          article: "https://www.geeksforgeeks.org/data-structures/linked-list/",
          practice: "https://leetcode.com/tag/linked-list/",
          pdf: null
        },
        estimatedMinutes: 60,
        order: 1
      },
      {
        subtopicId: "dsa-2-2",
        title: "Doubly Linked Lists",
        description: "Two-way traversal and operations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=8kptHdreaTA",
          article: "https://www.geeksforgeeks.org/doubly-linked-list/",
          practice: "https://leetcode.com/tag/linked-list/",
          pdf: null
        },
        estimatedMinutes: 50,
        order: 2
      },
      {
        subtopicId: "dsa-2-3",
        title: "Fast and Slow Pointer",
        description: "Detect cycles and find middle elements",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=gBTe7lFR3vc",
          article: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
          practice: "https://leetcode.com/problems/linked-list-cycle/",
          pdf: null
        },
        estimatedMinutes: 45,
        order: 3
      }
    ]
  }
]

const webDevNodes = [
  {
    nodeId: "web-node-1",
    roadmapId: "web-dev-fullstack",
    title: "HTML & CSS Fundamentals",
    description: "Build the foundation of web development with HTML and CSS.",
    weekNumber: 1,
    estimatedHours: 12,
    order: 1,
    published: true, // 🎯 ADDED
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "web-1-1",
        title: "HTML Basics",
        description: "Learn HTML tags, structure, and semantic markup",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=UB1O30fR-EE",
          article: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML",
          practice: "https://www.freecodecamp.org/learn/responsive-web-design/",
          pdf: null
        },
        estimatedMinutes: 90,
        order: 1
      },
      {
        subtopicId: "web-1-2",
        title: "CSS Styling",
        description: "Style web pages with colors, fonts, and layouts",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
          article: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
          practice: "https://cssbattle.dev/",
          pdf: null
        },
        estimatedMinutes: 120,
        order: 2
      },
      {
        subtopicId: "web-1-3",
        title: "Flexbox and Grid",
        description: "Modern CSS layout techniques",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
          article: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
          practice: "https://flexboxfroggy.com/",
          pdf: null
        },
        estimatedMinutes: 80,
        order: 3
      }
    ]
  }
]

async function seedRoadmaps() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('dsa_patterns')

    console.log('Clearing existing roadmap data...')
    await db.collection('roadmaps').deleteMany({})
    await db.collection('roadmap_nodes').deleteMany({})

    console.log('Inserting roadmaps...')
    const roadmapsResult = await db.collection('roadmaps').insertMany(roadmapsData)
    console.log(`✓ Inserted ${roadmapsResult.insertedCount} roadmaps`)

    console.log('Inserting nodes...')
    const allNodes = [...dataAnalystNodes, ...dsaMasteryNodes, ...webDevNodes]

    const nodesResult = await db.collection('roadmap_nodes').insertMany(allNodes)
    console.log(`✓ Inserted ${nodesResult.insertedCount} nodes`)

    console.log('\n=== Seed Summary ===')
    console.log(`Roadmaps: ${roadmapsResult.insertedCount}`)
    console.log(`Nodes: ${nodesResult.insertedCount}`)
    console.log(`Total Subtopics: ${allNodes.reduce((sum, n) => sum + (n.subtopics?.length || 0), 0)}`)

    console.log('\n✅ Seed completed successfully!')

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedRoadmaps()
