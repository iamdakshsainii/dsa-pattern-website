import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority"

const academicData = [
  {
    year: 1,
    semester: 1,
    subjects: [
      {
        name: "Programming Fundamentals (C/C++)",
        icon: "💻",
        resources: [
          { type: "youtube", title: "C++ Full Course - CodeWithHarry", url: "https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL", thumbnail: "" },
          { type: "youtube", title: "C Programming - Jenny's Lectures", url: "https://youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S", thumbnail: "" },
          { type: "notes", title: "C++ Handwritten Notes", url: "/resources/cpp-notes.pdf", format: "pdf" },
          { type: "article", title: "C++ STL Cheat Sheet", url: "https://www.geeksforgeeks.org/cpp-stl-tutorial/", thumbnail: "" },
          { type: "quantum", title: "Let Us C - Yashavant Kanetkar", url: "/resources/let-us-c.pdf", format: "pdf" }
        ]
      },
      {
        name: "Data Structures",
        icon: "🗂️",
        resources: [
          { type: "youtube", title: "DSA Course - Apna College", url: "https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ", thumbnail: "" },
          { type: "youtube", title: "DSA in C++ - Love Babbar", url: "https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", thumbnail: "" },
          { type: "notes", title: "DSA Handwritten Notes", url: "/resources/dsa-notes.pdf", format: "pdf" },
          { type: "article", title: "Data Structures Tutorial", url: "https://www.geeksforgeeks.org/data-structures/", thumbnail: "" },
          { type: "quantum", title: "DSA Quantum Book", url: "/resources/dsa-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Mathematics - I",
        icon: "📐",
        resources: [
          { type: "youtube", title: "Engineering Mathematics", url: "https://youtube.com/playlist?list=PLU6SqdYcYsfLRq3tu-g_hvkHDcorrtcBK", thumbnail: "" },
          { type: "notes", title: "Maths Handwritten Notes", url: "/resources/math1-notes.pdf", format: "pdf" },
          { type: "quantum", title: "Engineering Maths Quantum", url: "/resources/math-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Digital Electronics",
        icon: "⚡",
        resources: [
          { type: "youtube", title: "Digital Electronics - Neso Academy", url: "https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm", thumbnail: "" },
          { type: "notes", title: "DE Handwritten Notes", url: "/resources/de-notes.pdf", format: "pdf" },
          { type: "quantum", title: "Digital Electronics Quantum", url: "/resources/de-quantum.pdf", format: "pdf" }
        ]
      }
    ]
  },
  {
    year: 1,
    semester: 2,
    subjects: [
      {
        name: "Object-Oriented Programming",
        icon: "🎯",
        resources: [
          { type: "youtube", title: "OOP in C++ - CodeWithHarry", url: "https://youtube.com/playlist?list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q", thumbnail: "" },
          { type: "youtube", title: "Java OOP - Apna College", url: "https://youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop", thumbnail: "" },
          { type: "notes", title: "OOP Handwritten Notes", url: "/resources/oop-notes.pdf", format: "pdf" },
          { type: "quantum", title: "OOP Concepts Quantum", url: "/resources/oop-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Database Management Systems",
        icon: "🗄️",
        resources: [
          { type: "youtube", title: "DBMS - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", thumbnail: "" },
          { type: "youtube", title: "DBMS Complete - Knowledge Gate", url: "https://youtube.com/playlist?list=PLmXKhU9FNesR1rSES7oLdJaNFgmuj0SYV", thumbnail: "" },
          { type: "notes", title: "DBMS Handwritten Notes", url: "/resources/dbms-notes.pdf", format: "pdf" },
          { type: "article", title: "SQL Practice", url: "https://www.sqlzoo.net/", thumbnail: "" },
          { type: "quantum", title: "DBMS Quantum", url: "/resources/dbms-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Mathematics - II",
        icon: "📊",
        resources: [
          { type: "youtube", title: "Engineering Maths II", url: "https://youtube.com/playlist?list=PLU6SqdYcYsfI-yJjLOFIYDa0a-e-zHHHK", thumbnail: "" },
          { type: "notes", title: "Maths II Notes", url: "/resources/math2-notes.pdf", format: "pdf" },
          { type: "quantum", title: "Maths II Quantum", url: "/resources/math2-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Computer Organization",
        icon: "🖥️",
        resources: [
          { type: "youtube", title: "COA - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX", thumbnail: "" },
          { type: "notes", title: "COA Handwritten Notes", url: "/resources/coa-notes.pdf", format: "pdf" },
          { type: "quantum", title: "COA Quantum", url: "/resources/coa-quantum.pdf", format: "pdf" }
        ]
      }
    ]
  },
  {
    year: 2,
    semester: 1,
    subjects: [
      {
        name: "Operating Systems",
        icon: "🖥️",
        resources: [
          { type: "youtube", title: "OS - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", thumbnail: "" },
          { type: "youtube", title: "OS Complete - Knowledge Gate", url: "https://youtube.com/playlist?list=PLmXKhU9FNesR4yqQQqz5qoZJHPrGdC0pD", thumbnail: "" },
          { type: "notes", title: "OS Handwritten Notes", url: "/resources/os-notes.pdf", format: "pdf" },
          { type: "quantum", title: "OS Quantum", url: "/resources/os-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Algorithms",
        icon: "🔄",
        resources: [
          { type: "youtube", title: "Algorithms - Abdul Bari", url: "https://youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", thumbnail: "" },
          { type: "youtube", title: "DAA - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa", thumbnail: "" },
          { type: "notes", title: "Algorithm Notes", url: "/resources/algo-notes.pdf", format: "pdf" },
          { type: "quantum", title: "Algorithm Quantum", url: "/resources/algo-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Computer Networks",
        icon: "🌐",
        resources: [
          { type: "youtube", title: "CN - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_", thumbnail: "" },
          { type: "youtube", title: "Networking - Knowledge Gate", url: "https://youtube.com/playlist?list=PLmXKhU9FNesR1rSES7oLdJaNFgmuj0SYV", thumbnail: "" },
          { type: "notes", title: "CN Handwritten Notes", url: "/resources/cn-notes.pdf", format: "pdf" },
          { type: "quantum", title: "CN Quantum", url: "/resources/cn-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Software Engineering",
        icon: "⚙️",
        resources: [
          { type: "youtube", title: "Software Engineering", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2", thumbnail: "" },
          { type: "notes", title: "SE Notes", url: "/resources/se-notes.pdf", format: "pdf" },
          { type: "quantum", title: "SE Quantum", url: "/resources/se-quantum.pdf", format: "pdf" }
        ]
      }
    ]
  },
  {
    year: 2,
    semester: 2,
    subjects: [
      {
        name: "Theory of Computation",
        icon: "🔤",
        resources: [
          { type: "youtube", title: "TOC - Neso Academy", url: "https://youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev", thumbnail: "" },
          { type: "youtube", title: "TOC - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiFM9Lj5G9G_76adtyb4ef7i", thumbnail: "" },
          { type: "notes", title: "TOC Handwritten Notes", url: "/resources/toc-notes.pdf", format: "pdf" },
          { type: "quantum", title: "TOC Quantum", url: "/resources/toc-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Compiler Design",
        icon: "🔧",
        resources: [
          { type: "youtube", title: "Compiler Design - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc", thumbnail: "" },
          { type: "notes", title: "CD Handwritten Notes", url: "/resources/cd-notes.pdf", format: "pdf" },
          { type: "quantum", title: "CD Quantum", url: "/resources/cd-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Web Development",
        icon: "🌐",
        resources: [
          { type: "youtube", title: "Web Dev - CodeWithHarry", url: "https://youtube.com/playlist?list=PLu0W_9lII9agiCUZYRsvtGTXdxkzPyItg", thumbnail: "" },
          { type: "youtube", title: "Full Stack - Apna College", url: "https://youtube.com/playlist?list=PLfqMhTWNBTe3H6c9OGXb5_6wcc1Mca52n", thumbnail: "" },
          { type: "article", title: "MDN Web Docs", url: "https://developer.mozilla.org/", thumbnail: "" }
        ]
      },
      {
        name: "Python Programming",
        icon: "🐍",
        resources: [
          { type: "youtube", title: "Python - CodeWithHarry", url: "https://youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME", thumbnail: "" },
          { type: "notes", title: "Python Notes", url: "/resources/python-notes.pdf", format: "pdf" },
          { type: "article", title: "Python Official Docs", url: "https://docs.python.org/3/", thumbnail: "" }
        ]
      }
    ]
  },
  {
    year: 3,
    semester: 1,
    subjects: [
      {
        name: "Machine Learning",
        icon: "🤖",
        resources: [
          { type: "youtube", title: "ML - Andrew Ng (Coursera)", url: "https://youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI", thumbnail: "" },
          { type: "youtube", title: "ML - Krish Naik", url: "https://youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe", thumbnail: "" },
          { type: "notes", title: "ML Handwritten Notes", url: "/resources/ml-notes.pdf", format: "pdf" },
          { type: "article", title: "ML Algorithms", url: "https://www.geeksforgeeks.org/machine-learning/", thumbnail: "" }
        ]
      },
      {
        name: "Artificial Intelligence",
        icon: "🧠",
        resources: [
          { type: "youtube", title: "AI - Gate Smashers", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI", thumbnail: "" },
          { type: "notes", title: "AI Notes", url: "/resources/ai-notes.pdf", format: "pdf" },
          { type: "quantum", title: "AI Quantum", url: "/resources/ai-quantum.pdf", format: "pdf" }
        ]
      },
      {
        name: "Cloud Computing",
        icon: "☁️",
        resources: [
          { type: "youtube", title: "Cloud Computing Basics", url: "https://youtube.com/playlist?list=PLEiEAq2VkUULlNtIFhEQHo8gacvme35rz", thumbnail: "" },
          { type: "notes", title: "Cloud Notes", url: "/resources/cloud-notes.pdf", format: "pdf" },
          { type: "article", title: "AWS Free Tier", url: "https://aws.amazon.com/free/", thumbnail: "" }
        ]
      },
      {
        name: "Cryptography",
        icon: "🔐",
        resources: [
          { type: "youtube", title: "Cryptography - Neso Academy", url: "https://youtube.com/playlist?list=PLBlnK6fEyqRgJU3EsOYDTW7m6SUmW6kII", thumbnail: "" },
          { type: "notes", title: "Crypto Notes", url: "/resources/crypto-notes.pdf", format: "pdf" },
          { type: "quantum", title: "Crypto Quantum", url: "/resources/crypto-quantum.pdf", format: "pdf" }
        ]
      }
    ]
  },
  {
    year: 3,
    semester: 2,
    subjects: [
      {
        name: "Deep Learning",
        icon: "🧬",
        resources: [
          { type: "youtube", title: "Deep Learning - Andrew Ng", url: "https://youtube.com/playlist?list=PLkDaE6sCZn6Ec-XTbcX1uRg2_u4xOEky0", thumbnail: "" },
          { type: "youtube", title: "Neural Networks", url: "https://youtube.com/playlist?list=PLZbbT5o_s2xq7LwI2y8_QtvuXZedL6tQU", thumbnail: "" },
          { type: "notes", title: "DL Notes", url: "/resources/dl-notes.pdf", format: "pdf" }
        ]
      },
      {
        name: "Big Data Analytics",
        icon: "📊",
        resources: [
          { type: "youtube", title: "Big Data - Simplilearn", url: "https://youtube.com/playlist?list=PLEiEAq2VkUUIJIRB5z0TiMHP5bDYXZHWg", thumbnail: "" },
          { type: "notes", title: "Big Data Notes", url: "/resources/bigdata-notes.pdf", format: "pdf" }
        ]
      },
      {
        name: "Mobile App Development",
        icon: "📱",
        resources: [
          { type: "youtube", title: "Android Dev - CodeWithHarry", url: "https://youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd", thumbnail: "" },
          { type: "youtube", title: "React Native", url: "https://youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ", thumbnail: "" },
          { type: "article", title: "Flutter Docs", url: "https://flutter.dev/docs", thumbnail: "" }
        ]
      },
      {
        name: "DevOps",
        icon: "🔄",
        resources: [
          { type: "youtube", title: "DevOps - Kunal Kushwaha", url: "https://youtube.com/playlist?list=PL9gnSGHSqcnoqBXdMwUTRod4Gi3eac2Ak", thumbnail: "" },
          { type: "article", title: "Docker Docs", url: "https://docs.docker.com/", thumbnail: "" },
          { type: "article", title: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/", thumbnail: "" }
        ]
      }
    ]
  },
  {
    year: 4,
    semester: 1,
    subjects: [
      {
        name: "Blockchain Technology",
        icon: "⛓️",
        resources: [
          { type: "youtube", title: "Blockchain Basics", url: "https://youtube.com/playlist?list=PLgPmWS2dQHW9mucRH8SHe9zVsHQFkmZcs", thumbnail: "" },
          { type: "article", title: "Blockchain Tutorial", url: "https://www.geeksforgeeks.org/blockchain-tutorial/", thumbnail: "" }
        ]
      },
      {
        name: "IoT",
        icon: "📡",
        resources: [
          { type: "youtube", title: "IoT Fundamentals", url: "https://youtube.com/playlist?list=PLBlnK6fEyqRgPMtjJBYpcgYPVZfJ_kGX5", thumbnail: "" },
          { type: "notes", title: "IoT Notes", url: "/resources/iot-notes.pdf", format: "pdf" }
        ]
      },
      {
        name: "Placement Preparation",
        icon: "💼",
        resources: [
          { type: "youtube", title: "Interview Prep - Striver", url: "https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", thumbnail: "" },
          { type: "youtube", title: "System Design", url: "https://youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX", thumbnail: "" },
          { type: "article", title: "LeetCode Practice", url: "https://leetcode.com/", thumbnail: "" },
          { type: "article", title: "Interview Bit", url: "https://www.interviewbit.com/", thumbnail: "" }
        ]
      }
    ]
  },
  {
    year: 4,
    semester: 2,
    subjects: [
      {
        name: "Capstone Project",
        icon: "🚀",
        resources: [
          { type: "youtube", title: "Full Stack Projects", url: "https://youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", thumbnail: "" },
          { type: "article", title: "Project Ideas", url: "https://github.com/topics/project-ideas", thumbnail: "" }
        ]
      },
      {
        name: "Internship Preparation",
        icon: "🎯",
        resources: [
          { type: "article", title: "Resume Building", url: "https://www.overleaf.com/latex/templates", thumbnail: "" },
          { type: "article", title: "LinkedIn Optimization", url: "https://www.linkedin.com/help/linkedin", thumbnail: "" },
          { type: "youtube", title: "Mock Interviews", url: "https://youtube.com/playlist?list=PLot-Xpze53lfOdF3KwpMSFEyfE77zb2to", thumbnail: "" }
        ]
      },
      {
        name: "Competitive Programming",
        icon: "🏆",
        resources: [
          { type: "youtube", title: "CP - Luv", url: "https://youtube.com/playlist?list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-", thumbnail: "" },
          { type: "article", title: "Codeforces", url: "https://codeforces.com/", thumbnail: "" },
          { type: "article", title: "CodeChef", url: "https://www.codechef.com/", thumbnail: "" }
        ]
      }
    ]
  }
]

async function seedAcademics() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()

    await db.collection('academic_resources').deleteMany({})
    console.log('🗑️  Cleared existing academic resources')

    const documents = []

    for (const yearData of academicData) {
      for (const subject of yearData.subjects) {
        documents.push({
          year: yearData.year,
          semester: yearData.semester,
          subject: subject.name,
          icon: subject.icon,
          resources: subject.resources,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await db.collection('academic_resources').insertMany(documents)
    console.log(`✅ Inserted ${documents.length} subject resources`)

    await db.collection('academic_resources').createIndex({ year: 1, semester: 1 })
    await db.collection('academic_resources').createIndex({ subject: 1 })
    console.log('✅ Created indexes')

    const summary = await db.collection('academic_resources').aggregate([
      {
        $group: {
          _id: { year: '$year', semester: '$semester' },
          subjects: { $sum: 1 },
          totalResources: { $sum: { $size: '$resources' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.semester': 1 } }
    ]).toArray()

    console.log('\n📚 Academic Resources Summary:')
    summary.forEach(s => {
      console.log(`Year ${s._id.year} Sem ${s._id.semester}: ${s.subjects} subjects, ${s.totalResources} resources`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

seedAcademics()
