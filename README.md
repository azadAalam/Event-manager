# Event Management Platform

A modern, responsive web application for managing and discovering events. Built with React, Tailwind CSS, and modern web development practices.

![Project Preview](path-to-project-preview.png)

## 🌟 Features

### Authentication & User Management
- **Modern Authentication Flow**
  - Secure signup with email verification
  - Social login integration (Google, Facebook)
  - Password strength validation
  - Remember me functionality
  - Forgot password recovery

### Event Management
- **Event Creation & Management**
  - Create and edit events
  - Set event details (date, time, location)
  - Category-based organization
  - Rich text description support

### User Interface
- **Modern Design**
  - Clean and intuitive interface
  - Responsive layout (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Dark/Light mode support
  - Loading states and error handling

### Technical Features
- **Performance Optimized**
  - Code splitting and lazy loading
  - Optimized asset delivery
  - Client-side caching
  - Progressive Web App (PWA) ready

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/event-management-frontend.git
cd event-management-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create environment variables
```bash
cp .env.example .env
```
Update the `.env` file with your configuration:
```env
VITE_API_URL=your_api_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
event-management-frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── api/              # API integration
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── utils/            # Utility functions
│   └── assets/           # Static assets
├── public/               # Public assets
└── ...config files
```

## 🎨 UI Components

### Authentication Pages
- **Login Page**
  - Email/Password login
  - Social login options
  - Remember me functionality
  - Password visibility toggle
  - Forgot password link

- **Signup Page**
  - Email/Password registration
  - Password strength indicator
  - Real-time validation
  - Social signup options

### Core Components
- **Navbar**
  - Responsive design
  - Dynamic navigation
  - User authentication state
  - Mobile menu support

- **Event Cards**
  - Rich event preview
  - Category tags
  - Interactive elements
  - Loading states

## 🛠️ Technology Stack

- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context/Hooks
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **API Integration**: Axios
- **Authentication**: JWT

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## 🔒 Security Features

- JWT-based authentication
- Protected routes
- XSS protection
- CSRF protection
- Secure password handling
- HTTP-only cookies

## 🎯 Future Enhancements

- [ ] Event ticketing system
- [ ] Real-time notifications
- [ ] Event sharing functionality
- [ ] Advanced search filters
- [ ] User profiles
- [ ] Event analytics
- [ ] Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com)
- [React](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Hero Icons](https://heroicons.com)

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/event-management-frontend](https://github.com/yourusername/event-management-frontend) 