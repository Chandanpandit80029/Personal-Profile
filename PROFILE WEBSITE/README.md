# Personal Profile Website

A modern, full-featured personal portfolio and profile website built with **React 19**, **Vite 8**, **Firebase**, and **Tailwind CSS v4**. Includes a complete admin dashboard for managing content with role-based access control.

## Features

### Public Pages
- **Home** – Landing page with hero section and featured content
- **About** – Personal bio, skills, and background
- **Portfolio** – Showcase of projects with filtering and details
- **Services** – List of offered services with descriptions
- **Blog** – Blog posts with categories, search, and individual post pages (`/blog/:slug`)
- **Gallery** – Visual media gallery with upload support
- **Testimonials** – Client testimonials and reviews
- **Contact** – Contact form with inquiry submission

### Admin Dashboard
Secure admin panel with role-based access control (`admin`, `editor`, `viewer`):

| Page | Description |
|------|-------------|
| **Dashboard** | Overview with charts and statistics (Chart.js) |
| **Projects** | CRUD management for portfolio projects |
| **Blogs** | Create, edit, and manage blog posts |
| **Services** | Manage service offerings |
| **Gallery** | Upload and organize gallery images |
| **Testimonials** | Manage client testimonials |
| **Skills** | Update skill sets and proficiency levels |
| **Messages** | View and manage contact messages |
| **Inquiries** | Track and respond to inquiries |
| **Settings** | Site-wide configuration and social links |

### Technical Highlights
- ⚛️ **React 19** with modern hooks and context API
- ⚡ **Vite 8** for lightning-fast development and builds
- 🎨 **Tailwind CSS v4** for utility-first styling
- 🌙 **Dark Mode** support with persistent preference
- 🔥 **Firebase** backend (Authentication + Firestore database)
- ☁️ **Cloudinary** integration for image upload and optimization
- 🎞️ **Framer Motion** for smooth animations and transitions
- 📊 **Chart.js** with react-chartjs-2 for admin analytics
- 📝 **React Hook Form** for form handling and validation
- 🔔 **React Hot Toast** for notifications
- 📐 **react-easy-crop** for image cropping before upload
- 🔒 **Protected Routes** with role-based access control
- 🧩 **React Helmet Async** for SEO management
- 📦 **React Icons** for consistent iconography

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Firebase (Auth + Firestore) |
| **Media** | Cloudinary |
| **Animation** | Framer Motion |
| **Charts** | Chart.js + react-chartjs-2 |
| **Forms** | React Hook Form |
| **Routing** | React Router DOM v7 |
| **Notifications** | React Hot Toast |
| **Image Crop** | react-easy-crop |
| **SEO** | React Helmet Async |
| **Icons** | React Icons |
| **Linting** | ESLint 10 |

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd personal-profile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   
   Create a `.env` file in the root directory with the following variables:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   ```

   > **Note:** The project includes fallback demo values for development, but a real Firebase project must be configured for full functionality.

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Authentication** (Email/Password sign-in method)
3. Create a **Firestore** database
4. Add a user document in Firestore:
   ```
   Collection: users
   Document ID: [user's Firebase Auth UID]
   Fields: { role: "admin" }
   ```
5. Apply Firestore security rules from `firestore.rules`

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your **Cloud Name** from the dashboard
3. Create an **Upload Preset** with unsigned mode enabled

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
personal-profile/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # Static assets (images, icons)
│   ├── components/
│   │   ├── common/          # Reusable components (ImageCropper, ImageUpload)
│   │   └── layout/          # Layout components (Navbar, Footer, AdminSidebar, AdminLayout)
│   ├── config/
│   │   ├── firebase.js      # Firebase initialization
│   │   └── cloudinary.js    # Cloudinary configuration & upload helpers
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication context (login, logout, roles)
│   │   └── ThemeContext.jsx  # Dark mode context
│   ├── data/
│   │   └── dummyData.js     # Fallback data for development
│   ├── hooks/
│   │   └── useFirestore.js  # Custom hook for Firestore operations
│   ├── pages/
│   │   ├── public/          # Public-facing pages
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── Contact.jsx
│   │   └── admin/           # Admin dashboard pages
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Projects.jsx
│   │       ├── Blogs.jsx
│   │       ├── Services.jsx
│   │       ├── Gallery.jsx
│   │       ├── Testimonials.jsx
│   │       ├── Skills.jsx
│   │       ├── Messages.jsx
│   │       ├── Inquiries.jsx
│   │       └── Settings.jsx
│   ├── services/
│   │   └── firestoreService.js  # Centralized Firestore CRUD operations
│   ├── utils/
│   │   ├── ProtectedRoute.jsx   # Role-based route protection
│   │   └── imageCompressor.js   # Image compression utility
│   ├── App.jsx               # Root component with routing
│   ├── App.css               # Global styles
│   ├── index.css             # Tailwind entry point / base styles
│   └── main.jsx              # Application entry point
├── .env                      # Environment variables (not committed)
├── .gitignore
├── eslint.config.js
├── firebase.json             # Firebase project configuration
├── firestore.rules           # Firestore security rules
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Admin Access

1. Navigate to `/admin/login`
2. Sign in with a Firebase Authentication user
3. Users are assigned roles via Firestore (`users/{uid}` document with a `role` field)
4. Supported roles: `admin` (full access), `editor` (content management), `viewer` (read-only)

## License

This project is for personal use. All rights reserved.