export const dummyProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with payment integration, inventory management, and real-time analytics dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    category: 'full-stack',
    images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce'],
    liveUrl: 'https://example.com/ecommerce',
    githubUrl: 'https://github.com/username/ecommerce',
    featured: true,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    title: 'Social Media App',
    description: 'A real-time social media application with chat, notifications, and content sharing capabilities.',
    technologies: ['React Native', 'Firebase', 'Socket.io', 'Redux'],
    category: 'mobile',
    images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/social'],
    liveUrl: 'https://example.com/social',
    githubUrl: 'https://github.com/username/social',
    featured: true,
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: '3',
    title: 'AI Task Manager',
    description: 'An intelligent task management system with AI-powered prioritization and scheduling.',
    technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    category: 'ai',
    images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/taskmanager'],
    liveUrl: 'https://example.com/tasks',
    githubUrl: 'https://github.com/username/taskmanager',
    featured: true,
    createdAt: new Date('2024-03-10').toISOString()
  },
  {
    id: '4',
    title: 'Fitness Tracker',
    description: 'A comprehensive fitness tracking application with workout plans, nutrition tracking, and progress analytics.',
    technologies: ['Vue.js', 'Express', 'MySQL', 'Chart.js'],
    category: 'web',
    images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/fitness'],
    liveUrl: 'https://example.com/fitness',
    githubUrl: 'https://github.com/username/fitness',
    featured: false,
    createdAt: new Date('2024-04-05').toISOString()
  }
];

export const dummyBlogs = [
  {
    id: '1',
    title: 'Building Scalable Web Applications with React',
    slug: 'building-scalable-web-apps-react',
    excerpt: 'Learn the best practices for building scalable web applications using React and modern JavaScript.',
    content: 'Full article content about building scalable web applications...',
    category: 'Development',
    tags: ['React', 'JavaScript', 'Web Development'],
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/samples/blog/react',
    featured: true,
    publishDate: new Date('2024-03-15').toISOString(),
    readTime: '8 min read',
    author: 'Admin'
  },
  {
    id: '2',
    title: 'The Future of AI in Web Development',
    slug: 'future-ai-web-development',
    excerpt: 'Exploring how artificial intelligence is transforming the web development landscape.',
    content: 'Full article content about AI in web development...',
    category: 'Technology',
    tags: ['AI', 'Machine Learning', 'Web Development'],
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/samples/blog/ai',
    featured: true,
    publishDate: new Date('2024-02-20').toISOString(),
    readTime: '6 min read',
    author: 'Admin'
  },
  {
    id: '3',
    title: 'Mastering Tailwind CSS: Tips and Tricks',
    slug: 'mastering-tailwind-css-tips',
    excerpt: 'Advanced Tailwind CSS techniques to streamline your workflow and create beautiful designs.',
    content: 'Full article content about Tailwind CSS...',
    category: 'Design',
    tags: ['CSS', 'Tailwind', 'Design'],
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/samples/blog/tailwind',
    featured: false,
    publishDate: new Date('2024-01-10').toISOString(),
    readTime: '5 min read',
    author: 'Admin'
  }
];

export const dummyServices = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Custom web applications built with modern frameworks and best practices. From landing pages to complex SaaS platforms.',
    price: '₹79,999+',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/services/web',
    features: ['Responsive Design', 'SEO Optimization', 'Performance Tuning', 'API Integration']
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile applications using React Native and Flutter for iOS and Android.',
    price: '₹1,99,999+',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/services/mobile',
    features: ['Cross-Platform', 'Push Notifications', 'Offline Support', 'App Store Deployment']
  },
  {
    id: '3',
    name: 'UI/UX Design',
    description: 'User-centered design solutions that combine aesthetics with functionality for optimal user experiences.',
    price: '₹49,999+',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/services/design',
    features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems']
  },
  {
    id: '4',
    name: 'Cloud Solutions',
    description: 'Cloud architecture design and migration services on AWS, Google Cloud, and Azure.',
    price: '₹99,999+',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/services/cloud',
    features: ['Cloud Migration', 'DevOps', 'Auto Scaling', 'Security']
  }
];

