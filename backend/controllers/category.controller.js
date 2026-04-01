import { Category } from "../models/category.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CATEGORY
// ─────────────────────────────────────────────────────────────────────────────
export const createCategory = async (req, res) => {
  try {
    const { name, icon, color, topics, projects, description, order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required.",
        success: false
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        message: "Category with this name already exists.",
        success: false
      });
    }

    const category = await Category.create({
      name: name.trim(),
      icon: icon || "Briefcase",
      color: color || "#D4A853",
      topics: Array.isArray(topics) ? topics : [],
      projects: Array.isArray(projects) ? projects : [],
      description: description || "",
      order: Number(order) || 0
    });

    return res.status(201).json({
      message: "Category created successfully.",
      category,
      success: true
    });
  } catch (error) {
    console.error('createCategory error:', error);
    return res.status(500).json({
      message: 'Error creating category.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export const getAllCategories = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const query = {};
    
    if (activeOnly === 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      categories,
      success: true,
      count: categories.length
    });
  } catch (error) {
    console.error('getAllCategories error:', error);
    return res.status(500).json({
      message: 'Error fetching categories.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET CATEGORY BY NAME
// ─────────────────────────────────────────────────────────────────────────────
export const getCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ name: decodeURIComponent(name) });

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('getCategoryByName error:', error);
    return res.status(500).json({
      message: 'Error fetching category.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET CATEGORY BY ID
// ─────────────────────────────────────────────────────────────────────────────
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false
      });
    }

    return res.status(200).json({
      category,
      success: true
    });
  } catch (error) {
    console.error('getCategoryById error:', error);
    return res.status(500).json({
      message: 'Error fetching category.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE CATEGORY
// ─────────────────────────────────────────────────────────────────────────────
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, color, topics, projects, description, isActive, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false
      });
    }

    if (name && name.trim() !== category.name) {
      const existing = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          message: "Category with this name already exists.",
          success: false
        });
      }
      category.name = name.trim();
    }

    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;
    if (topics !== undefined) category.topics = Array.isArray(topics) ? topics : [];
    if (projects !== undefined) category.projects = Array.isArray(projects) ? projects : [];
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = Number(order);

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully.",
      category,
      success: true
    });
  } catch (error) {
    console.error('updateCategory error:', error);
    return res.status(500).json({
      message: 'Error updating category.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CATEGORY
// ─────────────────────────────────────────────────────────────────────────────
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully.",
      success: true
    });
  } catch (error) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({
      message: 'Error deleting category.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE CATEGORY ACTIVE STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    return res.status(200).json({
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully.`,
      category,
      success: true
    });
  } catch (error) {
    console.error('toggleCategoryStatus error:', error);
    return res.status(500).json({
      message: 'Error toggling category status.',
      success: false,
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED DEFAULT CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export const seedCategories = async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: "Software Development",
        icon: "Code",
        color: "#D4A853",
        topics: [
          "Programming Fundamentals", "Data Structures", "Algorithms", "Object-Oriented Programming",
          "Design Patterns", "SOLID Principles", "Clean Code", "Code Review Best Practices",
          "Version Control with Git", "GitHub/GitLab/Bitbucket", "Branching Strategies", "Code Merging & Rebasing",
          "Debugging Techniques", "Unit Testing", "Integration Testing", "End-to-End Testing",
          "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)", "Mocking & Stubbing", "Continuous Integration",
          "Build Systems (Make, CMake, Gradle)", "Package Managers (npm, pip, maven)", "Dependency Management", "Semantic Versioning",
          "Software Architecture Patterns", "Microservices Architecture", "Monolithic Architecture", "Serverless Architecture",
          "RESTful API Design", "GraphQL", "gRPC", "WebSocket Communication",
          "Authentication & Authorization", "OAuth 2.0", "JWT Tokens", "Web Security (OWASP)",
          "Input Validation & Sanitization", "Error Handling Strategies", "Logging & Monitoring", "Performance Profiling",
          "Caching Strategies", "Database Optimization", "Query Performance Tuning", "Indexing Strategies",
          "Concurrency & Multithreading", "Memory Management", "Garbage Collection", "CPU & Memory Profiling",
          "Cross-Platform Development", "CLI Development", "Desktop Application Development", "Embedded Systems",
          "Real-time Systems", "Distributed Systems", "System Design Principles", "Scalability Patterns",
          "Load Balancing", "Message Queues (RabbitMQ, Kafka)", "Event-Driven Architecture", "CQRS Pattern"
        ],
        projects: [
          "Build a CLI Task Manager", "Design a Personal Budget Tracker", "Create a URL Shortener Service",
          "Build a Mini Search Engine", "Develop a File Encryption Tool", "Create a Markdown Editor",
          "Build a Chat Application", "Develop a Recipe Management System", "Create a Weather Dashboard",
          "Build an Inventory Management System"
        ],
        description: "Master software development fundamentals including algorithms, data structures, design patterns, and best practices. Build real-world applications and become a professional software developer."
      },
      {
        name: "Web Development",
        icon: "Globe",
        color: "#3b82f6",
        topics: [
          "HTML5 Semantic Elements", "HTML5 Forms & Validation", "CSS3 Flexbox", "CSS3 Grid Layout",
          "Responsive Design Principles", "CSS Variables (Custom Properties)", "CSS Animations & Transitions", "Modern CSS Frameworks (Tailwind, Bootstrap)",
          "JavaScript ES6+ Syntax", "DOM Manipulation & Traversal", "Event Handling & Delegation", "Async JavaScript Fundamentals",
          "Promises & Async/Await", "Fetch API & HTTP Requests", "AJAX Techniques", "JSON & JSON Web Tokens (JWT)",
          "React Fundamentals & JSX", "React Hooks (useState, useEffect)", "React Context & State Management", "React Router for Navigation",
          "Next.js Framework", "Server-Side Rendering (SSR)", "Static Site Generation (SSG)", "Client-Side Rendering (CSR)",
          "Vue.js Framework", "Vue Composition API", "Angular Fundamentals", "TypeScript for Web Development",
          "UI Component Libraries", "Responsive Images & Media", "Lazy Loading & Code Splitting", "Image Optimization",
          "Web Performance Optimization", "Core Web Vitals", "SEO Best Practices", "Accessibility Standards (WCAG)",
          "Web APIs & Browser APIs", "Browser DevTools Mastery", "PWA Fundamentals", "Service Workers & Offline Support",
          "Web Storage (localStorage, sessionStorage)", "Web Workers for Background Tasks", "WebSockets for Real-time", "HTTP/HTTPS Protocol Deep Dive",
          "RESTful API Design", "GraphQL Queries & Mutations", "CORS Configuration", "Web Security Best Practices",
          "XSS Prevention", "CSRF Protection", "Content Security Policy", "Cookie Security",
          "Bundlers (Webpack, Vite, esbuild)", "Module Systems (ESM, CommonJS)", "Polyfills & Transpilation", "Build Optimization"
        ],
        projects: [
          "Build a Personal Portfolio", "Create a Blog Platform", "Develop an E-commerce Landing Page",
          "Build a Social Media Dashboard", "Create a Real-time Chat App", "Develop a Weather App",
          "Build a Recipe Finder", "Create a Movie Search App", "Develop a Todo App with React",
          "Build a Portfolio Generator"
        ],
        description: "Become a full-stack web developer. Learn HTML, CSS, JavaScript, React, and modern web technologies to build responsive and interactive web applications."
      },
      {
        name: "Android Development",
        icon: "Smartphone",
        color: "#10b981",
        topics: [
          "Kotlin Fundamentals", "Java Basics for Android", "Android Studio Setup & Configuration", "Android Project Structure",
          "Activities & Lifecycle Methods", "Fragments & Fragment Lifecycle", "Intents & Bundle Handling", "Android Layouts (XML)",
          "ConstraintLayout Mastery", "Material Design Components", "RecyclerView & Adapters", "ViewBinding & Data Binding",
          "Jetpack ViewModel & LiveData", "Room Database & DAOs", "SQLite Fundamentals", "SharedPreferences & DataStore",
          "WorkManager for Background Tasks", "Background Processing with Coroutines", "Kotlin Coroutines Deep Dive", "Flow for Async Operations",
          "Retrofit for Networking", "OkHttp Interceptors", "JSON Parsing (Gson, Moshi)", "Image Loading (Glide, Coil, Picasso)",
          "Firebase Authentication (Email, Google, Phone)", "Firebase Firestore", "Firebase Realtime Database", "Firebase Cloud Messaging",
          "Push Notifications & Local Notifications", "Google Maps Integration", "Location Services & Geofencing", "Camera & Media Capture",
          "Sensor APIs (Accelerometer, Gyroscope)", "App Widgets Development", "Publishing to Google Play Store", "App Signing & Security",
          "ProGuard & R8 Code Shrinking", "Memory Management & Leaks", "Performance Optimization", "App Security Best Practices",
          "Unit Testing with JUnit", "UI Testing with Espresso", "Instrumented Tests", "CI/CD with GitHub Actions",
          "Gradle Build System & DSL", "Build Variants & Flavors", "Dependency Injection with Hilt", "Clean Architecture Principles",
          "Repository Pattern Implementation", "MVVM Architecture Pattern", "Jetpack Compose Basics", "Jetpack Navigation Component",
          "Testing in Android", "Debugging & Profiling", "App Bundle & APK Signing", "Feature Modules & Dynamic Delivery"
        ],
        projects: [
          "Build a BMI Calculator", "Create a Notes App with Room", "Develop a Weather Forecast App",
          "Build a Location Tracker", "Create a Quiz Application", "Develop a Chat App with Firebase",
          "Build a Music Player", "Create an Expense Tracker", "Develop a Recipe App",
          "Build a News Reader App"
        ],
        description: "Build modern Android applications using Kotlin, Jetpack Compose, and Android best practices. Learn mobile development from setup to publishing on the Play Store."
      },
      {
        name: "Cybersecurity",
        icon: "Shield",
        color: "#ef4444",
        topics: [
          "Security Fundamentals & Principles", "CIA Triad (Confidentiality, Integrity, Availability)", "Threat Modeling & Risk Assessment", "Security Governance & Compliance",
          "Network Security Basics", "Firewalls & Intrusion Detection", "VPNs & Network Encryption", "Network Protocols (TCP/IP, DNS, HTTP/S)",
          "Cryptography Fundamentals", "Symmetric Encryption (AES, DES)", "Asymmetric Encryption (RSA, ECC)", "Hashing Algorithms & Digital Signatures",
          "Public Key Infrastructure (PKI)", "SSL/TLS Certificates Management", "Authentication Methods & Protocols", "Multi-Factor Authentication (MFA)",
          "Password Security & Hashing", "Session Management & Tokens", "OAuth 2.0 & OpenID Connect", "SAML for Enterprise SSO",
          "Web Application Security", "OWASP Top 10 Vulnerabilities", "SQL Injection & Prevention", "Cross-Site Scripting (XSS)",
          "Cross-Site Request Forgery (CSRF)", "Content Security Policy (CSP)", "HTTPS Implementation & HSTS", "CORS Configuration & Security",
          "Ethical Hacking Methodology", "Penetration Testing Phases", "Vulnerability Assessment", "Security Scanning Tools & Techniques",
          "Nmap for Network Scanning", "Wireshark for Packet Analysis", "Metasploit Framework", "Burp Suite for Web Testing",
          "SQLMap for SQL Injection", "Linux for Security Professionals", "Bash Scripting for Automation", "Python for Security Testing",
          "Malware Analysis Fundamentals", "Static & Dynamic Analysis", "Sandboxing & Reverse Engineering", "Incident Response Planning",
          "Digital Forensics Basics", "Evidence Collection & Preservation", "Security Auditing & Compliance", "GDPR & Data Protection",
          "PCI-DSS Compliance", "HIPAA for Healthcare", "Cloud Security Fundamentals", "AWS/Azure Security Services",
          "Container Security (Docker, Kubernetes)", "API Security Best Practices", "IoT Security Challenges", "Mobile Security Essentials"
        ],
        projects: [
          "Build a Network Scanner Tool", "Create a Password Strength Checker", "Develop a Security Audit Tool",
          "Build a Vulnerability Scanner", "Create an Encryption Utility", "Develop a Security Dashboard",
          "Build a Secure Note App", "Create a Firewall Log Analyzer", "Develop a Phishing Detector",
          "Build a Security Training Platform"
        ],
        description: "Learn cybersecurity fundamentals, ethical hacking, penetration testing, and security best practices. Protect systems and data from cyber threats."
      },
      {
        name: "UI/UX Design",
        icon: "Palette",
        color: "#8b5cf6",
        topics: [
          "Design Thinking Methodology", "User-Centered Design Principles", "Design Process & Workflow", "User Research Fundamentals",
          "User Interviews & Facilitation", "Surveys & Questionnaires", "Persona Creation & Usage", "User Journey Mapping",
          "Information Architecture Design", "Site Mapping & Navigation", "Wireframing Techniques", "Low-Fidelity Prototyping",
          "High-Fidelity Prototyping", "Figma Mastery", "Sketch Fundamentals", "Adobe XD Basics",
          "Design Systems & Libraries", "Color Theory & Psychology", "Typography Fundamentals", "Visual Hierarchy Principles",
          "Layout & Composition", "Spacing & Grid Systems", "Icon Design Principles", "Illustration for UI",
          "Photography for Designers", "Micro-interactions Design", "Animation Principles in UI", "Motion Design & Easing",
          "Transition & Loading States", "Responsive Design Patterns", "Mobile-First Design Approach", "Accessibility Guidelines (WCAG)",
          "Inclusive Design Practices", "Usability Testing Methods", "A/B Testing & Experimentation", "Heatmaps & User Analytics",
          "Design Feedback Sessions", "Design Handoff to Developers", "Component Library Creation", "Design Tokens Implementation",
          "Brand Identity Development", "Logo Design Principles", "Style Guide Creation", "Portfolio Building & Presentation",
          "Design Collaboration Tools", "Design Sprint Methodology", "Agile & Lean Design", "Design Documentation Best Practices",
          "Client Presentation Skills", "Design Critique & Feedback", "Design Metrics & KPIs", "Continuous Design Improvement"
        ],
        projects: [
          "Design a Mobile Banking App", "Create a Social Media Dashboard", "Design an E-commerce Website",
          "Build a Travel Booking Interface", "Design a Fitness Tracking App", "Create a Food Delivery UI",
          "Design a Dashboard for Analytics", "Build a Music Streaming Interface", "Design a Healthcare App",
          "Create a Portfolio Website Design"
        ],
        description: "Master UI/UX design principles, tools, and methodologies. Learn to create beautiful, user-friendly interfaces and experiences that users love."
      },
      {
        name: "Cloud Computing",
        icon: "Cloud",
        color: "#06b6d4",
        topics: [
          "Cloud Computing Fundamentals", "IaaS, PaaS, SaaS Models", "Public Cloud Services", "Private & Hybrid Cloud",
          "Multi-Cloud Strategy", "AWS Core Services Overview", "EC2 & Compute Services", "S3 & Storage Solutions",
          "RDS & Managed Databases", "Lambda & Serverless Computing", "VPC & Networking Fundamentals", "IAM & Security Policies",
          "CloudWatch & Monitoring", "Azure Fundamentals", "Azure Virtual Machines", "Azure Blob Storage",
          "Azure SQL Database", "Azure Functions", "Google Cloud Platform Basics", "GCP Compute Engine",
          "Cloud Storage Solutions", "BigQuery & Data Analytics", "Docker Fundamentals", "Container Images & Registries",
          "Docker Compose Multi-Container", "Docker Networking & Volumes", "Kubernetes Architecture", "Pods, Deployments & ReplicaSets",
          "Services & Ingress Controllers", "ConfigMaps & Secrets Management", "Helm Charts for Kubernetes", "Container Orchestration Best Practices",
          "Auto-scaling Strategies", "Load Balancing & Traffic Management", "Serverless Architecture Patterns", "Function as a Service (FaaS)",
          "API Gateway Implementation", "Event-Driven Computing", "Cloud Security Best Practices", "Identity & Access Management (IAM)",
          "Encryption in Transit & at Rest", "Compliance & Governance", "Cost Optimization Strategies", "Cloud Migration Planning",
          "Disaster Recovery Solutions", "High Availability Architecture", "CDN & Edge Computing", "Caching Strategies (Redis, Memcached)",
          "Microservices in Cloud", "DevOps Practices in Cloud", "Infrastructure as Code (Terraform)", "CI/CD in Cloud Environments"
        ],
        projects: [
          "Deploy a Web App on AWS", "Build a Serverless API", "Create a Containerized Application",
          "Set up a Kubernetes Cluster", "Build a CI/CD Pipeline", "Design a Multi-Region Architecture",
          "Create a Serverless Image Processor", "Build a Scalable Chat System", "Deploy a ML Model on Cloud",
          "Create an Auto-scaling Infrastructure"
        ],
        description: "Master cloud computing with AWS, Azure, GCP, Docker, and Kubernetes. Learn to deploy, scale, and manage applications in the cloud."
      },
{
        name: "Data Science",
        icon: "Database",
        color: "#f59e0b",
        topics: [
          "Python for Data Science", "NumPy Array Operations", "Pandas DataFrames Mastery", "Data Cleaning & Preprocessing",
          "Data Wrangling Techniques", "Exploratory Data Analysis (EDA)", "Statistical Analysis Fundamentals", "Probability & Distributions",
          "Hypothesis Testing & p-values", "Regression Analysis", "Correlation & Causation", "Data Visualization Principles",
          "Matplotlib for Plotting", "Seaborn Statistical Graphics", "Plotly Interactive Visualizations", "Tableau for Dashboards",
          "Machine Learning Introduction", "Supervised Learning Algorithms", "Unsupervised Learning", "Classification Models",
          "Regression Techniques", "Decision Trees & Random Forests", "Gradient Boosting (XGBoost, LightGBM)", "Support Vector Machines",
          "Model Evaluation Metrics", "Cross-Validation Strategies", "Hyperparameter Tuning", "Feature Engineering Techniques",
          "Feature Selection Methods", "Dimensionality Reduction (PCA, t-SNE)", "Ensemble Learning Methods", "Model Interpretability",
          "Time Series Analysis", "Forecasting Methods", "Natural Language Processing", "Text Mining & Analytics",
          "Deep Learning Fundamentals", "Neural Network Architectures", "CNNs for Image Recognition", "RNNs & LSTMs for Sequences",
          "Big Data Processing with Spark", "Spark DataFrames & SQL", "SQL for Data Analysis", "Database Design Patterns",
          "ETL Pipeline Development", "Data Pipeline Architecture", "Cloud Data Platforms (Snowflake, BigQuery)", "Data Warehousing Concepts",
          "Data Lake Architecture", "MLOps Best Practices", "Model Deployment & Monitoring", "A/B Testing for ML Models"
        ],
        projects: [
          "Analyze Titanic Survival Data", "Build a Sales Prediction Model", "Create a Customer Segmentation",
          "Develop a Stock Price Predictor", "Build a Spam Detector", "Create a Movie Recommendation System",
          "Analyze Social Media Sentiment", "Build a Housing Price Predictor", "Develop a Fraud Detection System",
          "Create a Customer Churn Predictor"
        ],
        description: "Learn data science with Python, statistics, machine learning, and visualization. Extract insights from data and build predictive models."
      },
      {
        name: "Machine Learning",
        icon: "Brain",
        color: "#ec4899",
        topics: [
          "Machine Learning Fundamentals", "Types of Machine Learning", "Data Collection & Storage", "Data Preprocessing Techniques",
          "Feature Engineering Basics", "Feature Scaling & Normalization", "Train-Test-Validation Split", "Cross-Validation Methods",
          "Linear Regression", "Logistic Regression", "Support Vector Machines (SVM)", "Naive Bayes Classification",
          "K-Nearest Neighbors (KNN)", "Decision Tree Algorithms", "Ensemble Learning Methods", "Bagging & Bootstrap Aggregating",
          "Boosting Algorithms (AdaBoost)", "XGBoost Implementation", "LightGBM Optimization", "CatBoost for Categorical Data",
          "Model Evaluation Metrics", "Accuracy, Precision, Recall, F1", "ROC-AUC Curve Analysis", "Confusion Matrix Interpretation",
          "Overfitting & Underfitting", "Regularization Techniques (L1, L2)", "Bias-Variance Tradeoff", "Generalization Performance",
          "Hyperparameter Optimization", "Grid Search & Random Search", "Bayesian Optimization", "Automated ML (AutoML)",
          "Neural Network Basics", "Deep Learning Fundamentals", "CNNs for Image Classification", "CNNs for Object Detection",
          "RNNs for Sequential Data", "LSTM & GRU Architectures", "Transformer Architecture", "Self-Attention Mechanism",
          "BERT for NLP Tasks", "GPT Models & Text Generation", "Natural Language Processing", "Text Classification & Sentiment",
          "Named Entity Recognition (NER)", "Computer Vision Applications", "Object Detection Models (YOLO, SSD)", "Image Segmentation Techniques",
          "Transfer Learning Strategies", "Fine-tuning Pre-trained Models", "Reinforcement Learning Basics", "Q-Learning & Deep Q-Networks",
          "ML Pipelines with Scikit-learn", "Model Deployment Strategies", "MLOps & Model Monitoring", "Model Versioning & Registry"
        ],
        projects: [
          "Build an Image Classifier", "Create a Sentiment Analyzer", "Develop a Handwriting Recognition System",
          "Build a Fraud Detection Model", "Create a Recommendation Engine", "Develop a Chatbot",
          "Build an Anomaly Detection System", "Create a Price Prediction Model", "Develop a Speech Recognizer",
          "Build an Autonomous Agent"
        ],
        description: "Master machine learning algorithms, deep learning, and AI. Build intelligent systems that learn from data and make predictions."
      },
      {
        name: "Java Full Stack Developer",
        icon: "Coffee",
        color: "#f97316",
        topics: [
          "Java Programming Fundamentals", "Object-Oriented Programming in Java", "Java Collections Framework", "Generics & Type Erasure",
          "Exception Handling Best Practices", "Multithreading & Concurrency", "Streams & Lambda Expressions", "Java 8+ Modern Features",
          "JDBC & Database Connectivity", "MySQL Fundamentals", "PostgreSQL Administration", "Database Design Principles",
          "Hibernate ORM Framework", "JPA Entity Mapping", "Entity Relationships & Associations", "HQL & JPQL Queries",
          "Spring Framework Core", "Dependency Injection Patterns", "Spring Beans & ApplicationContext", "Bean Scopes & Lifecycle",
          "Spring MVC Architecture", "Controller Development", "Request Mapping & Binding", "Form Handling & Validation",
          "Spring Boot Fundamentals", "Auto-configuration Magic", "Spring Data JPA", "Building REST APIs with Spring",
          "Spring Security Implementation", "JWT Token Authentication", "OAuth2 & OpenID Connect", "Role-Based Access Control (RBAC)",
          "Thymeleaf Template Engine", "Template Fragments & Layouts", "View Resolution & Resolvers", "HTML Template Development",
          "RESTful API Design Principles", "API Documentation with Swagger", "OpenAPI Specification", "Postman for API Testing",
          "Maven Build Tool", "Gradle Build System", "Build Automation Pipelines", "Unit Testing with JUnit 5",
          "Mockito for Mocking", "Integration Testing Strategies", "Spring Test Framework", "TestContainers for Integration Tests",
          "CI/CD with Jenkins", "GitHub Actions for Java", "Docker for Java Applications", "Kubernetes for Java Microservices",
          "Microservices Architecture", "Spring Cloud Ecosystem", "Service Discovery with Eureka", "API Gateway with Zuul/Gateway"
        ],
        projects: [
          "Build a Library Management System", "Create an Employee Portal", "Develop an E-commerce Backend",
          "Build a Hospital Management System", "Create a Banking Application", "Develop a Social Media Backend",
          "Build an Online Exam System", "Create a Task Management Tool", "Develop a Booking Platform",
          "Build a Content Management System"
        ],
        description: "Become a full-stack Java developer. Learn Java, Spring Boot, Hibernate, and modern Java enterprise development to build robust applications."
      },
      {
        name: "Python Full Stack Developer",
        icon: "Cpu",
        color: "#84cc16",
        topics: [
          "Python Programming Fundamentals", "Data Structures in Python (Lists, Dicts, Sets)", "Object-Oriented Programming in Python", "Pythonic Code & Best Practices",
          "Decorators & Generators", "Context Managers & With Statements", "Exception Handling Patterns", "File I/O Operations",
          "Flask Framework Basics", "Flask Routing & URL Building", "Jinja2 Template Engine", "Flask-WTF Forms",
          "Django Framework Fundamentals", "Django Models & ORM", "Django Admin Interface", "Django QuerySet Operations",
          "Class-Based Views (CBV)", "Function-Based Views (FBV)", "Django Form Handling", "Form Validation & Cleaning",
          "User Authentication System", "Session Management", "User Registration & Profiles", "Password Reset & Recovery",
          "Building REST APIs with Django", "Django REST Framework (DRF)", "Serializer Classes & Validation", "ViewSets & Routers",
          "Authentication & Permissions in DRF", "Token-based Authentication", "JWT Implementation in Django", "CORS Configuration",
          "PostgreSQL Database Setup", "MySQL for Python Applications", "SQLite for Development", "Database Migrations with Django",
          "Celery for Async Tasks", "Redis Cache Configuration", "Background Job Processing", "Task Scheduling with Celery Beat",
          "WebSockets Fundamentals", "Django Channels Implementation", "Real-time Features Development", "Building Chat Applications",
          "Docker for Python Apps", "Gunicorn WSGI Server", "Nginx Configuration", "Cloud Deployment (AWS, Heroku)",
          "Testing in Django", "Pytest Framework", "Test Coverage Reports", "CI/CD Pipelines for Python"
        ],
        projects: [
          "Build an Online Learning Platform", "Create a Blogging System", "Develop an E-commerce Store",
          "Build a Social Networking App", "Create a Task Management Tool", "Develop a Job Portal",
          "Build an Inventory System", "Create a Booking Platform", "Develop a Forum Application",
          "Build a Real-time Notification System"
        ],
        description: "Master Python web development with Flask and Django. Build full-stack applications with databases, APIs, and deployment."
      },
      {
        name: "JS Full Stack Developer",
        icon: "Layers",
        color: "#eab308",
        topics: [
          "JavaScript Fundamentals", "ES6+ Syntax & Features", "Arrow Functions & Lexical this", "Destructuring Assignment",
          "Spread & Rest Operators", "Template Literals", "ES Modules (ESM)", "Classes & Inheritance in JS",
          "Async JavaScript Programming", "Callback Patterns", "Promises & Promise Chaining", "Async/Await Syntax",
          "Error Handling Best Practices", "Try-Catch-Finally", "Custom Error Classes", "Error Boundaries in React",
          "Node.js Fundamentals", "NPM & Package Management", "Node.js Event Loop", "File System Operations (fs)",
          "Express.js Framework", "Express Middleware", "Routing & Parameters", "Request & Response Objects",
          "MongoDB Database", "Mongoose ODM", "CRUD Operations", "Aggregation Pipeline",
          "User Authentication", "JWT Token Management", "bcrypt Password Hashing", "Session-based Authentication",
          "RESTful API Design", "API Versioning Strategies", "API Documentation", "Rate Limiting & Security",
          "React Hooks Deep Dive", "useState & useEffect", "Custom Hooks Development", "useReducer for Complex State",
          "React Context API", "State Management Solutions", "React Router v6", "Next.js Framework",
          "TypeScript Fundamentals", "Types & Interfaces", "Generics in TypeScript", "Type Guards & Narrowing",
          "Testing with Jest", "React Testing Library", "Integration Testing Strategies", "End-to-End Testing (Cypress)",
          "CI/CD Pipeline Setup", "GitHub Actions", "Docker for Node.js", "Deployment to Cloud Platforms"
        ],
        projects: [
          "Build a Weather Dashboard", "Create a Real-time Chat App", "Develop a Social Media Clone",
          "Build an E-commerce Platform", "Create a Project Management Tool", "Develop a Video Streaming App",
          "Build a Job Board", "Create a Dating App", "Develop a Collaboration Tool",
          "Build a Recipe Sharing Platform"
        ],
        description: "Become a full-stack JavaScript developer. Master Node.js, Express, MongoDB, React, and TypeScript to build modern web applications."
      },
      {
        name: "DevOps",
        icon: "Wrench",
        color: "#14b8a6",
        topics: [
          "DevOps Fundamentals & Culture", "DevOps Lifecycle & Workflow", "CI/CD Pipeline Design", "Agile & DevOps Integration",
          "Linux Operating System Basics", "Shell Scripting (Bash)", "Package Management (apt, yum)", "System Monitoring Tools",
          "Docker Container Fundamentals", "Container Concepts & Terminology", "Docker Images & Registries", "Docker Compose Multi-container",
          "Docker Networking & Storage", "Docker Volumes & Bind Mounts", "Multi-stage Docker Builds", "Docker Security Best Practices",
          "Kubernetes Architecture", "Pods, Nodes & Clusters", "Deployments & ReplicaSets", "Services & Ingress Networking",
          "ConfigMaps & Secrets Management", "Ingress Controllers Configuration", "Helm Charts & Package Management", "Kubernetes Dashboard & Monitoring",
          "AWS for DevOps Engineers", "EC2, ECS & Fargate", "Amazon EKS", "Lambda & Serverless Deployments",
          "Azure DevOps Services", "Azure Pipelines Configuration", "Azure Container Instances", "Azure Kubernetes Service (AKS)",
          "Google Cloud Build", "Cloud Run Serverless", "Google Kubernetes Engine (GKE)", "Artifact Registry Management",
          "Terraform Infrastructure as Code", "Terraform Providers & Resources", "Terraform Modules & Workspaces", "Terraform State Management",
          "Ansible Configuration Management", "Ansible Playbooks", "Ansible Roles Development", "Ansible Inventory Management",
          "Jenkins CI/CD Setup", "Jenkins Pipeline as Code", "Jenkinsfile Syntax", "Blue-Green & Canary Deployments",
          "GitHub Actions Workflows", "GitLab CI/CD Pipelines", "Bitbucket Pipelines", "CircleCI Configuration",
          "Application Monitoring & Logging", "Prometheus Metrics Collection", "Grafana Dashboard Creation", "ELK Stack (Elasticsearch, Logstash, Kibana)",
          "Container Security Scanning", "Image Vulnerability Scanning", "Secrets Management (Vault)", "Runtime Security Monitoring"
        ],
        projects: [
          "Build a CI/CD Pipeline", "Set up Kubernetes Cluster", "Create Infrastructure with Terraform",
          "Build a Docker-based Application", "Set up Monitoring Dashboard", "Create a Blue-Green Deployment",
          "Build an Auto-scaling System", "Create a GitOps Workflow", "Set up a Logging System",
          "Build a DevOps Dashboard"
        ],
        description: "Master DevOps practices, tools, and culture. Learn Docker, Kubernetes, CI/CD, and infrastructure automation to streamline software delivery."
      },
      {
        name: "AI/ML with Python",
        icon: "Zap",
        color: "#a855f7",
        topics: [
          "Python for AI/ML Development", "NumPy Array Computing", "Pandas Data Manipulation", "Data Preprocessing & Cleaning",
          "Scikit-learn Fundamentals", "Linear & Logistic Regression", "Decision Trees & Random Forests", "Ensemble Learning Methods",
          "Model Evaluation & Metrics", "Cross-Validation Strategies", "Hyperparameter Optimization", "ML Pipeline Construction",
          "TensorFlow 2.0 Basics", "Keras High-level API", "Building Neural Networks", "Training & Model Evaluation",
          "PyTorch Framework Fundamentals", "Autograd Automatic Differentiation", "Neural Network Modules (nn.Module)", "Optimizers & Learning Rates",
          "CNN Architecture Design", "Pooling & Stride Operations", "Transfer Learning Strategies", "Image Classification Projects",
          "RNN & LSTM Networks", "Sequence-to-Sequence Models", "Time Series Analysis", "Natural Language Processing Basics",
          "NLP with Transformers", "BERT for Text Understanding", "GPT Models & Text Generation", "Language Model Fine-tuning",
          "Computer Vision Applications", "Object Detection (YOLO, SSD)", "Image Segmentation (U-Net)", "Vision Transformers (ViT)",
          "Reinforcement Learning Basics", "Q-Learning Algorithm", "Policy Gradient Methods", "Deep Q-Network (DQN)",
          "Generative Adversarial Networks (GANs)", "Generative AI Models", "Variational Autoencoders (VAEs)", "AI Image Generation (DALL-E, Stable Diffusion)",
          "Model Deployment Strategies", "Flask API for ML Models", "FastAPI for ML Services", "Docker Containerization for ML",
          "MLflow Experiment Tracking", "Model Registry & Versioning", "Model Serving with TensorFlow Serving", "ONNX for Model Interoperability",
          "ML Pipelines Architecture", "Apache Airflow for ML Workflows", "Kubeflow for ML Pipelines", "MLOps Best Practices",
          "Cloud ML Platforms", "AWS SageMaker", "Google Vertex AI", "Azure Machine Learning"
        ],
        projects: [
          "Build a Handwritten Digit Classifier", "Create a Chatbot with Transformers", "Develop an Image Style Transfer",
          "Build a Sentiment Analyzer", "Create a Object Detection System", "Develop a Music Generator",
          "Build a Face Recognition System", "Create a Stock Price Predictor", "Develop a Language Translator",
          "Build an Autonomous Navigation Agent"
        ],
        description: "Build AI and machine learning applications with Python. Learn TensorFlow, PyTorch, and transformers to create intelligent systems."
      },
      {
        name: "Blockchain Developer",
        icon: "Blocks",
        color: "#6366f1",
        topics: [
          "Blockchain Fundamentals", "Distributed Ledger Technology", "Consensus Mechanisms (PoW, PoS)", "Cryptography in Blockchain",
          "Hashing Functions (SHA-256, Keccak)", "Digital Signatures & Verification", "Public/Private Key Cryptography", "Wallet Architecture & Types",
          "Ethereum Blockchain Basics", "Ethereum Virtual Machine (EVM)", "Smart Contracts Introduction", "Solidity Programming Language",
          "Solidity Syntax & Data Types", "Solidity Functions & Visibility", "Events & Logs in Solidity", "Modifiers & Access Control",
          "Contract Inheritance & Interfaces", "Solidity Libraries", "Contract Security Best Practices", "Gas Optimization Techniques",
          "Web3.js Library", "ethers.js Library", "Connecting DApps to Blockchain", "Reading Blockchain Data",
          "MetaMask Wallet Integration", "Wallet Connection in DApps", "Transaction Signing & Broadcasting", "Gas Estimation & Fees",
          "NFT Development Fundamentals", "ERC-721 Token Standard", "ERC-1155 Multi-Token Standard", "NFT Minting & Metadata",
          "DeFi (Decentralized Finance) Basics", "Decentralized Exchanges (DEX)", "Lending & Borrowing Protocols", "Yield Farming & Staking",
          "Common Solidity Patterns", "Smart Contract Security Best Practices", "Common Vulnerabilities (Reentrancy, Overflow)", "Smart Contract Auditing",
          "Upgradeable Smart Contracts", "Proxy Patterns (UUPS, Transparent)", "Diamond Pattern for Modular Contracts", "EIP-1967 Storage Slots",
          "Testing Smart Contracts", "Truffle Development Framework", "Hardhat Environment", "Foundry for Smart Contracts",
          "Chainlink Oracles Integration", "Accessing External Data", "Chainlink VRF for Randomness", "Chainlink Price Feeds",
          "Layer 2 Scaling Solutions", "Polygon (Matic) Network", "Arbitrum Rollups", "Optimism & Optimistic Rollups",
          "IPFS (InterPlanetary File System)", "Filecoin Storage Network", "Decentralized Storage Solutions", "IPNS (InterPlanetary Naming System)"
        ],
        projects: [
          "Build a Voting DApp", "Create an NFT Marketplace", "Develop a Decentralized Bank",
          "Build a Supply Chain Tracker", "Create a Crowdfunding Platform", "Develop a Gaming NFT",
          "Build a Lottery System", "Create a Token Swap", "Develop a Staking Platform",
          "Build a DAO Governance System"
        ],
        description: "Master blockchain development with Solidity, Ethereum, and Web3. Build decentralized applications, smart contracts, and DeFi projects."
      },
      {
        name: "Game Development",
        icon: "Gamepad2",
        color: "#22c55e",
        topics: [
          "Game Design Fundamentals", "Core Game Mechanics", "Game Loop Architecture", "Game States Management",
          "Unity Engine Basics", "Unity Editor Interface", "GameObjects & Components", "Transform & Hierarchy",
          "C# Programming for Unity", "MonoBehaviour Lifecycle", "Coroutines for Async", "Custom Events & Delegates",
          "2D Game Development", "Sprite Management", "Tilemap System", "Sprite Animation (2D)",
          "3D Game Development", "3D Models & Meshes", "Materials & Shaders", "Lighting Systems",
          "Unity Physics Engine", "Rigidbody Component", "Colliders & Triggers", "Physics Materials",
          "Character Controller Systems", "Player Movement Patterns", "Camera Following Systems", "Input System (New vs Legacy)",
          "Collision Detection Methods", "Raycasting Techniques", "Physics Layers & Matrix", "Character vs World Collision",
          "Unity UI System", "Canvas Rendering Modes", "UI Components (Button, Slider)", "UI Animation & Transitions",
          "Audio in Unity Games", "Sound Effects Implementation", "Background Music Systems", "Spatial Audio (3D Sound)",
          "Particle Systems", "Visual Effect Graph (VFX Graph)", "Shader Graph Basics", "Visual Effects Creation",
          "Game AI Fundamentals", "Pathfinding Algorithms (A*, NavMesh)", "Unity NavMesh System", "Behavior Trees",
          "State Machine Patterns", "Animation State Machines", "Blend Trees for Animation", "Inverse Kinematics (IK)",
          "Multiplayer Game Basics", "Networking Fundamentals", "Photon Unity Networking", "Mirror Networking Solution",
          "Mobile Game Development", "Touch Input Handling", "Mobile Performance Optimization", "Build Settings for Mobile",
          "Game Optimization Techniques", "Performance Profiling Tools", "Memory Management", "Asset Bundle System",
          "Publishing Games Overview", "App Store Guidelines", "Google Play Publishing", "Steam Distribution",
          "Monetization Strategies", "In-App Purchases", "Ad Integration", "Game Analytics"
        ],
        projects: [
          "Build a 2D Platformer", "Create a Pong Game", "Develop a Flappy Bird Clone",
          "Build a Tower Defense Game", "Create a Space Shooter", "Develop a Puzzle Game",
          "Build an Endless Runner", "Create a 3D Maze Game", "Develop a Multiplayer FPS",
          "Build a Mobile Racing Game"
        ],
        description: "Learn game development with Unity and C#. Build 2D and 3D games, implement game mechanics, physics, AI, and publish your own games."
      },
      {
        name: "iOS Development",
        icon: "Smartphone",
        color: "#3b82f6",
        topics: [
          "Swift Programming Fundamentals", "SwiftUI Framework Basics", "Xcode IDE Mastery", "Swift Playgrounds",
          "iOS App Project Structure", "App Lifecycle Methods", "View Controllers Deep Dive", "Navigation Controllers",
          "UIKit Component Library", "UIView & UIViewController", "Auto Layout Constraints", "SnapKit for Layouts",
          "SwiftUI Views & Modifiers", "VStack, HStack, ZStack", "Lists & Grids in SwiftUI", "Navigation Stack & NavigationLink",
          "SwiftUI State Management", "@State & @Binding", "@Published Property Wrapper", "ObservableObject & @ObservedObject",
          "Networking in iOS", "URLSession API", "async/await Concurrency", "JSON Encoding/Decoding",
          "Data Persistence Solutions", "UserDefaults Storage", "Core Data Framework", "SQLite with FMDB/Swift",
          "iOS Architecture Patterns", "MVVM Pattern Implementation", "MVC Architecture", "Clean Architecture Principles",
          "Combine Framework Basics", "Publishers & Subscribers", "Combine Operators", "Custom Publishers",
          "Animation in iOS", "SwiftUI Animation Modifiers", "UIView Animations", "Lottie for Animations",
          "Gesture Recognizers", "Tap & Long Press Gestures", "Drag, Pinch & Rotation", "Custom Gesture Recognizers",
          "Maps & Location Services", "MapKit Framework", "Core Location API", "Geofencing Implementation",
          "Camera & Photo Library", "UIImagePickerController", "PHPickerViewController", "AVFoundation for Media",
          "Background Task Processing", "Push Notifications Setup", "Local Notifications", "Background Fetch",
          "In-App Purchases Implementation", "StoreKit Framework", "Product Types & Subscriptions", "Receipt Validation",
          "App Store Connect Setup", "App Signing & Provisioning", "TestFlight Beta Testing", "App Store Optimization (ASO)"
        ],
        projects: [
          "Build a To-Do List App", "Create a Weather App", "Develop a Recipe Book",
          "Build a Fitness Tracker", "Create a Note-Taking App", "Develop a Currency Converter",
          "Build a Music Player", "Create a Habit Tracker", "Develop a Chat App",
          "Build a Location Reminder App"
        ],
        description: "Master iOS development with Swift and SwiftUI. Build beautiful iOS apps for iPhone and iPad using Apple's development tools."
      },
      {
        name: "React Native",
        icon: "Smartphone",
        color: "#06b6d4",
        topics: [
          "React Native Fundamentals", "Expo Framework & CLI", "React Native CLI Setup", "Project Structure & Organization",
          "Core Components", "View & Text Components", "Image & ScrollView", "TextInput & Forms",
          "Styling in React Native", "Flexbox Layout System", "StyleSheet API", "Platform-Specific Styles",
          "React Hooks Deep Dive", "useState & useReducer", "useEffect & Lifecycle", "useContext & useMemo",
          "Navigation in React Native", "React Navigation v6", "Stack Navigator Setup", "Tab Navigator Configuration",
          "State Management Solutions", "Context API Patterns", "Redux Toolkit", "Zustand State Management",
          "Networking in React Native", "Fetch API Implementation", "Axios HTTP Client", "REST API Integration",
          "Local Storage Options", "AsyncStorage Usage", "SQLite with react-native-sqlite", "Realm Database",
          "Animation Techniques", "Animated API Basics", "React Native Reanimated", "LayoutAnimation",
          "Gesture Handling", "PanResponder Usage", "Gesture Handler Library", "Swipeable Components",
          "Device APIs Access", "Camera & Media Library", "Location Services", "Biometric Authentication",
          "Push Notifications Setup", "Expo Notifications", "Firebase Cloud Messaging", "Local Notifications",
          "Maps Integration", "react-native-maps Library", "MapView Implementation", "Markers & Overlays",
          "Authentication Solutions", "Firebase Authentication", "Auth0 Integration", "JWT Token Management",
          "Form Handling Libraries", "Formik for Forms", "React Hook Form", "Validation with Yup/Zod",
          "Testing React Native", "Jest Unit Testing", "React Native Testing Library", "E2E Testing with Detox",
          "App Publishing Process", "iOS Build Configuration", "Android Build Setup", "App Store Submission"
        ],
        projects: [
          "Build a Cross-Platform Todo App", "Create a Weather Application", "Develop a Social Media App",
          "Build a Fitness Tracking App", "Create a Recipe App", "Develop a Chat Application",
          "Build a Movie Database App", "Create a Note-Taking App", "Develop a Shopping List App",
          "Build a Location-Based Reminder App"
        ],
        description: "Build cross-platform mobile apps with React Native. Use one codebase to create iOS and Android applications with native performance."
      },
      {
        name: "Flutter Development",
        icon: "Smartphone",
        color: "#3b82f6",
        topics: [
          "Flutter Framework Basics", "Dart Programming Language", "Widget System Architecture", "Hot Reload & Hot Restart",
          "Stateful vs Stateless Widgets", "Widget Lifecycle Methods", "BuildContext Understanding", "Build Methods & Tree",
          "Layout Widgets Deep Dive", "Container & Padding Widgets", "Row & Column Layouts", "Stack & Positioned",
          "GridView & ListView", "Expanded & Flexible Widgets", "Wrap & Flow Widgets", "Custom Painters & Canvas",
          "Navigation in Flutter", "Named Routes & Navigation", "Navigation 2.0 & GoRouter", "Deep Linking Implementation",
          "State Management Solutions", "setState for Simple State", "Provider Package", "Riverpod State Management",
          "BLoC Pattern Implementation", "Cubit for Simpler State", "GetX State Management", "StateNotifier Pattern",
          "Networking in Flutter", "http Package Basics", "Dio HTTP Client", "REST API Integration",
          "JSON Serialization", "json_serializable Package", "Freezed for Immutability", "Model Class Development",
          "Local Storage Solutions", "SharedPreferences", "Hive NoSQL Database", "SQLite with sqflite",
          "Firebase Integration", "Firebase Authentication", "Cloud Firestore", "Firebase Cloud Functions",
          "Animation in Flutter", "AnimatedBuilder Usage", "Hero Animations", "Custom Animation Controllers",
          "Gesture Handling", "GestureDetector Widget", "Dismissible Widget", "Draggable & DragTarget",
          "Forms & Validation", "TextFormField Widgets", "Form Widget & GlobalKey", "Validation Logic Implementation",
          "Platform Channels", "Method Channel Communication", "Event Channel Setup", "Native Code Integration",
          "Google Maps Integration", "google_maps_flutter", "MapView Implementation", "Markers & Polylines",
          "Image Handling", "image_picker Package", "Image Caching", "Image Cropping",
          "Push Notifications", "Firebase Cloud Messaging", "Local Notifications", "OneSignal Integration",
          "Testing Flutter Apps", "Unit Testing", "Widget Testing", "Integration Testing",
          "Publishing Apps", "Google Play Store", "Apple App Store", "App Bundle Configuration"
        ],
        projects: [
          "Build a WhatsApp Clone", "Create a Tinder-like App", "Develop a TikTok Clone",
          "Build a Spotify-like Music App", "Create an Uber Clone", "Develop a Instagram Clone",
          "Build a Todo App with Sync", "Create a Quiz App", "Develop a Camera App",
          "Build a Crypto Tracker App"
        ],
        description: "Master Flutter and Dart to build beautiful, natively compiled mobile apps for iOS and Android from a single codebase."
      },
      {
        name: "WordPress Development",
        icon: "Globe",
        color: "#21759b",
        topics: [
          "WordPress CMS Fundamentals", "Content Management Basics", "WordPress Dashboard", "Posts & Pages Management",
          "WordPress Themes Overview", "Theme Hierarchy System", "Template Tags & Functions", "The WordPress Loop",
          "WordPress PHP Programming", "functions.php File", "WordPress Hooks & Filters", "Actions & Filters",
          "Custom Post Types Creation", "register_post_type Function", "Custom Taxonomies", "Flushing Rewrite Rules",
          "Custom Fields Implementation", "Advanced Custom Fields (ACF)", "Meta Boxes Development", "WordPress Custom Fields API",
          "WP_Query Class", "Querying Posts & Pages", "Custom Queries", "Pagination Implementation",
          "WordPress Theme Development", "HTML to WordPress Conversion", "CSS Styling in WordPress", "JavaScript in WordPress",
          "Child Theme Creation", "Theme Options Pages", "WordPress Theme Customizer API", "Gutenberg Block Development",
          "WordPress Plugin Development", "Plugin File Structure", "Activation/Deactivation Hooks", "Shortcode Creation",
          "WordPress Widget Development", "Custom Widget Creation", "Dashboard Widgets", "WordPress REST API",
          "WooCommerce Fundamentals", "Products & Orders Management", "WooCommerce Hooks & Filters", "WooCommerce Customization",
          "WordPress Security Best Practices", "Data Sanitization", "Nonce Verification", "SQL Injection Prevention",
          "Performance Optimization", "Caching Strategies", "Image Optimization", "CDN Integration",
          "WordPress REST API", "Default API Endpoints", "Custom REST API Endpoints", "REST API Authentication",
          "Headless WordPress Architecture", "Next.js with WordPress", "Gatsby with WordPress", "Decoupled CMS Setup",
          "WordPress Multisite Network", "Network Administration", "Site Management", "Domain Mapping",
          "Migration & Deployment", "Backup Strategies", "Staging Environment Setup", "Production Deployment"
        ],
        projects: [
          "Build a Custom Theme", "Create a Membership Site", "Develop an E-commerce Store",
          "Build a Portfolio Website", "Create a Blog Network", "Develop a Job Board",
          "Build a Real Estate Listing", "Create a Restaurant Reservation System", "Develop an Event Management Site",
          "Build a Learning Management System"
        ],
        description: "Learn WordPress development from basics to advanced. Create custom themes, plugins, and build professional websites with the world's most popular CMS."
      },
      {
        name: "Shopify Development",
        icon: "ShoppingCart",
        color: "#96bf48",
        topics: [
          "Shopify Platform Fundamentals", "Store Setup & Configuration", "Shopify Admin Dashboard", "Products & Collections Management",
          "Liquid Template Language", "Liquid Syntax & Basics", "Objects & Variables", "Liquid Filters",
          "Liquid Control Flow", "For Loops & Iteration", "Theme Architecture", "Sections & Blocks System",
          "Shopify Theme Development", "Storefront API Basics", "Storefront UI Development", "Shopify Theme Kit",
          "Custom Theme Creation", "Theme Customization", "Theme Settings Configuration", "Theme Documentation",
          "Liquid Object Reference", "Product Object Properties", "Collection Object", "Cart Object & API",
          "Liquid Filters Reference", "String Manipulation Filters", "Array Filters", "Math Filters",
          "HTML/CSS in Shopify", "Responsive Theme Design", "CSS Architecture", "JavaScript in Shopify",
          "Shopify App Development", "Shopify CLI Setup", "Node.js for Shopify Apps", "Embedded App Development",
          "Sales Channels Overview", "Online Store Channel", "Shopify POS System", "Shopify Channel Integration",
          "Checkout Customization", "Checkout Extensions", "Post-Purchase Extensions", "Thank You Page Customization",
          "Payment Gateway Setup", "Payment Icons Configuration", "Currency Settings", "Tax Configuration",
          "Shipping Setup & Configuration", "Shipping Zones Management", "Shipping Rates Setup", "Free Shipping Rules",
          "Inventory Management", "Stock Tracking System", "Product Variants", "Inventory Updates & Sync",
          "Shopify Marketing Tools", "Discount Codes & Promotions", "Email Marketing Integration", "Shopify SEO",
          "Analytics & Reporting", "Google Analytics Integration", "Shopify Reports", "Store Analytics Dashboards",
          "Store Performance Optimization", "Theme Speed Optimization", "Image Optimization", "Core Web Vitals"
        ],
        projects: [
          "Build a Custom Shopify Theme", "Create a Dropshipping Store", "Develop a Subscription Box Store",
          "Build a Fashion Boutique", "Create a Digital Products Store", "Develop a Multi-Vendor Marketplace",
          "Build a Beauty & Cosmetics Store", "Create a Fitness Equipment Store", "Develop a Home Decor Store",
          "Build a Custom App Extension"
        ],
        description: "Master Shopify theme development with Liquid, build custom stores, and create Shopify apps. Learn to build professional e-commerce solutions."
      }
];

    let created = 0;
    let updated = 0;

    for (let i = 0; i < defaultCategories.length; i++) {
      const cat = defaultCategories[i];
      const result = await Category.findOneAndUpdate(
        { name: cat.name },
        { ...cat, order: i },
        { upsert: true, new: true, runValidators: true }
      );
      if (result.createdAt === result.updatedAt) {
        created++;
      } else {
        updated++;
      }
    }

    return res.status(201).json({
      message: `Seeded ${created} new and updated ${updated} existing categories.`,
      count: created + updated,
      created,
      updated,
      success: true
    });
  } catch (error) {
    console.error('seedCategories error:', error);
    return res.status(500).json({
      message: 'Error seeding categories.',
      success: false,
      error: error.message,
    });
  }
};
