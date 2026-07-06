import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: "ADMIN" },
    create: {
      email,
      name: "Admin",
      hashedPassword,
      role: "ADMIN"
    }
  });

  const author = await prisma.user.findUnique({ where: { email: "writer@example.com" } });
  if (!author) {
    await prisma.user.create({
      data: {
        email: "writer@example.com",
        name: "Writer",
        hashedPassword: await bcrypt.hash("writerpass123", 12),
        role: "EDITOR"
      }
    });
  }

  // Team Members
  await Promise.all([
    prisma.teamMember.upsert({
      where: { slug: "alex-chen" },
      update: {},
      create: {
        fullName: "Alex Chen",
        slug: "alex-chen",
        position: "Lead Developer & Architect",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        bio: "Full-stack engineer with 8+ years building scalable web applications. Passionate about clean code, performance, and emerging technologies. Previously at Google and Stripe.",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        githubUrl: "https://github.com/alexchen",
        linkedinUrl: "https://linkedin.com/in/alexchen",
        telegramUrl: "https://t.me/alexchen",
        portfolioUrl: "https://alexchen.dev",
        yearsOfExp: 8,
        certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
        isActive: true,
        order: 0
      }
    }),
    prisma.teamMember.upsert({
      where: { slug: "sarah-miller" },
      update: {},
      create: {
        fullName: "Sarah Miller",
        slug: "sarah-miller",
        position: "UX/UI Design Lead",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        bio: "Award-winning designer crafting intuitive digital experiences. Believes in the power of design to transform businesses and delight users.",
        skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Motion Design"],
        githubUrl: null,
        linkedinUrl: "https://linkedin.com/in/sarahmiller",
        telegramUrl: "https://t.me/sarahmiller",
        portfolioUrl: "https://sarahmiller.design",
        yearsOfExp: 6,
        certifications: ["Google UX Certificate"],
        isActive: true,
        order: 1
      }
    }),
    prisma.teamMember.upsert({
      where: { slug: "omar-hassan" },
      update: {},
      create: {
        fullName: "Omar Hassan",
        slug: "omar-hassan",
        position: "Backend & DevOps Engineer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
        bio: "Systems engineer obsessed with reliability, security, and automation. Builds infrastructure that scales to millions of users.",
        skills: ["Go", "Rust", "Docker", "Kubernetes", "Terraform", "CI/CD"],
        githubUrl: "https://github.com/omarhassan",
        linkedinUrl: "https://linkedin.com/in/omarhassan",
        telegramUrl: "https://t.me/omarhassan",
        portfolioUrl: null,
        yearsOfExp: 7,
        certifications: ["Kubernetes CKA", "Terraform Associate"],
        isActive: true,
        order: 2
      }
    })
  ]);

  // Projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { slug: "fintech-dashboard" },
      update: {},
      create: {
        title: "Finova - Fintech Analytics Dashboard",
        slug: "fintech-dashboard",
        description: "A real-time financial analytics platform serving 50K+ active users. Features interactive data visualizations, automated reporting, and multi-currency support with sub-second query performance.",
        challenge: "Build a dashboard that could handle million-row datasets with instant filtering while maintaining a smooth, intuitive UX for both analysts and executives.",
        solution: "Implemented WebAssembly-based data processing, Redis caching layer, and a custom charting engine. Achieved 60fps interactions across all device types.",
        architecture: "Next.js + TypeScript frontend, Node.js microservices, PostgreSQL with TimescaleDB extension, Redis cache, AWS ECS container orchestration",
        results: "45% increase in user engagement, 3x faster reporting cycle, $2M+ annual savings for clients through automated analytics.",
        category: "Web Application",
        industry: "Finance",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS", "D3.js"],
        screenshots: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1460925895917-afdab827c62f?w=800&h=600&fit=crop"
        ],
        videoUrl: null,
        liveUrl: "https://finova.example.com",
        githubUrl: null,
        clientName: "FinTech Corp",
        clientLogo: null,
        budgetRange: "FROM_20K_100K",
        status: "COMPLETED",
        featured: true,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-30"),
        views: 1247
      }
    }),
    prisma.project.upsert({
      where: { slug: "healthcare-platform" },
      update: {},
      create: {
        title: "MedLink - Healthcare Platform",
        slug: "healthcare-platform",
        description: "HIPAA-compliant telemedicine platform enabling 10,000+ monthly video consultations with real-time health data monitoring and AI-powered triage.",
        challenge: "Create a platform that meets strict healthcare regulations while being accessible to non-technical patients and doctors alike.",
        solution: "Built with end-to-end encryption, WebRTC for video calls, and a React Native mobile app. Integrated with major lab systems for automatic result delivery.",
        architecture: "React, WebRTC, Node.js, MongoDB, FHIR API, HL7 integration, Azure healthcare APIs",
        results: "98% satisfaction rate, 200+ hospitals onboarded, reduced patient wait times by 65%.",
        category: "Healthcare",
        industry: "Healthcare",
        technologies: ["React", "WebRTC", "Node.js", "MongoDB", "Azure", "FHIR"],
        screenshots: [
          "https://images.unsplash.com/photo-1576091160399-112ba8eafc09?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
        ],
        liveUrl: "https://medlink.example.com",
        budgetRange: "FROM_20K_100K",
        status: "COMPLETED",
        featured: true,
        startDate: new Date("2023-09-01"),
        endDate: new Date("2024-03-15"),
        views: 892
      }
    }),
    prisma.project.upsert({
      where: { slug: "ecommerce-api" },
      update: {},
      create: {
        title: "ShopFlow - E-commerce API Suite",
        slug: "ecommerce-api",
        description: "High-throughput e-commerce infrastructure handling 1M+ daily transactions with real-time inventory, payment processing, and recommendation engine.",
        challenge: "Design a system that handles Black Friday-level traffic spikes without degradation while providing personalized shopping experiences.",
        solution: "Event-driven architecture with Kafka, GraphQL federation, Redis session management, ML-based product recommendations running in 50ms.",
        architecture: "GraphQL Federation, Node.js, Kafka, Redis, PostgreSQL, Elasticsearch, GCP",
        screenshots: [
          "https://images.unsplash.com/photo-1563013544-8f4206b344eb?w=800&h=600&fit=crop"
        ],
        liveUrl: null,
        githubUrl: "https://github.com/shopflow/api",
        category: "API / Backend",
        industry: "E-commerce",
        technologies: ["GraphQL", "Node.js", "Kafka", "Redis", "PostgreSQL", "Elasticsearch"],
        budgetRange: "FROM_5K_20K",
        status: "COMPLETED",
        views: 2341
      }
    }),
    prisma.project.upsert({
      where: { slug: "ai-content-platform" },
      update: {},
      create: {
        title: "ContentAI - AI Content Platform",
        slug: "ai-content-platform",
        description: "Generative AI platform for marketing teams, producing 10K+ pieces of content monthly across web, social, and email channels with brand consistency.",
        challenge: "Create an AI system that maintains brand voice consistency while producing diverse, non-repetitive content across multiple languages.",
        solution: "Fine-tuned LLMs with RAG architecture, custom prompt engineering framework, and real-time branding guidelines enforcement.",
        architecture: "Python FastAPI, LangChain, Pinecone vector DB, React frontend, AWS SageMaker, Vercel",
        screenshots: [
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
        ],
        liveUrl: "https://contentai.example.com",
        category: "AI / Machine Learning",
        industry: "Marketing",
        technologies: ["Python", "FastAPI", "LangChain", "React", "AWS SageMaker", "Pinecone"],
        budgetRange: "FROM_5K_20K",
        status: "COMPLETED",
        views: 567
      }
    }),
    prisma.project.upsert({
      where: { slug: "real-estate-digital-twin" },
      update: {},
      create: {
        title: "PropertyVision - Digital Twin Real Estate",
        slug: "real-estate-digital-twin",
        description: "Interactive 3D property visualization platform with drone-based mapping and virtual staging capabilities for premium real estate.",
        category: "Web Application",
        industry: "Real Estate",
        technologies: ["Three.js", "Next.js", "Python", "Blender", "AWS S3"],
        screenshots: [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
        ],
        budgetRange: "FROM_20K_100K",
        status: "COMPLETED",
        featured: false,
        views: 423
      }
    }),
    prisma.project.upsert({
      where: { slug: "blockchain-supply-chain" },
      update: {},
      create: {
        title: "ChainTrack - Supply Chain Blockchain",
        slug: "blockchain-supply-chain",
        description: "Traceability platform using blockchain for end-to-end supply chain transparency in food distribution across 12 countries.",
        category: "Blockchain",
        industry: "Supply Chain",
        technologies: ["Solidity", "React", "Go", "IPFS", "WebSocket"],
        screenshots: [
          "https://images.unsplash.com/photo-1639762681455-0a96e3c3ae3b?w=800&h=600&fit=crop"
        ],
        budgetRange: "FROM_20K_100K",
        status: "COMPLETED",
        views: 312
      }
    }),
    prisma.project.upsert({
      where: { slug: "gaming-leaderboard" },
      update: {},
      create: {
        title: "竞技通 - Gaming Leaderboard System",
        slug: "gaming-leaderboard",
        description: "Real-time competitive gaming platform with live leaderboards, tournaments for 100K+ gamers across multiple titles.",
        category: "Web Application",
        industry: "Gaming",
        technologies: ["Rust", "WebSockets", "Redis", "React", "Docker"],
        screenshots: [
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"
        ],
        budgetRange: "FROM_1K_5K",
        status: "COMPLETED",
        views: 1567
      }
    })
  ]);

  // Services
  await Promise.all([
    prisma.service.upsert({
      where: { slug: "web-development" },
      update: {},
      create: {
        title: "Web Development",
        slug: "web-development",
        description: "Custom web applications built with cutting-edge technologies. From complex dashboards to content-rich platforms, we deliver performant, accessible, and beautiful solutions that scale.",
        icon: "💻",
        features: ["Next.js & React Applications", "Progressive Web Apps", "API Development & Architecture", "Database Design & Optimization", "Performance & SEO Audit", "Ongoing Maintenance"],
        priceFrom: 5000,
        priceTo: 100000,
        featured: true,
        order: 0,
        isActive: true
      }
    }),
    prisma.service.upsert({
      where: { slug: "mobile-app-development" },
      update: {},
      create: {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "Native and cross-platform mobile applications for iOS and Android. We design beautiful interfaces and build robust backend systems to power your mobile experience.",
        icon: "📱",
        features: ["React Native & Flutter", "iOS & Android Native", "App Store Optimization", "Push Notifications", "Offline Support", "Analytics Integration"],
        priceFrom: 8000,
        priceTo: 80000,
        featured: true,
        order: 1,
        isActive: true
      }
    }),
    prisma.service.upsert({
      where: { slug: "ui-ux-design" },
      update: {},
      create: {
        title: "UI/UX Design",
        slug: "ui-ux-design",
        description: "Human-centered design that converts. From wireframes to polished prototypes, every pixel is intentional. We research, test, and iterate to find the perfect user experience.",
        icon: "🎨",
        features: ["User Research & Personas", "Wireframing & Prototyping", "Design Systems", "Usability Testing", "Interaction Design", "Brand Identity"],
        priceFrom: 3000,
        priceTo: 50000,
        featured: false,
        order: 2,
        isActive: true
      }
    }),
    prisma.service.upsert({
      where: { slug: "cloud-infrastructure" },
      update: {},
      create: {
        title: "Cloud Infrastructure",
        slug: "cloud-infrastructure",
        description: "Scalable, secure cloud architecture that grows with your business. We design deployment pipelines, monitoring systems, and infrastructure-as-code for zero-downtime operations.",
        icon: "☁️",
        features: ["AWS / GCP / Azure", "Container Orchestration", "CI/CD Pipelines", "Infrastructure as Code", "Monitoring & Alerting", "Cost Optimization"],
        priceFrom: 5000,
        priceTo: 60000,
        featured: false,
        order: 3,
        isActive: true
      }
    }),
    prisma.service.upsert({
      where: { slug: "database-architecture" },
      update: {},
      create: {
        title: "Database Architecture",
        slug: "database-architecture",
        description: "Data modeling, migration strategies, and performance optimization. Whether SQL or NoSQL, we architect database systems that handle millions of records with ease.",
        icon: "🗄️",
        features: ["Schema Design", "Performance Tuning", "Migration Planning", "Read Replicas", "Backup & Recovery", "Data Warehouse"],
        priceFrom: 3000,
        priceTo: 40000,
        featured: false,
        order: 4,
        isActive: true
      }
    }),
    prisma.service.upsert({
      where: { slug: "digital-consulting" },
      update: {},
      create: {
        title: "Digital Consulting",
        slug: "digital-consulting",
        description: "Strategic technology consulting for digital transformation. We help businesses choose the right stack, plan migrations, and build roadmaps for sustainable growth.",
        icon: "💡",
        features: ["Technology Assessment", "Architecture Review", "Digital Roadmap", "Team Augmentation", "Code Audit", "Performance Benchmarking"],
        priceFrom: 2000,
        priceTo: 30000,
        featured: false,
        order: 5,
        isActive: true
      }
    })
  ]);

  // Blog Posts - ensure author exists first
  const blogAuthor = await prisma.user.findUnique({ where: { email: "writer@example.com" } });
  if (!blogAuthor) {
    throw new Error("Blog author not found. Ensure the admin seed runs first.");
  }

  await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: "why-rust-for-web-backend" },
      update: {},
      create: {
        title: "Why Rust is the Future of Web Backend Development",
        slug: "why-rust-for-web-backend",
        excerpt: "Explore how Rust's memory safety guarantees, zero-cost abstractions, and growing ecosystem are making it the go-to choice for modern web backends. From actix to Axum, see real benchmarks.",
        content: `<p>The web backend landscape is evolving rapidly. For years, Node.js and Python have dominated, but Rust is emerging as a serious contender...</p><h2>Memory Safety Without GC</h2><p>Rust's ownership model eliminates entire classes of bugs without the performance penalty of garbage collection.</p><h2>Benchmarks That Impress</h2><p>In our testing, Rust-based APIs consistently outperformed Node.js by 5-10x on CPU-intensive tasks while using less memory.</p>`,
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab82?w=1200&h=600&fit=crop",
        status: "PUBLISHED",
        publishedAt: new Date("2024-11-15"),
        readingTime: 8,
        authorId: blogAuthor.id,
        categoryId: null
      }
    }),
    prisma.blogPost.upsert({
      where: { slug: "design-systems-scale" },
      update: {},
      create: {
        title: "Building Design Systems That Scale to 100+ Components",
        slug: "design-systems-scale",
        excerpt: "A deep dive into our design system that powers 15 product teams. We cover token architecture, component composition patterns, documentation strategies, and the pitfalls we encountered.",
        content: `<p>Design systems are great until they aren't. The moment you have 50+ components across teams, chaos ensues...</p><h2>Atomic Token Architecture</h2><p>We broke our design tokens into four layers: primitives, components, page layouts, and application themes.</p><h2>The Documentation Problem</h2><p>The best component is useless without great docs. We built a living style guide with interactive examples.</p>`,
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
        status: "PUBLISHED",
        publishedAt: new Date("2024-10-28"),
        readingTime: 12,
        authorId: blogAuthor.id,
        categoryId: null
      }
    }),
    prisma.blogPost.upsert({
      where: { slug: "nextjs-15-server-components" },
      update: {},
      create: {
        title: "Next.js 15: Server Components Changed Everything",
        slug: "nextjs-15-server-components",
        excerpt: "Server components are not just a performance optimization — they fundamentally change how we think about web architecture. Here's what broke, what improved, and what to watch for.",
        content: `<p>When Next.js 14 first introduced app router with RSC, there was steep learning curve. By version 15, things have stabilized...</p><h2>The Mental Model Shift</h2><p>Components are now servers-first. This means your default is zero client-side JavaScript unless you explicitly use 'use client'.</p><h2>What Broke in Our Codebase</h2><p>CSS modules stopped working, some libraries needed ESM-only builds, and form handling patterns changed significantly.</p>`,
        coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=600&fit=crop",
        status: "PUBLISHED",
        publishedAt: new Date("2024-12-05"),
        readingTime: 10,
        authorId: blogAuthor.id,
        categoryId: null
      }
    })
  ]);

  // Testimonials
  await Promise.all([
    prisma.testimonial.upsert({
      where: { id: "test1" },
      update: {},
      create: {
        id: "test1",
        name: "Michael Torres",
        position: "CTO",
        company: "Finova Technologies",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
        content: "The team delivered beyond our expectations. The analytics dashboard they built handles complex queries that our previous system struggled with for years. ROI was visible within weeks.",
        rating: 5,
        featured: true,
        approved: true,
        projectId: projects[0].id
      }
    }),
    prisma.testimonial.upsert({
      where: { id: "test2" },
      update: {},
      create: {
        id: "test2",
        name: "Emily Watson",
        position: "Product Director",
        company: "MedLink Health",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
        content: "Working with this team felt like having a world-class in-house department. They understood the complexity of healthcare compliance and made it feel easy on our end.",
        rating: 5,
        featured: true,
        approved: true,
        projectId: projects[1].id
      }
    }),
    prisma.testimonial.upsert({
      where: { id: "test3" },
      update: {},
      create: {
        id: "test3",
        name: "David Park",
        position: "Founder & CEO",
        company: "ShopScale",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        content: "The API they designed handles our Black Friday load without breaking a sweat. Our checkout conversion improved by 34% after the redesign. Incredible team.",
        rating: 5,
        featured: true,
        approved: true,
        projectId: projects[2].id
      }
    })
  ]);

  console.log(`\nDatabase seeded successfully!`);
  console.log(`- 4 Projects (2 featured)`);
  console.log(`- 3 Team Members`);
  console.log(`- 6 Services`);
  console.log(`- 3 Blog Posts (all published)`);
  console.log(`- 3 Testimonials (all approved)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
