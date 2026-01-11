import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority';
const DB_NAME = "dsa_patterns";

const ML_ROADMAP = {
  slug: "machine-learning-engineer",
  title: "Machine Learning Engineer Roadmap",
  description: "Complete path to becoming a Machine Learning Engineer. Master ML algorithms, deep learning, MLOps, and production deployment.",
  category: "Machine Learning",
  difficulty: "Advanced",
  estimatedWeeks: 24,
  icon: "🤖",
  color: "#8b5cf6",
  prerequisites: [
    "Python programming",
    "Linear algebra basics",
    "Calculus fundamentals",
    "Probability & statistics"
  ],
  outcomes: [
    "Build and deploy ML models",
    "Master supervised and unsupervised learning",
    "Implement deep learning architectures",
    "Deploy models to production",
    "Understand MLOps best practices"
  ],
  targetRoles: [
    "Machine Learning Engineer",
    "ML Research Engineer",
    "AI Engineer",
    "Data Scientist"
  ],
  published: true,
  order: 4
};

const ML_NODES = [
  {
    nodeId: "ml-node-1",
    roadmapId: "machine-learning-engineer",
    title: "Python for Machine Learning",
    description: "Master Python libraries essential for ML: NumPy, Pandas, Matplotlib",
    weekNumber: 1,
    estimatedHours: 10,
    order: 1,
    published: true,
    prerequisites: [],
    subtopics: [
      {
        subtopicId: "ml-1-1",
        title: "NumPy Arrays & Operations",
        description: "Array manipulation, broadcasting, vectorization",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
          article: "https://numpy.org/doc/stable/user/quickstart.html",
          practice: "https://www.w3resource.com/python-exercises/numpy/index.php",
          pdf: null
        },
        estimatedMinutes: 120,
        order: 1
      },
      {
        subtopicId: "ml-1-2",
        title: "Pandas DataFrames",
        description: "Data manipulation, cleaning, and preprocessing",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=vmEHCJofslg",
          article: "https://pandas.pydata.org/docs/user_guide/10min.html",
          practice: "https://www.kaggle.com/learn/pandas",
          pdf: null
        },
        estimatedMinutes: 150,
        order: 2
      },
      {
        subtopicId: "ml-1-3",
        title: "Data Visualization with Matplotlib",
        description: "Creating plots, charts, and visualizations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=3Xc3CA655Y4",
          article: "https://matplotlib.org/stable/tutorials/index.html",
          practice: "https://github.com/rougier/matplotlib-tutorial",
          pdf: null
        },
        estimatedMinutes: 90,
        order: 3
      }
    ]
  },
  {
    nodeId: "ml-node-2",
    roadmapId: "machine-learning-engineer",
    title: "Mathematics for ML",
    description: "Linear algebra, calculus, and statistics fundamentals",
    weekNumber: 2,
    estimatedHours: 12,
    order: 2,
    published: true,
    prerequisites: ["ml-node-1"],
    subtopics: [
      {
        subtopicId: "ml-2-1",
        title: "Linear Algebra Essentials",
        description: "Vectors, matrices, eigenvalues, transformations",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          article: "https://www.deeplearningbook.org/contents/linear_algebra.html",
          practice: "https://www.khanacademy.org/math/linear-algebra",
          pdf: null
        },
        estimatedMinutes: 180,
        order: 1
      },
      {
        subtopicId: "ml-2-2",
        title: "Calculus for ML",
        description: "Derivatives, gradients, chain rule, optimization",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=WUvTyaaNkzM&list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",
          article: "https://www.deeplearningbook.org/contents/numerical.html",
          practice: "https://www.khanacademy.org/math/multivariable-calculus",
          pdf: null
        },
        estimatedMinutes: 150,
        order: 2
      },
      {
        subtopicId: "ml-2-3",
        title: "Probability & Statistics",
        description: "Distributions, hypothesis testing, Bayes theorem",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=HZGCoVF3YvM",
          article: "https://seeing-theory.brown.edu/",
          practice: "https://www.khanacademy.org/math/statistics-probability",
          pdf: null
        },
        estimatedMinutes: 130,
        order: 3
      }
    ]
  },
  {
    nodeId: "ml-node-3",
    roadmapId: "machine-learning-engineer",
    title: "Introduction to Machine Learning",
    description: "ML concepts, types of learning, model evaluation",
    weekNumber: 3,
    estimatedHours: 8,
    order: 3,
    published: true,
    prerequisites: ["ml-node-2"],
    subtopics: [
      {
        subtopicId: "ml-3-1",
        title: "What is Machine Learning?",
        description: "Supervised vs unsupervised vs reinforcement learning",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
          article: "https://vas3k.com/blog/machine_learning/",
          practice: "https://developers.google.com/machine-learning/crash-course",
          pdf: null
        },
        estimatedMinutes: 90,
        order: 1
      },
      {
        subtopicId: "ml-3-2",
        title: "Train-Test Split & Validation",
        description: "Cross-validation, overfitting, underfitting",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=fSytzGwwBVw",
          article: "https://scikit-learn.org/stable/modules/cross_validation.html",
          practice: "https://www.kaggle.com/learn/intro-to-machine-learning",
          pdf: null
        },
        estimatedMinutes: 100,
        order: 2
      },
      {
        subtopicId: "ml-3-3",
        title: "Model Evaluation Metrics",
        description: "Accuracy, precision, recall, F1-score, ROC-AUC",
        contentType: "external",
        resourceLinks: {
          youtube: "https://www.youtube.com/watch?v=4jRBRDbJemM",
          article: "https://scikit-learn.org/stable/modules/model_evaluation.html",
          practice: "https://machinelearningmastery.com/metrics-evaluate-machine-learning-algorithms-python/",
          pdf: null
        },
        estimatedMinutes: 90,
        order: 3
      }
    ]
  }
];

