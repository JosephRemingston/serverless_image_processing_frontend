# Serverless Media Processing Frontend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Project Structure](#project-structure)
4. [Component Documentation](#component-documentation)
5. [API Documentation](#api-documentation)
6. [Authentication Flow](#authentication-flow)
7. [State Management](#state-management)

## Project Overview
This is a React-based frontend application for a serverless media processing platform. The application allows users to upload media files, process them using cloud services, and manage their processed media assets.

## System Architecture
The frontend application is built with the following key technologies:
- React.js for UI components
- TailwindCSS for styling
- Framer Motion for animations
- Context API for state management
- Axios for API communications

## Project Structure
```
frontend/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── favicon.png
│   ├── index.html         # Main HTML file
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── api/               # API integration layer
│   │   ├── auth.js        # Authentication API calls
│   │   ├── media.js       # Media upload/processing API calls
│   │   └── processedImage.js # Processed media retrieval API calls
│   │
│   ├── assets/            # Application assets
│   │   └── Gemini_Generated_Image_klvcgcklvcgcklvc.png
│   │
│   ├── components/        # Reusable React components
│   │   ├── Footer.jsx     # Footer component
│   │   ├── ImageUploader.jsx # Media upload component
│   │   ├── LogoutModal.jsx  # Logout confirmation modal
│   │   ├── Navbar.jsx     # Navigation bar component
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   └── ui/           # UI components
│   │       ├── Badge.jsx
│   │       ├── ScrollArea.jsx
│   │       └── Skeleton.jsx
│   │
│   ├── context/          # React Context providers
│   │   └── AuthContext.js # Authentication context
│   │
│   ├── pages/           # Application pages
│   │   ├── HomePage.jsx  # Landing page
│   │   ├── LoginPage.jsx # User login
│   │   ├── UploadPage.jsx # Media upload page
│   │   └── UserDashboard.jsx # User's media dashboard
│   │
│   ├── App.css          # Global styles
│   ├── App.js           # Root component
│   ├── index.css        # Entry point styles
│   └── index.js         # Application entry point
│
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── README.md           # Project readme
└── tailwind.config.js  # Tailwind CSS configuration
```

## Component Documentation

### Pages

#### HomePage (HomePage.jsx)
The landing page of the application that provides:
- Hero section with animated heading and description
- "Get Started" button that redirects to:
  - Upload page if user is authenticated
  - Login page if user is not authenticated
- Registration button for new users
- Responsive design with mobile-first approach
- Animated interactions using Framer Motion

#### UserDashboard (UserDashboard.jsx)
A dashboard interface that:
- Displays user's processed media files
- Shows detailed AI analysis results for each image
- Provides a sidebar for quick navigation between files
- Implements loading states and error handling
- Displays confidence scores and detected labels
- Uses skeleton loading for better UX

#### LoginPage (LoginPage.jsx)
Authentication page that:
- Handles user login
- Provides form validation
- Shows error messages
- Redirects to appropriate pages after login

#### UploadPage (UploadPage.jsx)
Media upload interface that:
- Handles file uploads
- Shows upload progress
- Validates file types and sizes
- Provides feedback on upload status

### Components

#### Navbar (Navbar.jsx)
Navigation component that:
- Shows different options based on authentication state
- Provides navigation links
- Handles logout functionality
- Responsive design for mobile devices

#### ImageUploader (ImageUploader.jsx)
Upload component that:
- Handles drag and drop
- Shows upload preview
- Manages file validation
- Displays upload progress

#### LogoutModal (LogoutModal.jsx)
Modal component that:
- Confirms logout action
- Provides cancel option
- Handles logout process

#### ProtectedRoute (ProtectedRoute.jsx)
Route wrapper that:
- Protects authenticated routes
- Redirects unauthorized users
- Maintains authentication state

### API Integration (api/)

#### auth.js
Handles authentication-related API calls:
- Login
- Registration
- Token management
- Session handling

#### media.js
Manages media upload operations:
- File upload
- Upload progress tracking
- Error handling

#### processedImage.js
Handles processed media operations:
- Fetching processed images
- Retrieving AI analysis results
- Error handling

### Context (context/)

#### AuthContext (AuthContext.js)
Manages authentication state:
- User information
- Authentication tokens
- Login/logout functions
- Authentication status

## Authentication Flow
1. User attempts to access protected route
2. ProtectedRoute component checks authentication status
3. If not authenticated, redirects to login
4. User provides credentials
5. AuthContext updates global state
6. User is redirected to intended destination

## State Management
- Authentication state managed via AuthContext
- Component-level state managed with useState
- Side effects handled with useEffect
- Navigation managed with react-router-dom
