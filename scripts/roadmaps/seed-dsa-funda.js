import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const dsaFundamentalsComplete = [
  // ==================== WEEK 1 ====================
  {
    nodeId: "dsaf-w1-node1",
    roadmapId: "dsa-fundamentals-y1",
    title: "Introduction to Arrays",
    description:
      "Learn array basics, traversal techniques, and simple operations for beginners.",
    weekNumber: 1,
    estimatedHours: 6,
    order: 1,
    published: true,
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "dsaf-w1-1-1",
        title: "What are Arrays?",
        description:
          "Understanding arrays as a collection of elements stored in contiguous memory locations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=55l-aZ7_F24",
          article:
            "https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 1,
      },
      {
        subtopicId: "dsaf-w1-1-2",
        title: "Array Declaration and Initialization",
        description: "How to create and initialize arrays in C/C++",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=AT14lCXuMKI",
          article: "https://www.programiz.com/cpp-programming/arrays",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 2,
      },
      {
        subtopicId: "dsaf-w1-1-3",
        title: "Accessing Array Elements (Indexing)",
        description:
          "Learn about zero-based indexing and how to access elements",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=rL8X2mlNHPM",
          article: "https://www.geeksforgeeks.org/array-data-structure/",
          practice: "https://www.hackerrank.com/challenges/arrays-ds/problem",
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 3,
      },
      {
        subtopicId: "dsaf-w1-1-4",
        title: "Array Traversal (Loop Through Arrays)",
        description: "Using for loops to iterate through array elements",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=qQ8vS2btsxI",
          article:
            "https://www.geeksforgeeks.org/c-program-to-traverse-an-array/",
          practice: "https://leetcode.com/problems/running-sum-of-1d-array/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 4,
      },
      {
        subtopicId: "dsaf-w1-1-5",
        title: "Finding Maximum and Minimum in Arrays",
        description: "Simple problem: Find the largest and smallest element",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=aYqYMIqZx5s",
          article:
            "https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/",
          practice: "https://leetcode.com/problems/maximum-subarray/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w1-node2",
    roadmapId: "dsa-fundamentals-y1",
    title: "Basic String Operations",
    description:
      "Introduction to strings, character arrays, and basic string manipulation.",
    weekNumber: 1,
    estimatedHours: 5,
    order: 2,
    published: true,
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "dsaf-w1-2-1",
        title: "What are Strings?",
        description:
          "Understanding strings as character arrays with null terminator",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=V09NfTr6PLc",
          article: "https://www.geeksforgeeks.org/strings-in-c/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 1,
      },
      {
        subtopicId: "dsaf-w1-2-2",
        title: "String Declaration and Input/Output",
        description:
          "How to declare strings and take input using cin, scanf, getline",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=h3VCQjyaHfk",
          article: "https://www.programiz.com/cpp-programming/strings",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 2,
      },
      {
        subtopicId: "dsaf-w1-2-3",
        title: "String Length and Traversal",
        description:
          "Finding string length using strlen() and iterating through characters",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=qQ8vS2btsxI",
          article: "https://www.geeksforgeeks.org/strlen-function-in-c/",
          practice: "https://leetcode.com/problems/length-of-last-word/",
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 3,
      },
      {
        subtopicId: "dsaf-w1-2-4",
        title: "String Comparison (strcmp)",
        description: "Comparing strings lexicographically",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=bZkWxPsEoFc",
          article: "https://www.geeksforgeeks.org/strcmp-in-c/",
          practice:
            "https://www.hackerrank.com/challenges/string-compare/problem",
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 4,
      },
      {
        subtopicId: "dsaf-w1-2-5",
        title: "Reversing a String",
        description: "Simple problem: Reverse a given string",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=poGEVboh9Rw",
          article:
            "https://www.geeksforgeeks.org/reverse-a-string-in-c-cpp-different-methods/",
          practice: "https://leetcode.com/problems/reverse-string/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w1-node3",
    roadmapId: "dsa-fundamentals-y1",
    title: "Practice Problems - Week 1",
    description:
      "Solve beginner-friendly problems on arrays and strings to build confidence.",
    weekNumber: 1,
    estimatedHours: 4,
    order: 3,
    published: true,
    prerequisites: ["dsaf-w1-node1", "dsaf-w1-node2"],
    subtopics: [
      {
        subtopicId: "dsaf-w1-3-1",
        title: "Sum of Array Elements",
        description:
          "Write a program to find the sum of all elements in an array",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=SRDqOykCEYs",
          article:
            "https://www.geeksforgeeks.org/program-find-sum-elements-given-array/",
          practice: "https://leetcode.com/problems/running-sum-of-1d-array/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 1,
      },
      {
        subtopicId: "dsaf-w1-3-2",
        title: "Count Vowels in a String",
        description:
          "Count the number of vowels (a, e, i, o, u) in a given string",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=BsPqytR8mNE",
          article:
            "https://www.geeksforgeeks.org/program-count-vowels-string-iterative-recursive/",
          practice:
            "https://www.hackerrank.com/challenges/count-vowels/problem",
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 2,
      },
      {
        subtopicId: "dsaf-w1-3-3",
        title: "Check if Array is Sorted",
        description: "Determine if an array is sorted in ascending order",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=37E9ckMDdTk",
          article:
            "https://www.geeksforgeeks.org/program-check-array-sorted-not-iterative-recursive/",
          practice:
            "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 3,
      },
      {
        subtopicId: "dsaf-w1-3-4",
        title: "Palindrome Check",
        description: "Check if a string reads the same forwards and backwards",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=fXqPCLLveI8",
          article:
            "https://www.geeksforgeeks.org/c-program-check-given-string-palindrome/",
          practice: "https://leetcode.com/problems/valid-palindrome/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 4,
      },
      {
        subtopicId: "dsaf-w1-3-5",
        title: "Find Second Largest Element",
        description:
          "Find the second largest element in an array without sorting",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=37E9ckMDdTk",
          article:
            "https://www.geeksforgeeks.org/find-second-largest-element-array/",
          practice: "https://leetcode.com/problems/third-maximum-number/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ==================== WEEK 2 ====================
  {
    nodeId: "dsaf-w2-node1",
    roadmapId: "dsa-fundamentals-y1",
    title: "Searching Algorithms - Linear Search",
    description:
      "Learn the simplest searching algorithm and understand time complexity basics.",
    weekNumber: 2,
    estimatedHours: 5,
    order: 4,
    published: true,
    prerequisites: ["dsaf-w1-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w2-1-1",
        title: "What is Searching?",
        description:
          "Understanding the concept of searching in data structures",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=TwsgCHYmbbA",
          article: "https://www.geeksforgeeks.org/searching-algorithms/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 15,
        order: 1,
      },
      {
        subtopicId: "dsaf-w2-1-2",
        title: "Linear Search Algorithm",
        description:
          "Search for an element by checking every element one by one",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=246V51AWwZM",
          article: "https://www.geeksforgeeks.org/linear-search/",
          practice: "https://leetcode.com/problems/search-insert-position/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 2,
      },
      {
        subtopicId: "dsaf-w2-1-3",
        title: "Time Complexity - Big O Notation Basics",
        description:
          "Introduction to analyzing algorithm efficiency (O(n) for linear search)",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=D6xkbGLQesk",
          article:
            "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 3,
      },
      {
        subtopicId: "dsaf-w2-1-4",
        title: "Linear Search Implementation",
        description: "Code linear search in C/C++ with examples",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=246V51AWwZM",
          article: "https://www.programiz.com/dsa/linear-search",
          practice:
            "https://www.hackerrank.com/challenges/sparse-arrays/problem",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 4,
      },
      {
        subtopicId: "dsaf-w2-1-5",
        title: "Practice: Search in Rotated Array",
        description: "Apply linear search to solve variations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=QfPwlr8W3bM",
          article:
            "https://www.geeksforgeeks.org/search-an-element-in-a-rotated-sorted-array/",
          practice:
            "https://leetcode.com/problems/search-in-rotated-sorted-array/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w2-node2",
    roadmapId: "dsa-fundamentals-y1",
    title: "Binary Search - Efficient Searching",
    description:
      "Master binary search - the most important searching algorithm for sorted arrays.",
    weekNumber: 2,
    estimatedHours: 6,
    order: 5,
    published: true,
    prerequisites: ["dsaf-w2-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w2-2-1",
        title: "Binary Search Concept",
        description: "Divide and conquer approach to search in sorted arrays",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=P3YID7liBug",
          article: "https://www.geeksforgeeks.org/binary-search/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 1,
      },
      {
        subtopicId: "dsaf-w2-2-2",
        title: "Binary Search Implementation (Iterative)",
        description: "Code binary search using loops",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=GU7DpgHINWQ",
          article: "https://www.programiz.com/dsa/binary-search",
          practice: "https://leetcode.com/problems/binary-search/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 2,
      },
      {
        subtopicId: "dsaf-w2-2-3",
        title: "Binary Search Implementation (Recursive)",
        description: "Recursive approach to binary search",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=uEUXGcc2VXM",
          article: "https://www.geeksforgeeks.org/binary-search/",
          practice: "https://leetcode.com/problems/binary-search/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 3,
      },
      {
        subtopicId: "dsaf-w2-2-4",
        title: "Time Complexity: O(log n)",
        description:
          "Understanding why binary search is faster than linear search",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=P3YID7liBug",
          article:
            "https://www.geeksforgeeks.org/time-complexity-and-space-complexity/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 4,
      },
      {
        subtopicId: "dsaf-w2-2-5",
        title: "Binary Search Problems",
        description:
          "Practice problems: First and last occurrence, sqrt(x), peak element",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=hjR1IYVx9lY",
          article: "https://www.geeksforgeeks.org/binary-search/",
          practice:
            "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
          pdf: null,
        },
        estimatedMinutes: 50,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w2-node3",
    roadmapId: "dsa-fundamentals-y1",
    title: "Practice Problems - Week 2",
    description: "Solidify searching concepts with hands-on practice.",
    weekNumber: 2,
    estimatedHours: 4,
    order: 6,
    published: true,
    prerequisites: ["dsaf-w2-node1", "dsaf-w2-node2"],
    subtopics: [
      {
        subtopicId: "dsaf-w2-3-1",
        title: "Find Peak Element",
        description: "Use binary search to find a peak in an unsorted array",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=kMzJy9es7Hc",
          article:
            "https://www.geeksforgeeks.org/find-a-peak-in-a-given-array/",
          practice: "https://leetcode.com/problems/find-peak-element/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 1,
      },
      {
        subtopicId: "dsaf-w2-3-2",
        title: "Square Root Using Binary Search",
        description: "Find the square root of a number without using sqrt()",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=WjpswYrS2nY",
          article: "https://www.geeksforgeeks.org/square-root-of-an-integer/",
          practice: "https://leetcode.com/problems/sqrtx/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 2,
      },
      {
        subtopicId: "dsaf-w2-3-3",
        title: "Count Occurrences in Sorted Array",
        description:
          "Count how many times a number appears using binary search",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=pLT_9jwaPLs",
          article:
            "https://www.geeksforgeeks.org/count-number-of-occurrences-or-frequency-in-a-sorted-array/",
          practice:
            "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 3,
      },
      {
        subtopicId: "dsaf-w2-3-4",
        title: "Search in 2D Matrix",
        description: "Apply binary search concepts to 2D arrays",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=ZYpYur0znng",
          article:
            "https://www.geeksforgeeks.org/search-in-row-wise-and-column-wise-sorted-matrix/",
          practice: "https://leetcode.com/problems/search-a-2d-matrix/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 4,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ==================== WEEK 3 ====================
  {
    nodeId: "dsaf-w3-node1",
    roadmapId: "dsa-fundamentals-y1",
    title: "Sorting Algorithms - Bubble Sort",
    description:
      "Learn your first sorting algorithm with step-by-step visualization.",
    weekNumber: 3,
    estimatedHours: 5,
    order: 7,
    published: true,
    prerequisites: ["dsaf-w1-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w3-1-1",
        title: "What is Sorting?",
        description:
          "Understanding why we need to sort data and different sorting techniques",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=kPRA0W1kECg",
          article: "https://www.geeksforgeeks.org/sorting-algorithms/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 1,
      },
      {
        subtopicId: "dsaf-w3-1-2",
        title: "Bubble Sort Algorithm",
        description:
          "Repeatedly swap adjacent elements if they're in wrong order",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=xli_FI7CuzA",
          article: "https://www.geeksforgeeks.org/bubble-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 2,
      },
      {
        subtopicId: "dsaf-w3-1-3",
        title: "Bubble Sort Implementation",
        description: "Code bubble sort in C/C++ with optimization",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Jdtq5uKz-w4",
          article: "https://www.programiz.com/dsa/bubble-sort",
          practice:
            "https://www.hackerrank.com/challenges/insertionsort1/problem",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 3,
      },
      {
        subtopicId: "dsaf-w3-1-4",
        title: "Time Complexity Analysis",
        description: "Understanding best, average, worst case: O(n²)",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=xli_FI7CuzA",
          article: "https://www.geeksforgeeks.org/bubble-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 4,
      },
      {
        subtopicId: "dsaf-w3-1-5",
        title: "Optimized Bubble Sort",
        description: "Add flag to detect if array is already sorted",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=nmhjrI-aW5o",
          article: "https://www.geeksforgeeks.org/bubble-sort/",
          practice: "https://leetcode.com/problems/sort-an-array/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w3-node2",
    roadmapId: "dsa-fundamentals-y1",
    title: "Selection Sort",
    description:
      "Learn selection sort - finding minimum and placing it at the beginning.",
    weekNumber: 3,
    estimatedHours: 5,
    order: 8,
    published: true,
    prerequisites: ["dsaf-w3-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w3-2-1",
        title: "Selection Sort Concept",
        description:
          "Select the smallest element and swap with first position, repeat",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=g-PGLbMth_g",
          article: "https://www.geeksforgeeks.org/selection-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 1,
      },
      {
        subtopicId: "dsaf-w3-2-2",
        title: "Selection Sort Implementation",
        description: "Code selection sort step by step",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=xWBP4lzkoyM",
          article: "https://www.programiz.com/dsa/selection-sort",
          practice:
            "https://www.hackerrank.com/challenges/correctness-invariant/problem",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 2,
      },
      {
        subtopicId: "dsaf-w3-2-3",
        title: "Comparison: Bubble vs Selection Sort",
        description: "When to use which algorithm and their differences",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Nd4SCCIHFWk",
          article:
            "https://www.geeksforgeeks.org/comparison-among-bubble-sort-selection-sort-and-insertion-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 3,
      },
      {
        subtopicId: "dsaf-w3-2-4",
        title: "Selection Sort Time Complexity",
        description: "Analyzing O(n²) in all cases",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=g-PGLbMth_g",
          article: "https://www.geeksforgeeks.org/selection-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 4,
      },
      {
        subtopicId: "dsaf-w3-2-5",
        title: "Practice Selection Sort Problems",
        description: "Implement and solve variations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=xWBP4lzkoyM",
          article: "https://www.geeksforgeeks.org/selection-sort/",
          practice: "https://leetcode.com/problems/sort-an-array/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w3-node3",
    roadmapId: "dsa-fundamentals-y1",
    title: "Insertion Sort",
    description:
      "Master insertion sort - build sorted array one element at a time.",
    weekNumber: 3,
    estimatedHours: 5,
    order: 9,
    published: true,
    prerequisites: ["dsaf-w3-node2"],
    subtopics: [
      {
        subtopicId: "dsaf-w3-3-1",
        title: "Insertion Sort Algorithm",
        description:
          "Insert elements into their correct position in sorted portion",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=JU767SDMDvA",
          article: "https://www.geeksforgeeks.org/insertion-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 1,
      },
      {
        subtopicId: "dsaf-w3-3-2",
        title: "Insertion Sort Implementation",
        description: "Code insertion sort with detailed walkthrough",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=nKzEJWbkPbQ",
          article: "https://www.programiz.com/dsa/insertion-sort",
          practice:
            "https://www.hackerrank.com/challenges/insertionsort2/problem",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 2,
      },
      {
        subtopicId: "dsaf-w3-3-3",
        title: "When Insertion Sort is Best",
        description: "Best for small or nearly sorted arrays - O(n) best case",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=JU767SDMDvA",
          article: "https://www.geeksforgeeks.org/insertion-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 3,
      },
      {
        subtopicId: "dsaf-w3-3-4",
        title: "Stable vs Unstable Sorting",
        description: "Understanding stability in sorting algorithms",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=KpXOhKXw0DU",
          article:
            "https://www.geeksforgeeks.org/stable-and-unstable-sorting-algorithms/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 4,
      },
      {
        subtopicId: "dsaf-w3-3-5",
        title: "Sorting Comparison Practice",
        description: "Solve problems using all three sorts you've learned",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=kPRA0W1kECg",
          article: "https://www.geeksforgeeks.org/sorting-algorithms/",
          practice: "https://leetcode.com/problems/sort-colors/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ==================== WEEK 4 ====================
  {
    nodeId: "dsaf-w4-node1",
    roadmapId: "dsa-fundamentals-y1",
    title: "Introduction to Recursion",
    description:
      "Understand recursion - a function calling itself to solve problems.",
    weekNumber: 4,
    estimatedHours: 6,
    order: 10,
    published: true,
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "dsaf-w4-1-1",
        title: "What is Recursion?",
        description: "Understanding the concept of a function calling itself",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=IJDJ0kBx2LM",
          article:
            "https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 1,
      },
      {
        subtopicId: "dsaf-w4-1-2",
        title: "Base Case and Recursive Case",
        description:
          "Every recursion needs a stopping condition and a recursive step",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=kepBmgvWNDw",
          article: "https://www.geeksforgeeks.org/recursion/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 2,
      },
      {
        subtopicId: "dsaf-w4-1-3",
        title: "Factorial Using Recursion",
        description: "Classic example: Calculate n! = n * (n-1)!",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=yBWlPte6FhA",
          article:
            "https://www.geeksforgeeks.org/program-for-factorial-of-a-number/",
          practice:
            "https://www.hackerrank.com/challenges/functional-programming-warmups-in-recursion---factorial/problem",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 3,
      },
      {
        subtopicId: "dsaf-w4-1-4",
        title: "Fibonacci Series with Recursion",
        description: "Generate Fibonacci numbers: fib(n) = fib(n-1) + fib(n-2)",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=yBWlPte6FhA",
          article:
            "https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/",
          practice: "https://leetcode.com/problems/fibonacci-number/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 4,
      },
      {
        subtopicId: "dsaf-w4-1-5",
        title: "Recursion Call Stack",
        description: "Visualizing how recursion works using the call stack",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=6oDQaB2one8",
          article: "https://www.geeksforgeeks.org/recursion/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w4-node2",
    roadmapId: "dsa-fundamentals-y1",
    title: "Recursion Practice Problems",
    description: "Build recursion muscle memory with classic problems.",
    weekNumber: 4,
    estimatedHours: 6,
    order: 11,
    published: true,
    prerequisites: ["dsaf-w4-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w4-2-1",
        title: "Sum of N Natural Numbers",
        description: "Calculate 1 + 2 + 3 + ... + n using recursion",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=M2uO2nMT0Bk",
          article:
            "https://www.geeksforgeeks.org/program-find-sum-first-n-natural-numbers/",
          practice:
            "https://www.hackerrank.com/challenges/functional-programming-warmups-in-recursion---gcd/problem",
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 1,
      },
      {
        subtopicId: "dsaf-w4-2-2",
        title: "Power Function (x^n)",
        description:
          "Calculate power using recursion: pow(x, n) = x * pow(x, n-1)",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=wAyrtLAeWvI",
          article:
            "https://www.geeksforgeeks.org/write-a-c-program-to-calculate-powxn/",
          practice: "https://leetcode.com/problems/powx-n/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 2,
      },
      {
        subtopicId: "dsaf-w4-2-3",
        title: "Print Array Using Recursion",
        description: "Traverse and print array elements recursively",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=M2uO2nMT0Bk",
          article: "https://www.geeksforgeeks.org/print-array-using-recursion/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 3,
      },
      {
        subtopicId: "dsaf-w4-2-4",
        title: "Check Palindrome with Recursion",
        description: "Verify if string is palindrome using recursive approach",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Y5XMqpxZE6o",
          article:
            "https://www.geeksforgeeks.org/recursive-function-check-string-palindrome/",
          practice: "https://leetcode.com/problems/valid-palindrome/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 4,
      },
      {
        subtopicId: "dsaf-w4-2-5",
        title: "Tower of Hanoi",
        description: "Classic recursion puzzle - move disks between rods",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=YstLjLCGmgg",
          article:
            "https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/",
          practice:
            "https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/",
          pdf: null,
        },
        estimatedMinutes: 45,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w4-node3",
    roadmapId: "dsa-fundamentals-y1",
    title: "Merge Sort - Divide and Conquer",
    description:
      "Learn your first efficient sorting algorithm using recursion.",
    weekNumber: 4,
    estimatedHours: 5,
    order: 12,
    published: true,
    prerequisites: ["dsaf-w4-node1", "dsaf-w3-node3"],
    subtopics: [
      {
        subtopicId: "dsaf-w4-3-1",
        title: "Divide and Conquer Paradigm",
        description:
          "Break problem into smaller subproblems, solve, then combine",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=JSceec-wEyw",
          article:
            "https://www.geeksforgeeks.org/divide-and-conquer-algorithm-introduction/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 1,
      },
      {
        subtopicId: "dsaf-w4-3-2",
        title: "Merge Sort Algorithm",
        description: "Recursively divide array, then merge sorted halves",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=4VqmGXwpLqc",
          article: "https://www.geeksforgeeks.org/merge-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 2,
      },
      {
        subtopicId: "dsaf-w4-3-3",
        title: "Merge Sort Implementation",
        description: "Code merge sort with merge function",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=mB5HXBb_HY8",
          article: "https://www.programiz.com/dsa/merge-sort",
          practice: "https://leetcode.com/problems/sort-an-array/",
          pdf: null,
        },
        estimatedMinutes: 45,
        order: 3,
      },
      {
        subtopicId: "dsaf-w4-3-4",
        title: "Time Complexity: O(n log n)",
        description:
          "Understanding why merge sort is faster than O(n²) algorithms",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=4VqmGXwpLqc",
          article: "https://www.geeksforgeeks.org/merge-sort/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 4,
      },
      {
        subtopicId: "dsaf-w4-3-5",
        title: "Merge Sort Practice",
        description: "Apply merge sort to solve problems",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=mB5HXBb_HY8",
          article: "https://www.geeksforgeeks.org/merge-sort/",
          practice: "https://leetcode.com/problems/sort-list/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ==================== WEEK 5 ====================
  {
    nodeId: "dsaf-w5-node1",
    roadmapId: "dsa-fundamentals-y1",
    title: "Introduction to Stacks",
    description: "Learn the Last-In-First-Out (LIFO) data structure.",
    weekNumber: 5,
    estimatedHours: 5,
    order: 13,
    published: true,
    prerequisites: ["dsaf-w1-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w5-1-1",
        title: "What is a Stack?",
        description: "Understanding LIFO principle - like a stack of plates",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=F1F2imiOJfk",
          article: "https://www.geeksforgeeks.org/stack-data-structure/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 1,
      },
      {
        subtopicId: "dsaf-w5-1-2",
        title: "Stack Operations: Push and Pop",
        description: "Add (push) and remove (pop) elements from top",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=O1KeXo8lE8A",
          article: "https://www.geeksforgeeks.org/stack-data-structure/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 2,
      },
      {
        subtopicId: "dsaf-w5-1-3",
        title: "Stack Implementation Using Arrays",
        description: "Code a stack with array in C/C++",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=GYptUgnIM_I",
          article:
            "https://www.geeksforgeeks.org/stack-data-structure-introduction-program/",
          practice:
            "https://www.hackerrank.com/challenges/maximum-element/problem",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 3,
      },
      {
        subtopicId: "dsaf-w5-1-4",
        title: "Stack Operations: Peek and isEmpty",
        description: "View top element and check if stack is empty",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=F1F2imiOJfk",
          article: "https://www.programiz.com/dsa/stack",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 4,
      },
      {
        subtopicId: "dsaf-w5-1-5",
        title: "Stack Applications",
        description:
          "Real-world uses: function calls, undo operations, browser history",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=F1F2imiOJfk",
          article:
            "https://www.geeksforgeeks.org/applications-of-stack-data-structure/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w5-node2",
    roadmapId: "dsa-fundamentals-y1",
    title: "Stack Problems",
    description: "Practice classic stack-based problems.",
    weekNumber: 5,
    estimatedHours: 6,
    order: 14,
    published: true,
    prerequisites: ["dsaf-w5-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w5-2-1",
        title: "Balanced Parentheses",
        description: "Check if brackets are properly matched using stack",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=WTzjTskDFMg",
          article:
            "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/",
          practice: "https://leetcode.com/problems/valid-parentheses/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 1,
      },
      {
        subtopicId: "dsaf-w5-2-2",
        title: "Reverse a String Using Stack",
        description: "Use LIFO property to reverse strings",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=rnMCja7-S2g",
          article:
            "https://www.geeksforgeeks.org/stack-set-3-reverse-string-using-stack/",
          practice: "https://leetcode.com/problems/reverse-string/",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 2,
      },
      {
        subtopicId: "dsaf-w5-2-3",
        title: "Next Greater Element",
        description:
          "Find next greater element for each array element using stack",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Du881K7Jtk8",
          article: "https://www.geeksforgeeks.org/next-greater-element/",
          practice: "https://leetcode.com/problems/next-greater-element-i/",
          pdf: null,
        },
        estimatedMinutes: 45,
        order: 3,
      },
      {
        subtopicId: "dsaf-w5-2-4",
        title: "Infix to Postfix Conversion",
        description: "Convert expressions using stack",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=vq-nUF0G4fI",
          article:
            "https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/",
          practice:
            "https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/",
          pdf: null,
        },
        estimatedMinutes: 50,
        order: 4,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w5-node3",
    roadmapId: "dsa-fundamentals-y1",
    title: "Introduction to Queues",
    description: "Learn the First-In-First-Out (FIFO) data structure.",
    weekNumber: 5,
    estimatedHours: 5,
    order: 15,
    published: true,
    prerequisites: ["dsaf-w5-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w5-3-1",
        title: "What is a Queue?",
        description: "Understanding FIFO principle - like a line of people",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=zp6pBNbUB2U",
          article: "https://www.geeksforgeeks.org/queue-data-structure/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 1,
      },
      {
        subtopicId: "dsaf-w5-3-2",
        title: "Queue Operations: Enqueue and Dequeue",
        description: "Add at rear (enqueue) and remove from front (dequeue)",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=okr-XE8yTO8",
          article:
            "https://www.geeksforgeeks.org/queue-set-1introduction-and-array-implementation/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 2,
      },
      {
        subtopicId: "dsaf-w5-3-3",
        title: "Queue Implementation Using Arrays",
        description: "Code a queue with array and manage front/rear pointers",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=EoisnPvUkOA",
          article: "https://www.programiz.com/dsa/queue",
          practice:
            "https://www.hackerrank.com/challenges/queue-using-two-stacks/problem",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 3,
      },
      {
        subtopicId: "dsaf-w5-3-4",
        title: "Circular Queue",
        description: "Efficient queue implementation with wraparound",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=dn01XST9-bI",
          article:
            "https://www.geeksforgeeks.org/circular-queue-set-1-introduction-array-implementation/",
          practice: "https://leetcode.com/problems/design-circular-queue/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 4,
      },
      {
        subtopicId: "dsaf-w5-3-5",
        title: "Queue Applications",
        description: "Real-world uses: task scheduling, BFS, printer queues",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=zp6pBNbUB2U",
          article:
            "https://www.geeksforgeeks.org/applications-of-queue-data-structure/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ==================== WEEK 6 ====================
  {
    nodeId: "dsaf-w6-node1",
    roadmapId: "dsa-fundamentals-y1",
    title: "Introduction to Linked Lists",
    description:
      "Learn dynamic data structures - nodes connected with pointers.",
    weekNumber: 6,
    estimatedHours: 6,
    order: 16,
    published: true,
    prerequisites: ["dsaf-w1-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w6-1-1",
        title: "What is a Linked List?",
        description: "Understanding nodes, data, and next pointer concept",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=R9PTBwOzceo",
          article: "https://www.geeksforgeeks.org/data-structures/linked-list/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 25,
        order: 1,
      },
      {
        subtopicId: "dsaf-w6-1-2",
        title: "Arrays vs Linked Lists",
        description:
          "When to use each - memory, insertion, deletion comparison",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=lC-yYCOnN8Q",
          article: "https://www.geeksforgeeks.org/linked-list-vs-array/",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 20,
        order: 2,
      },
      {
        subtopicId: "dsaf-w6-1-3",
        title: "Creating a Node Structure",
        description: "Define node with data and next pointer in C/C++",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=R9PTBwOzceo",
          article: "https://www.programiz.com/dsa/linked-list",
          practice: null,
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 3,
      },
      {
        subtopicId: "dsaf-w6-1-4",
        title: "Insertion at Beginning",
        description: "Add new node at the start of linked list",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=cHMr5-0ZODQ",
          article:
            "https://www.geeksforgeeks.org/linked-list-set-2-inserting-a-node/",
          practice:
            "https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 4,
      },
      {
        subtopicId: "dsaf-w6-1-5",
        title: "Traversing a Linked List",
        description: "Print all elements by following next pointers",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=R9PTBwOzceo",
          article:
            "https://www.geeksforgeeks.org/linked-list-set-1-introduction/",
          practice:
            "https://www.hackerrank.com/challenges/print-the-elements-of-a-linked-list/problem",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w6-node2",
    roadmapId: "dsa-fundamentals-y1",
    title: "Linked List Operations",
    description: "Master insertion, deletion, and searching in linked lists.",
    weekNumber: 6,
    estimatedHours: 6,
    order: 17,
    published: true,
    prerequisites: ["dsaf-w6-node1"],
    subtopics: [
      {
        subtopicId: "dsaf-w6-2-1",
        title: "Insertion at End",
        description: "Add new node at the end of linked list",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=IbvsNF22Ud0",
          article:
            "https://www.geeksforgeeks.org/linked-list-set-2-inserting-a-node/",
          practice:
            "https://www.hackerrank.com/challenges/insert-a-node-at-the-tail-of-a-linked-list/problem",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 1,
      },
      {
        subtopicId: "dsaf-w6-2-2",
        title: "Insertion at Specific Position",
        description: "Insert node at any position in the list",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=9kVLZRPC7vw",
          article:
            "https://www.geeksforgeeks.org/linked-list-set-2-inserting-a-node/",
          practice:
            "https://www.hackerrank.com/challenges/insert-a-node-at-a-specific-position-in-a-linked-list/problem",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 2,
      },
      {
        subtopicId: "dsaf-w6-2-3",
        title: "Deletion from Beginning",
        description: "Remove first node and update head pointer",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Vxu7HUuT8bQ",
          article:
            "https://www.geeksforgeeks.org/linked-list-set-3-deleting-node/",
          practice:
            "https://www.hackerrank.com/challenges/delete-a-node-from-a-linked-list/problem",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 3,
      },
      {
        subtopicId: "dsaf-w6-2-4",
        title: "Deletion by Value",
        description: "Find and delete a node with specific value",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=Vxu7HUuT8bQ",
          article:
            "https://www.geeksforgeeks.org/linked-list-set-3-deleting-node/",
          practice:
            "https://leetcode.com/problems/delete-node-in-a-linked-list/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 4,
      },
      {
        subtopicId: "dsaf-w6-2-5",
        title: "Searching in Linked List",
        description: "Find if an element exists in the list",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=R9PTBwOzceo",
          article:
            "https://www.geeksforgeeks.org/search-an-element-in-a-linked-list-iterative-and-recursive/",
          practice:
            "https://www.hackerrank.com/challenges/find-the-merge-point-of-two-joined-linked-lists/problem",
          pdf: null,
        },
        estimatedMinutes: 30,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nodeId: "dsaf-w6-node3",
    roadmapId: "dsa-fundamentals-y1",
    title: "Linked List Practice & Review",
    description:
      "Solve classic linked list problems and review all DSA fundamentals.",
    weekNumber: 6,
    estimatedHours: 5,
    order: 18,
    published: true,
    prerequisites: ["dsaf-w6-node2"],
    subtopics: [
      {
        subtopicId: "dsaf-w6-3-1",
        title: "Reverse a Linked List",
        description: "Reverse the direction of all pointers in the list",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=iRtLEoL-r-g",
          article: "https://www.geeksforgeeks.org/reverse-a-linked-list/",
          practice: "https://leetcode.com/problems/reverse-linked-list/",
          pdf: null,
        },
        estimatedMinutes: 45,
        order: 1,
      },
      {
        subtopicId: "dsaf-w6-3-2",
        title: "Detect Loop in Linked List",
        description: "Use Floyd's cycle detection (slow/fast pointers)",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=gBT e7lFR3vc",
          article:
            "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
          practice: "https://leetcode.com/problems/linked-list-cycle/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 2,
      },
      {
        subtopicId: "dsaf-w6-3-3",
        title: "Find Middle of Linked List",
        description: "Use slow/fast pointer technique to find middle node",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=7LjQ57RqgEc",
          article:
            "https://www.geeksforgeeks.org/write-a-c-function-to-print-the-middle-of-the-linked-list/",
          practice: "https://leetcode.com/problems/middle-of-the-linked-list/",
          pdf: null,
        },
        estimatedMinutes: 35,
        order: 3,
      },
      {
        subtopicId: "dsaf-w6-3-4",
        title: "Merge Two Sorted Lists",
        description: "Combine two sorted linked lists into one sorted list",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=XIdigk956u0",
          article:
            "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/",
          practice: "https://leetcode.com/problems/merge-two-sorted-lists/",
          pdf: null,
        },
        estimatedMinutes: 40,
        order: 4,
      },
      {
        subtopicId: "dsaf-w6-3-5",
        title: "DSA Fundamentals Review",
        description:
          "Recap: Arrays, Strings, Searching, Sorting, Recursion, Stack, Queue, Linked List",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
          article: "https://www.geeksforgeeks.org/data-structures/",
          practice: "https://leetcode.com/problemset/all/",
          pdf: null,
        },
        estimatedMinutes: 60,
        order: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
async function seedDSAFundamentals() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db("dsa_patterns");
    const collection = db.collection("roadmap_nodes");

    console.log("📝 Inserting DSA Fundamentals (6 weeks complete)...");

    const result = await collection.insertMany(dsaFundamentalsComplete);

    console.log(`\n✅ Successfully inserted ${result.insertedCount} nodes`);
    console.log(
      `📊 Total subtopics: ${dsaFundamentalsComplete.reduce(
        (sum, node) => sum + node.subtopics.length,
        0
      )}`
    );
    console.log("\n📋 Summary:");
    console.log("   Week 1: Arrays & Strings (3 nodes, 15 subtopics)");
    console.log("   Week 2: Searching (3 nodes, 14 subtopics)");
    console.log("   Week 3: Sorting (3 nodes, 15 subtopics)");
    console.log("   Week 4: Recursion & Merge Sort (3 nodes, 15 subtopics)");
    console.log("   Week 5: Stacks & Queues (3 nodes, 14 subtopics)");
    console.log("   Week 6: Linked Lists (3 nodes, 15 subtopics)");
    console.log("\n🎯 Total: 18 nodes, 88 subtopics, ~90 hours of content");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}
seedDSAFundamentals();
