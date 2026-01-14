import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

async function seedComplete4Year() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('dsa_patterns');

    const roadmaps = [
      {
        slug: 'dsa-fundamentals-y1',
        title: 'DSA Fundamentals',
        description: 'Master fundamental data structures and basic algorithms',
        icon: '📊',
        color: '#3b82f6',
        category: 'DSA',
        difficulty: 'Beginner',
        estimatedWeeks: 8,
        prerequisites: [],
        outcomes: ['Understand arrays, strings, and basic sorting', 'Solve easy DSA problems'],
        targetRoles: ['Software Engineer', 'Developer'],
        published: true,
        order: 1,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'programming-basics-cpp',
        title: 'Programming Basics (C/C++)',
        description: 'Learn C/C++ programming fundamentals',
        icon: '💻',
        color: '#3b82f6',
        category: 'Programming',
        difficulty: 'Beginner',
        estimatedWeeks: 6,
        prerequisites: [],
        outcomes: ['Write C/C++ programs', 'Understand pointers and memory'],
        targetRoles: ['Software Engineer'],
        published: true,
        order: 2,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'core-cs-subjects',
        title: 'Core CS Subjects',
        description: 'Computer Organization, Digital Logic, Data Structures theory',
        icon: '🎓',
        color: '#3b82f6',
        category: 'Computer Science',
        difficulty: 'Beginner',
        estimatedWeeks: 10,
        prerequisites: [],
        outcomes: ['Understand computer architecture', 'Master CS fundamentals'],
        targetRoles: ['Software Engineer', 'Computer Scientist'],
        published: true,
        order: 3,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'mathematics-for-cs',
        title: 'Mathematics for CS',
        description: 'Discrete Math, Linear Algebra, Probability basics',
        icon: '🔢',
        color: '#3b82f6',
        category: 'Mathematics',
        difficulty: 'Beginner',
        estimatedWeeks: 8,
        prerequisites: [],
        outcomes: ['Understand discrete mathematics', 'Apply math in CS problems'],
        targetRoles: ['Software Engineer', 'Data Scientist'],
        published: true,
        order: 4,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'advanced-dsa-y2',
        title: 'Advanced DSA',
        description: 'Graphs, Dynamic Programming, Advanced Trees',
        icon: '🌳',
        color: '#8b5cf6',
        category: 'DSA',
        difficulty: 'Intermediate',
        estimatedWeeks: 12,
        prerequisites: ['dsa-fundamentals-y1'],
        outcomes: ['Solve medium/hard DSA problems', 'Master graphs and DP'],
        targetRoles: ['Software Engineer', 'SDE'],
        published: true,
        order: 5,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'os-dbms-networks',
        title: 'OS, DBMS & Networks',
        description: 'Deep dive into Operating Systems, DBMS, and Computer Networks',
        icon: '🖥️',
        color: '#8b5cf6',
        category: 'Computer Science',
        difficulty: 'Intermediate',
        estimatedWeeks: 14,
        prerequisites: ['core-cs-subjects'],
        outcomes: ['Understand OS internals', 'Master database concepts', 'Network protocols'],
        targetRoles: ['Backend Engineer', 'System Engineer'],
        published: true,
        order: 6,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'sql-databases-y2',
        title: 'SQL & Databases',
        description: 'Master SQL queries, database design, and optimization',
        icon: '🗄️',
        color: '#8b5cf6',
        category: 'Database',
        difficulty: 'Intermediate',
        estimatedWeeks: 8,
        prerequisites: ['os-dbms-networks'],
        outcomes: ['Write complex SQL queries', 'Design databases', 'Optimize queries'],
        targetRoles: ['Backend Engineer', 'Database Engineer'],
        published: true,
        order: 7,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'git-development-basics',
        title: 'Git & Development Basics',
        description: 'Version control, collaboration, and development workflow',
        icon: '🔧',
        color: '#8b5cf6',
        category: 'Development',
        difficulty: 'Beginner',
        estimatedWeeks: 4,
        prerequisites: [],
        outcomes: ['Use Git effectively', 'Collaborate on projects', 'CI/CD basics'],
        targetRoles: ['Software Engineer', 'Developer'],
        published: true,
        order: 8,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'advanced-dbms-sql-y3',
        title: 'Advanced DBMS & SQL',
        description: 'Transaction management, indexing, advanced optimization',
        icon: '💾',
        color: '#ec4899',
        category: 'Database',
        difficulty: 'Advanced',
        estimatedWeeks: 6,
        prerequisites: ['sql-databases-y2'],
        outcomes: ['Master transactions', 'Advanced optimization', 'Database tuning'],
        targetRoles: ['Backend Engineer', 'Database Architect'],
        published: true,
        order: 9,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'system-design-basics-y3',
        title: 'System Design Basics',
        description: 'Scalability, load balancing, caching, microservices',
        icon: '🏗️',
        color: '#ec4899',
        category: 'System Design',
        difficulty: 'Intermediate',
        estimatedWeeks: 10,
        prerequisites: ['advanced-dsa-y2', 'os-dbms-networks'],
        outcomes: ['Design scalable systems', 'Understand distributed systems'],
        targetRoles: ['Software Engineer', 'System Architect'],
        published: true,
        order: 10,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'web-development-fullstack',
        title: 'Full Stack Web Development',
        description: 'React, Node.js, MongoDB, REST APIs, deployment',
        icon: '🌐',
        color: '#3b82f6',
        category: 'Web Development',
        difficulty: 'Intermediate',
        estimatedWeeks: 16,
        prerequisites: ['programming-basics-cpp', 'sql-databases-y2'],
        outcomes: ['Build full-stack apps', 'Deploy to production', 'REST APIs'],
        targetRoles: ['Full Stack Developer', 'Web Developer'],
        published: true,
        order: 11,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        techStackCategory: 'web-development',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'machine-learning-engineer',
        title: 'Machine Learning & AI',
        description: 'ML algorithms, neural networks, TensorFlow, real-world AI',
        icon: '🤖',
        color: '#8b5cf6',
        category: 'Machine Learning',
        difficulty: 'Advanced',
        estimatedWeeks: 20,
        prerequisites: ['mathematics-for-cs', 'advanced-dsa-y2'],
        outcomes: ['Build ML models', 'Deep learning', 'Deploy AI systems'],
        targetRoles: ['ML Engineer', 'Data Scientist'],
        published: true,
        order: 12,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        techStackCategory: 'machine-learning',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'mobile-development-y3',
        title: 'Mobile App Development',
        description: 'React Native, Flutter, iOS/Android development',
        icon: '📱',
        color: '#10b981',
        category: 'Mobile Development',
        difficulty: 'Intermediate',
        estimatedWeeks: 16,
        prerequisites: ['programming-basics-cpp', 'sql-databases-y2'],
        outcomes: ['Build mobile apps', 'Cross-platform development', 'App deployment'],
        targetRoles: ['Mobile Developer', 'App Developer'],
        published: true,
        order: 13,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        techStackCategory: 'mobile-development',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'devops-cloud-y3',
        title: 'DevOps & Cloud',
        description: 'Docker, Kubernetes, AWS, CI/CD, monitoring',
        icon: '☁️',
        color: '#f59e0b',
        category: 'DevOps',
        difficulty: 'Intermediate',
        estimatedWeeks: 14,
        prerequisites: ['git-development-basics', 'os-dbms-networks'],
        outcomes: ['Deploy with Docker', 'Kubernetes orchestration', 'AWS services'],
        targetRoles: ['DevOps Engineer', 'Cloud Engineer'],
        published: true,
        order: 14,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        techStackCategory: 'devops',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'cybersecurity-y3',
        title: 'Cybersecurity',
        description: 'Ethical hacking, network security, cryptography, penetration testing',
        icon: '🔒',
        color: '#ef4444',
        category: 'Cybersecurity',
        difficulty: 'Advanced',
        estimatedWeeks: 16,
        prerequisites: ['os-dbms-networks', 'advanced-dsa-y2'],
        outcomes: ['Ethical hacking', 'Security audits', 'Cryptography'],
        targetRoles: ['Security Engineer', 'Ethical Hacker'],
        published: true,
        order: 15,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 3,
        techStackCategory: 'cybersecurity',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'system-design-advanced-y4',
        title: 'System Design Advanced',
        description: 'Design Twitter, Netflix, Uber - Advanced distributed systems',
        icon: '🏛️',
        color: '#fbbf24',
        category: 'System Design',
        difficulty: 'Advanced',
        estimatedWeeks: 12,
        prerequisites: ['system-design-basics-y3'],
        outcomes: ['Design complex systems', 'Distributed architecture', 'Trade-offs'],
        targetRoles: ['Senior Engineer', 'Architect'],
        published: true,
        order: 16,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'interview-bootcamp-y4',
        title: 'Interview Bootcamp',
        description: 'DSA problems, system design, behavioral interviews, mock interviews',
        icon: '💼',
        color: '#fbbf24',
        category: 'Interview Prep',
        difficulty: 'Advanced',
        estimatedWeeks: 10,
        prerequisites: ['advanced-dsa-y2', 'system-design-basics-y3'],
        outcomes: ['Ace technical interviews', 'Solve hard problems', 'System design rounds'],
        targetRoles: ['Software Engineer', 'SDE'],
        published: true,
        order: 17,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'company-specific-prep-y4',
        title: 'Company-Specific Preparation',
        description: 'Google, Microsoft, Amazon, Meta interview patterns',
        icon: '🎯',
        color: '#fbbf24',
        category: 'Interview Prep',
        difficulty: 'Advanced',
        estimatedWeeks: 8,
        prerequisites: ['interview-bootcamp-y4'],
        outcomes: ['Company-specific strategies', 'Pattern recognition', 'Offer negotiation'],
        targetRoles: ['Software Engineer', 'Senior SDE'],
        published: true,
        order: 18,
        parentMasterId: '4-year-cs-journey',
        yearNumber: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('📝 Inserting 18 roadmaps...');
    for (const roadmap of roadmaps) {
      await db.collection('roadmaps').updateOne(
        { slug: roadmap.slug },
        { $set: roadmap },
        { upsert: true }
      );
    }
    console.log('✅ All 18 roadmaps created');

    const nodesData = [
      {
        roadmapId: 'dsa-fundamentals-y1',
        nodes: [
          {
            nodeId: 'dsaf_w1_arrays',
            title: 'Arrays & Strings Basics',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'Array traversal', estimatedTime: '1h' },
              { subtopicId: 1, name: 'Two pointers technique', estimatedTime: '2h' },
              { subtopicId: 2, name: 'String manipulation', estimatedTime: '1h' }
            ],
            published: true
          },
          {
            nodeId: 'dsaf_w2_sorting',
            title: 'Sorting Algorithms',
            weekNumber: 2,
            order: 2,
            subtopics: [
              { subtopicId: 0, name: 'Bubble sort', estimatedTime: '1h' },
              { subtopicId: 1, name: 'Selection sort', estimatedTime: '1h' },
              { subtopicId: 2, name: 'Merge sort', estimatedTime: '2h' }
            ],
            published: true
          }
        ]
      },
      {
        roadmapId: 'programming-basics-cpp',
        nodes: [
          {
            nodeId: 'cpp_w1_syntax',
            title: 'C++ Syntax & Basics',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'Variables and data types', estimatedTime: '1h' },
              { subtopicId: 1, name: 'Control structures', estimatedTime: '1h' },
              { subtopicId: 2, name: 'Functions', estimatedTime: '2h' }
            ],
            published: true
          }
        ]
      },
      {
        roadmapId: 'core-cs-subjects',
        nodes: [
          {
            nodeId: 'ccs_w1_co',
            title: 'Computer Organization Basics',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'CPU architecture', estimatedTime: '2h' },
              { subtopicId: 1, name: 'Memory hierarchy', estimatedTime: '2h' },
              { subtopicId: 2, name: 'I/O systems', estimatedTime: '1h' }
            ],
            published: true
          }
        ]
      },
      {
        roadmapId: 'mathematics-for-cs',
        nodes: [
          {
            nodeId: 'math_w1_discrete',
            title: 'Discrete Mathematics',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'Sets and relations', estimatedTime: '2h' },
              { subtopicId: 1, name: 'Logic and proofs', estimatedTime: '2h' },
              { subtopicId: 2, name: 'Combinatorics', estimatedTime: '2h' }
            ],
            published: true
          }
        ]
      },
      {
        roadmapId: 'advanced-dsa-y2',
        nodes: [
          {
            nodeId: 'adsa_w1_graphs',
            title: 'Graph Algorithms',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'BFS and DFS', estimatedTime: '3h' },
              { subtopicId: 1, name: 'Dijkstra algorithm', estimatedTime: '2h' },
              { subtopicId: 2, name: 'MST algorithms', estimatedTime: '2h' }
            ],
            published: true
          },
          {
            nodeId: 'adsa_w2_dp',
            title: 'Dynamic Programming',
            weekNumber: 2,
            order: 2,
            subtopics: [
              { subtopicId: 0, name: 'DP patterns', estimatedTime: '3h' },
              { subtopicId: 1, name: 'Knapsack problems', estimatedTime: '2h' },
              { subtopicId: 2, name: 'LCS and LIS', estimatedTime: '2h' }
            ],
            published: true
          }
        ]
      },
      {
        roadmapId: 'system-design-basics-y3',
        nodes: [
          {
            nodeId: 'sdb_w1_scalability',
            title: 'Scalability Fundamentals',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'Horizontal vs vertical scaling', estimatedTime: '2h' },
              { subtopicId: 1, name: 'Load balancing', estimatedTime: '2h' },
              { subtopicId: 2, name: 'Caching strategies', estimatedTime: '2h' }
            ],
            published: true
          }
        ]
      },
      {
        roadmapId: 'system-design-advanced-y4',
        nodes: [
          {
            nodeId: 'sda_w1_twitter',
            title: 'Design Twitter',
            weekNumber: 1,
            order: 1,
            subtopics: [
              { subtopicId: 0, name: 'Requirements gathering', estimatedTime: '1h' },
              { subtopicId: 1, name: 'Database design', estimatedTime: '2h' },
              { subtopicId: 2, name: 'Feed generation', estimatedTime: '3h' }
            ],
            published: true
          }
        ]
      }
    ];

    console.log('📝 Inserting nodes for roadmaps...');
    for (const { roadmapId, nodes } of nodesData) {
      for (const node of nodes) {
        await db.collection('roadmap_nodes').updateOne(
          { nodeId: node.nodeId },
          { $set: { ...node, roadmapId, createdAt: new Date(), updatedAt: new Date() } },
          { upsert: true }
        );
      }
    }
    console.log('✅ Nodes created for all roadmaps');

    const master4Year = {
      masterId: '4-year-cs-journey',
      title: '4-Year CS Degree Journey',
      description: 'Complete roadmap from college freshman to job-ready software engineer',
      icon: '🎓',
      color: '#3b82f6',
      type: 'master',
      published: true,
      order: 0,

      years: [
        {
          yearNumber: 1,
          title: 'Year 1: Foundations',
          subtitle: 'Build Strong Fundamentals',
          description: 'Master core CS concepts, programming basics, and fundamental data structures',
          theme: 'blue',
          requiredProgress: 0,
          unlockMessage: 'Start your journey!',
          testOutAvailable: true,
          testOutThreshold: 80,
          roadmaps: [
            { roadmapSlug: 'dsa-fundamentals-y1', required: true, order: 1 },
            { roadmapSlug: 'programming-basics-cpp', required: true, order: 2 },
            { roadmapSlug: 'core-cs-subjects', required: true, order: 3 },
            { roadmapSlug: 'mathematics-for-cs', required: true, order: 4 }
          ]
        },
        {
          yearNumber: 2,
          title: 'Year 2: Core Mastery',
          subtitle: 'Deep Dive into CS Concepts',
          description: 'Advanced DSA, database systems, and development fundamentals',
          theme: 'purple',
          requiredProgress: 70,
          unlockMessage: 'Complete Year 1 to 70% to unlock',
          testOutAvailable: false,
          roadmaps: [
            { roadmapSlug: 'advanced-dsa-y2', required: true, order: 1 },
            { roadmapSlug: 'os-dbms-networks', required: true, order: 2 },
            { roadmapSlug: 'sql-databases-y2', required: true, order: 3 },
            { roadmapSlug: 'git-development-basics', required: true, order: 4 }
          ]
        },
        {
          yearNumber: 3,
          title: 'Year 3: Specialization',
          subtitle: 'Choose Your Path',
          description: 'Pick your tech stack and start building real-world projects',
          theme: 'gradient',
          requiredProgress: 70,
          unlockMessage: 'Complete Year 2 to 70% to unlock',
          testOutAvailable: false,
          roadmaps: [
            { roadmapSlug: 'advanced-dbms-sql-y3', required: true, order: 1 },
            { roadmapSlug: 'system-design-basics-y3', required: true, order: 2 },
            {
              type: 'tech-stack-hub',
              title: 'Choose Your Tech Stack',
              description: 'Select ONE primary specialization',
              options: ['web-development', 'machine-learning', 'mobile-development', 'devops', 'cybersecurity']
            }
          ]
        },
        {
          yearNumber: 4,
          title: 'Year 4: Job Ready',
          subtitle: 'Interview Prep & Placement',
          description: 'Master interviews, build portfolio, and land your dream job',
          theme: 'gold',
          requiredProgress: 50,
          unlockMessage: 'Complete Year 3 to 50% to unlock',
          testOutAvailable: false,
          roadmaps: [
            { roadmapSlug: 'system-design-advanced-y4', required: true, order: 1 },
            { roadmapSlug: 'interview-bootcamp-y4', required: true, order: 2 },
            { roadmapSlug: 'company-specific-prep-y4', required: true, order: 3 }
          ]
        }
      ],

      features: {
        examMode: true,
        metroMap: true,
        certificates: true,
        peerProgress: true
      },

      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📝 Updating 4-Year master roadmap...');
    await db.collection('master_roadmaps').updateOne(
      { masterId: '4-year-cs-journey' },
      { $set: master4Year },
      { upsert: true }
    );
    console.log('✅ Master roadmap updated');

    console.log('\n🎉 Complete! Created:');
    console.log('   - 18 roadmaps');
    console.log('   - Sample nodes for key roadmaps');
    console.log('   - Updated 4-year master roadmap');
    console.log('\n📋 Next: Visit /roadmaps to see all new roadmaps');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedComplete4Year();