async function importMLRoadmap() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Check if roadmap already exists
    const existing = await db.collection('roadmaps').findOne({ slug: ML_ROADMAP.slug });

    if (existing) {
      console.log('⚠️  ML Roadmap already exists!');
      console.log('   Delete it first: db.roadmaps.deleteOne({ slug: "machine-learning-engineer" })');
      return;
    }

    // Create roadmap
    console.log('\n📚 Creating ML roadmap...');
    await db.collection('roadmaps').insertOne({
      ...ML_ROADMAP,
      stats: { totalNodes: 0, totalResources: 0, followers: 0, avgRating: 0 },
      quizBankStatus: 'incomplete',
      weakTopicResourcesStatus: 'incomplete',
      quizBankIds: [],
      quizAttemptLimit: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Roadmap created');

    // Create nodes
    console.log('\n📝 Creating nodes...');
    const result = await db.collection('roadmap_nodes').insertMany(ML_NODES);
    console.log(`✅ Created ${result.insertedCount} nodes`);

    // Update stats
    const totalSubtopics = ML_NODES.reduce((sum, n) => sum + n.subtopics.length, 0);
    await db.collection('roadmaps').updateOne(
      { slug: ML_ROADMAP.slug },
      {
        $set: {
          'stats.totalNodes': result.insertedCount,
          'stats.totalResources': totalSubtopics
        }
      }
    );

    console.log('\n🎉 Import Complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Roadmap: ${ML_ROADMAP.title}`);
    console.log(`   Weeks: ${ML_NODES.length} (only first 3 weeks imported)`);
    console.log(`   Subtopics: ${totalSubtopics}`);
    console.log(`\n🔗 View: http://localhost:3000/roadmaps/${ML_ROADMAP.slug}`);
    console.log(`\n💡 To add remaining weeks 4-24, copy the node structure above`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected');
  }
}

importMLRoadmap();