export const dummyGallery = [
  {
    id: '1',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/gallery/photo1',
    category: 'Nature',
    title: 'Mountain Sunset'
  },
  {
    id: '2',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/gallery/photo2',
    category: 'Architecture',
    title: 'Modern Building'
  },
  {
    id: '3',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/gallery/photo3',
    category: 'Technology',
    title: 'Workspace Setup'
  },
  {
    id: '4',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/portrait',
    category: 'People',
    title: 'Portrait Photography'
  }
];

export const dummyTestimonials = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    designation: 'CEO, TechStart Inc.',
    review: 'Working with this developer was an amazing experience. The project was delivered on time and exceeded our expectations.',
    rating: 5,
    photo: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/sarah',
    createdAt: new Date('2024-03-01').toISOString()
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    designation: 'CTO, Digital Solutions',
    review: 'Exceptional technical skills and great communication throughout the project. Highly recommended for any web development needs.',
    rating: 5,
    photo: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/michael',
    createdAt: new Date('2024-02-15').toISOString()
  },
  {
    id: '3',
    clientName: 'Emily Rodriguez',
    designation: 'Marketing Director, BrandCo',
    review: 'The portfolio website created for our company perfectly captured our brand identity. Incredible attention to detail.',
    rating: 4,
    photo: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/emily',
    createdAt: new Date('2024-01-20').toISOString()
  }
];

export const dummySkills = [
  { id: '1', name: 'React', percentage: 95, icon: 'FaReact' },
  { id: '2', name: 'Node.js', percentage: 90, icon: 'FaNodeJs' },
  { id: '3', name: 'Python', percentage: 85, icon: 'FaPython' },
  { id: '4', name: 'JavaScript', percentage: 92, icon: 'FaJs' },
  { id: '5', name: 'TypeScript', percentage: 88, icon: 'SiTypescript' },
  { id: '6', name: 'MongoDB', percentage: 82, icon: 'SiMongodb' },
  { id: '7', name: 'AWS', percentage: 78, icon: 'FaAws' },
  { id: '8', name: 'Docker', percentage: 75, icon: 'FaDocker' }
];

export const dummySocialLinks = [
  { platform: 'GitHub', url: 'https://github.com/username', icon: 'FaGithub' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'FaLinkedin' },
  { platform: 'Twitter', url: 'https://twitter.com/username', icon: 'FaTwitter' },
  { platform: 'Instagram', url: 'https://instagram.com/username', icon: 'FaInstagram' }
];

export const dummySettings = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  bio: 'Passionate full-stack developer with 5+ years of experience building modern web applications. I specialize in React, Node.js, and cloud technologies.',
  profilePhoto: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/developer',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  aboutBio: 'I am a dedicated software engineer with a passion for creating innovative solutions that make a difference. With expertise across the full stack, I deliver high-quality, scalable applications that drive business growth.',
  education: [
    { degree: 'B.S. Computer Science', institution: 'Stanford University', year: '2019' },
    { degree: 'M.S. Software Engineering', institution: 'MIT', year: '2021' }
  ],
  experience: [
    { role: 'Senior Full Stack Developer', company: 'Tech Corp', period: '2022-Present', description: 'Leading development of cloud-native applications' },
    { role: 'Full Stack Developer', company: 'Startup Inc.', period: '2019-2022', description: 'Built and maintained multiple web applications' }
  ],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023' },
    { name: 'Google Cloud Professional', issuer: 'Google', year: '2022' }
  ]
};

export const pricingPlans = [
  {
    name: 'Basic',
    price: '₹29,999',
    period: '/project',
    features: ['Single Page Website', 'Responsive Design', 'Basic SEO', '1 Revision'],
    highlighted: false
  },
  {
    name: 'Professional',
    price: '₹99,999',
    period: '/project',
    features: ['Multi-page Website', 'Custom Design', 'API Integration', 'Admin Panel', 'SEO Optimization', '3 Revisions'],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: '₹2,99,999+',
    period: '/project',
    features: ['Full-stack Application', 'Database Design', 'Cloud Deployment', 'Advanced Security', 'Priority Support', 'Unlimited Revisions'],
    highlighted: false
  }
];
