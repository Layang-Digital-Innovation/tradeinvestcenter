"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/auth.service';

// Force this page to render dynamically at request time to avoid build-time prerendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        router.replace('/dashboard');
      }
    };
    
    // Add a small delay to prevent immediate redirects
    const timeoutId = setTimeout(checkAuth, 100);
    
    // Show success message if user just registered
    if (registered === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, router, registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-yellow-50 px-6 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {showSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg shadow"
          >
            Registration successful! Please log in with your credentials.
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow"
          >
            {error}
          </motion.div>
        )}
        
        <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-purple-900 mb-2">Welcome Back</h1>
              <p className="text-purple-600">Sign in to your account to continue</p>
            </motion.div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-purple-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-yellow-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-purple-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-yellow-500 hover:text-yellow-600">
                Sign up now
              </Link>
            </p>
          </div>
          
          
        </div>
      </motion.div>
    </div>
  );
}