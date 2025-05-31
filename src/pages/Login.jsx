import React from "react"
import { useState } from "react"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Eye, EyeOff, Facebook } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import axios from 'axios'

const API_BASE_URL = 'https://event-manager-backend-mu.vercel.app/api' // Update with your actual API URL

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState(location.state?.message || "")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Store user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect to the previous page or home
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl mt-16 overflow-hidden flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="text-sm text-gray-600">
              New member? <Link to="/signup" className="text-blue-600 hover:underline font-medium">Sign up</Link>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500">Welcome back to Easymail</p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12 py-3 border-gray-200 rounded-xl text-gray-900 bg-gray-50"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="flex space-x-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  ))}
                </div>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-20 pr-12 py-3 border-gray-200 rounded-xl text-gray-900 bg-gray-50"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            {/* <div className="flex space-x-4">
              <Button variant="outline" className="flex-1 py-3 rounded-xl border-gray-200">
                <Facebook className="w-5 h-5 text-blue-600" />
              </Button>
              <Button variant="outline" className="flex-1 py-3 rounded-xl border-gray-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
            </div> */}
          </form>

          {/* Language Selector */}
          <div className="mt-8 flex items-center space-x-2">
            <div className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center">
              <div className="w-3 h-2 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm text-gray-600">ENG</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 relative overflow-hidden">
          {/* Floating Cards */}
          <div className="absolute inset-0 p-8">
            {/* Inbox Card */}
            <div className="absolute top-16 right-16 bg-white rounded-2xl p-6 shadow-lg w-48">
              <div className="text-orange-500 text-sm font-medium mb-2">Inbox</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">176,18</div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  45
                </div>
                <div className="flex-1">
                  <svg className="w-full h-8" viewBox="0 0 100 30">
                    <path
                      d="M10,20 Q30,10 50,15 T90,10"
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10,20 Q30,25 50,20 T90,25"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="absolute top-32 right-4 space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-black rounded-full"></div>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="absolute bottom-16 right-16 bg-white rounded-2xl p-6 shadow-lg w-64">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-blue-500 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">Your data, your rules</div>
              <div className="text-sm text-gray-500">Your data belongs to you, and our encryption ensures that</div>
            </div>
          </div>

          {/* Background Shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full transform -translate-x-16 translate-y-16"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 