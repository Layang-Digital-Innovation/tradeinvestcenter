"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectNotifications } from '@/contexts/ProjectNotificationContext';
import InvestmentService from '@/services/investment.service';
import { Notification, NotificationResponse } from '@/types/investment.types';
import { 
  FiBell, 
  FiSearch, 
  FiSettings, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiChevronDown,
  FiMail,
  FiHelpCircle,
  FiSun,
  FiMoon,
  FiSidebar,
  FiShoppingCart
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

interface DashboardNavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
}



const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ 
  onMobileMenuToggle, 
  isMobileMenuOpen,
  onSidebarToggle,
  isSidebarCollapsed
}) => {
  const { user, logout } = useAuth();
  const { pendingProjectsCount } = useProjectNotifications();
  const { count: cartCount } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Load notifications and unread count
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        const [notificationsData, unreadCountData] = await Promise.all([
          InvestmentService.getNotifications(1, 10),
          InvestmentService.getUnreadNotificationCount()
        ]);
        
        console.log('Raw notifications data:', notificationsData);
        console.log('Raw unread count data:', unreadCountData);
        
        // Handle backend response structure: { notifications: [...], pagination: {...}, unreadCount: number }
        const notificationsArray = notificationsData.notifications || [];
        
        // Handle unread count from different sources
        let unreadCountValue = 0;
        if (typeof unreadCountData?.count === 'number') {
          unreadCountValue = unreadCountData.count;
        } else if (typeof notificationsData?.unreadCount === 'number') {
          // Use unreadCount from notifications response as fallback
          unreadCountValue = notificationsData.unreadCount;
        } else if (typeof unreadCountData === 'number') {
          unreadCountValue = unreadCountData;
        }
        
        console.log('Processed notifications:', notificationsArray);
        console.log('Processed unread count:', unreadCountValue);
        
        setNotifications(notificationsArray);
        setUnreadCount(unreadCountValue);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Fallback to empty state
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual dark mode logic
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await InvestmentService.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    try {
      const now = new Date();
      const notificationDate = typeof date === 'string' ? new Date(date) : date;
      
      // Check if date is valid
      if (!notificationDate || isNaN(notificationDate.getTime())) {
        return 'Unknown time';
      }
      
      const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown time';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu button and logo */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200"
              onClick={onMobileMenuToggle}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>

            {/* Logo for mobile */}
            <div className="md:hidden ml-3 flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-1.5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">TIC</span>
            </div>
          </div>

          {/* Center - Sidebar toggle and Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            {/* Sidebar collapse toggle button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200 mr-3"
              onClick={onSidebarToggle}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="sr-only">{isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
              <FiSidebar className="block h-5 w-5" />
            </button>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, investments, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3 text-sm text-gray-500">
                    Search results for "{searchQuery}" would appear here
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions and user menu */}
          <div className="flex items-center space-x-4">
            {/* Search button for mobile */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Cart */}
            <Link href="/dashboard/cart" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <FiShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiBell className="h-5 w-5" />
                {(unreadCount > 0 || pendingProjectsCount > 0) && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount + pendingProjectsCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
               {isNotificationOpen && (
                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                   <div className="p-4 border-b border-gray-200">
                     <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                   </div>
                   <div className="max-h-96 overflow-y-auto">
                     {isLoadingNotifications ? (
                       <div className="p-4 text-center text-gray-500">
                         Loading notifications...
                       </div>
                     ) : notifications && notifications.length === 0 && pendingProjectsCount === 0 ? (
                       <div className="p-4 text-center text-gray-500">
                         No notifications yet
                       </div>
                     ) : (
                       <>
                         {pendingProjectsCount > 0 && (
                           <div className="p-4 border-b border-gray-100 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors duration-200">
                             <div className="flex items-start">
                               <div className="flex-1">
                                 <p className="text-sm font-medium text-gray-900">
                                   New Projects Pending Review
                                 </p>
                                 <p className="text-sm text-gray-600 mt-1">
                                   {pendingProjectsCount} new project{pendingProjectsCount > 1 ? 's' : ''} waiting for your approval
                                 </p>
                                 <p className="text-xs text-gray-400 mt-2">
                                   <Link href="/dashboard/projects" className="text-blue-600 hover:text-blue-800">
                                     View Projects
                                   </Link>
                                 </p>
                               </div>
                               <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                             </div>
                           </div>
                         )}
                         {notifications && notifications.map((notification) => (
                         <div
                           key={notification.id}
                           onClick={() => handleMarkAsRead(notification.id)}
                           className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                             !notification.isRead ? 'bg-blue-50' : ''
                           }`}
                         >
                           <div className="flex items-start">
                             <div className="flex-1">
                               <p className="text-sm font-medium text-gray-900">
                                 {notification.title}
                               </p>
                               <p className="text-sm text-gray-600 mt-1">
                                 {notification.message}
                               </p>
                               <p className="text-xs text-gray-400 mt-2">
                                 {formatTimeAgo(notification.createdAt)}
                               </p>
                             </div>
                             {!notification.isRead && (
                               <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                             )}
                           </div>
                         </div>
                       ))}
                       </>
                     )}
                   </div>
                   <div className="p-3 border-t border-gray-200">
                     <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                       View all notifications
                     </button>
                   </div>
                 </div>
               )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user?.user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.user.role?.toLowerCase().replace('_', ' ') || 'User'}
                  </p>
                </div>
                <FiChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.user.role?.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiUser className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiSettings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiHelpCircle className="mr-3 h-4 w-4" />
                      Help & Support
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FiLogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden border-t border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;