# VisionAI - Serverless Image Processing Frontend

A modern, responsive React application that integrates with AWS serverless image processing APIs. Built with TypeScript, Tailwind CSS, and Framer Motion for a beautiful user experience.

## 🚀 Features

### Authentication System
- **User Registration**: Complete signup flow with email confirmation
- **User Login**: Secure authentication with JWT tokens
- **Profile Management**: View and edit user profile information
- **Protected Routes**: Automatic redirection for unauthenticated users

### Image Analysis
- **AI-Powered Recognition**: Uses AWS Rekognition for object detection
- **Real-time Analysis**: Instant results with confidence scores
- **Label Detection**: Identifies objects, scenes, and activities in images
- **Visual Results**: Beautiful UI displaying analysis results with confidence bars

### Image Processing
- **Format Conversion**: Convert images to different formats (JPEG, PNG, WebP)
- **Resize Options**: Customizable width and quality settings
- **Compression**: Optimize image file sizes
- **Metadata Display**: Show original and processed image information

### Image Conversion
- **Base64 Conversion**: Convert images to base64 format
- **Copy to Clipboard**: Easy copying of converted data
- **File Size Information**: Display conversion statistics

### User Experience
- **Toast Notifications**: Real-time feedback for all actions
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error messages
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Beautiful animations and transitions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with navigation
│   ├── ProtectedRoute.tsx      # Route protection component
│   └── Toast.tsx               # Toast notification component
├── contexts/
│   ├── AuthContext.tsx         # Authentication state management
│   └── ToastContext.tsx        # Toast notification management
├── pages/
│   ├── LandingPage.tsx         # Homepage with features showcase
│   ├── LoginPage.tsx           # User login form
│   ├── SignupPage.tsx          # User registration form
│   ├── ConfirmSignupPage.tsx   # Email confirmation
│   ├── DashboardPage.tsx       # Main dashboard with image processing
│   └── UserProfilePage.tsx     # User profile management
├── services/
│   └── api.ts                  # API service layer
└── App.tsx                     # Main application component
```

## 🔌 API Integration

The application integrates with the following API endpoints:

### Authentication APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/confirm-user` - Email confirmation
- `POST /api/auth/signin` - User login
- `GET /api/user/profile` - Get user profile

### Image Processing APIs
- `POST /api/rekognition/labels` - AI image analysis
- `POST /api/image/convert` - Basic image to base64 conversion
- `POST /api/image/convert-with-processing` - Advanced image processing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd serverless_image_processing_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎯 Usage Guide

### 1. Authentication Flow
1. **Sign Up**: Create a new account with username, email, and password
2. **Email Confirmation**: Enter the 6-digit code sent to your email
3. **Login**: Sign in with your credentials
4. **Profile**: Access your profile page to view account information

### 2. Image Analysis
1. **Upload Image**: Drag and drop or click to select an image
2. **Analyze**: Click "Analyze with AI" to detect objects and scenes
3. **View Results**: See detected labels with confidence scores
4. **Export**: Copy or export analysis results

### 3. Image Processing
1. **Upload Image**: Select an image to process
2. **Configure Options**: Set resize, quality, and format preferences
3. **Process**: Click "Process Image" to apply transformations
4. **View Results**: See processing statistics and metadata

### 4. Image Conversion
1. **Upload Image**: Select an image to convert
2. **Convert**: Click "Convert to Bytes" to get base64 data
3. **Copy Data**: Use the copy button to get the base64 string

## 🎨 UI Components

### Toast Notifications
- Success notifications for completed actions
- Error notifications for failed operations
- Info and warning notifications
- Auto-dismiss with manual close option

### Loading States
- Spinner animations during API calls
- Disabled buttons during processing
- Progress indicators for long operations

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions

## 🔒 Security Features

- JWT token authentication
- Protected routes
- Secure API communication
- Input validation
- Error boundary handling

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using modern web technologies**
