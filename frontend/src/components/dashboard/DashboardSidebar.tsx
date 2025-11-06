"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
// import { useChatNotifications } from '@/contexts/ChatNotificationContext'; // chat disembunyikan sementara
import { useProjectNotifications } from '@/contexts/ProjectNotificationContext';
import NotificationBadge from '@/components/ui/NotificationBadge';
import { 
  FiHome, 
  FiUsers, 
  FiFolder, 
  FiSettings, 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiUser, 
  FiBarChart2, 
  FiFileText,
  FiTrendingUp,
  FiPieChart,
  FiCreditCard,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiUserCheck,
  FiMessageCircle,
  FiArrowRight
} from 'react-icons/fi';
import { subscriptionService } from '@/services/subscription.service';
import chatService from '@/services/chat.service';

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
  isCollapsed: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isMobileMenuOpen, 
  onMobileMenuClose,
  isCollapsed
}) => {
  const { user } = useAuth();
  const { 
    canManageUsers, 
    canViewAnalytics, 
    canViewSystemAnalytics,
    canManageSubscriptions,
    canManagePayments,
    canViewReports,
    canManageSettings,
    canManageRoles,
    isSuperAdmin,
    isAdmin
  } = usePermissions();
  // Hapus sementara notifikasi chat karena fitur chat disembunyikan
  const { pendingProjectsCount } = useProjectNotifications();
  const pathname = usePathname();
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  
  // Scroll indicators state
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Upgrade UI state
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const groupedPlans = useMemo(() => {
    const map = new Map<string, { key: string; plan: string; period: string; usd?: any; idr?: any }>();
    (plans || []).forEach((p: any) => {
      const key = `${p.plan}-${p.period}`;
      if (!map.has(key)) map.set(key, { key, plan: p.plan, period: p.period });
      const entry = map.get(key)!;
      const cur = String(p.currency || '').toUpperCase();
      if (cur === 'USD') entry.usd = p;
      if (cur === 'IDR') entry.idr = p;
    });
    return Array.from(map.values());
  }, [plans]);
  const [selectedCurrencyByGroup, setSelectedCurrencyByGroup] = useState<Record<string, 'IDR'|'USD'>>({});
  const [buying, setBuying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mySub, setMySub] = useState<any | null>(null);
  const [showEnterpriseExpired, setShowEnterpriseExpired] = useState(false);
  const enterpriseExpiredShownRef = useRef(false);
  const instanceIdRef = useRef<string>(Math.random().toString(36).slice(2));
  const modalRootRef = useRef<HTMLElement | null>(null);

  // Handle scroll indicators
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowTopIndicator(scrollTop > 10);
    setShowBottomIndicator(scrollTop < scrollHeight - clientHeight - 10);
  };

  const [processingPlanKey, setProcessingPlanKey] = useState<string | null>(null);

  const handleUpgradePlan = async (plan: any) => {
    setProcessingPlanKey(`${plan.provider}-${plan.plan}-${plan.period}`);
    setBuying(true);
    setErrorMsg(null);
    try {
      const price = plan?.price;
      if (!price || typeof price !== 'number') {
        setErrorMsg('Harga plan belum dikonfigurasi. Hubungi admin.');
        setBuying(false);
        setProcessingPlanKey(null);
        return;
      }
      const currency = (plan?.currency as 'IDR' | 'USD') || 'IDR';
      const provider = currency === 'USD' ? 'paypal' : 'xendit';
      const payload: any = {
        type: 'subscription',
        plan: plan?.plan,
        price,
        currency,
        provider,
      };
      if (provider === 'paypal') {
        const billingPlanId = plan?.providerPlanId;
        if (!billingPlanId) {
          setErrorMsg('Billing plan PayPal belum dikonfigurasi. Hubungi admin.');
          setBuying(false);
          setProcessingPlanKey(null);
          return;
        }
        payload.billingPlanId = billingPlanId;
      }
      const res = await subscriptionService.checkout(payload);
      const url = (res && (res.paymentLink || res.approval_url)) as string | undefined;
      if (url) window.location.href = url;
      else setErrorMsg('Gagal mendapatkan link pembayaran.');
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || 'Gagal memulai pembayaran.');
    } finally {
      setBuying(false);
      setProcessingPlanKey(null);
    }
  };

  const getDashboardLinks = () => {
    const userRole = user?.user.role;
    
    const commonLinks: any[] = [
      // Removed generic Dashboard menu to avoid duplication since each role has specific dashboard
    ];

    if (userRole === 'SUPER_ADMIN') {
      return [
        ...commonLinks,
        { name: 'Super Admin Panel', href: '/dashboard/super-admin', icon: <FiShield className="mr-3 h-5 w-5" /> },
        ...(canManageUsers() ? [{ name: 'User Management', href: '/dashboard/users', icon: <FiUsers className="mr-3 h-5 w-5" /> }] : []),
        ...(canManageSubscriptions() ? [{ name: 'Subscriptions', href: '/dashboard/subscriptions', icon: <FiCreditCard className="mr-3 h-5 w-5" /> }] : []),
        { name: 'Platform Settings', href: '/dashboard/super-admin/settings/bank', icon: <FiSettings className="mr-3 h-5 w-5" /> },
        ...(canManagePayments() ? [{ name: 'Payments', href: '/dashboard/payments', icon: <FiDollarSign className="mr-3 h-5 w-5" /> }] : []),
      ];
    } else if (userRole === 'ADMIN') {
      return [
        ...commonLinks,
        { name: 'Admin Panel', href: '/dashboard/admin', icon: <FiShield className="mr-3 h-5 w-5" /> },
        { name: 'Investment Chat', href: '/dashboard/investment-chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        ...(canManageUsers() ? [{ name: 'User Management', href: '/dashboard/users', icon: <FiUsers className="mr-3 h-5 w-5" /> }] : []),
        ...(canManageSubscriptions() ? [{ name: 'Subscriptions', href: '/dashboard/subscriptions', icon: <FiCreditCard className="mr-3 h-5 w-5" /> }] : []),
        { name: 'Platform Settings', href: '/dashboard/super-admin/settings/bank', icon: <FiSettings className="mr-3 h-5 w-5" /> },
        ...(canManagePayments() ? [{ name: 'Payments', href: '/dashboard/payments', icon: <FiDollarSign className="mr-3 h-5 w-5" /> }] : []),
        { name: 'Trading: Products', href: '/dashboard/admin/trading/products', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Trading: Orders', href: '/dashboard/admin/trading/orders', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
      ];
    } else if (userRole === 'ADMIN_INVESTMENT') {
      // Investment admin: access investment panel, no trading menus
      return [
        ...commonLinks,
        { name: 'Admin Panel', href: '/dashboard/admin', icon: <FiShield className="mr-3 h-5 w-5" /> },
        { name: 'Chat', href: '/dashboard/investment-chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { 
          name: 'Projects', 
          href: '/dashboard/projects', 
          icon: <FiFolder className="mr-3 h-5 w-5" />,
          badge: pendingProjectsCount > 0 ? <NotificationBadge count={pendingProjectsCount} size="sm" /> : null 
        },
      ];
    } else if (userRole === 'ADMIN_TRADING') {
      // Trading admin: trading dashboard + trading menus
      return [
        ...commonLinks,
        { name: 'Trading Dashboard', href: '/dashboard/admin/trading', icon: <FiActivity className="mr-3 h-5 w-5" /> },
        { name: 'Chat', href: '/dashboard/chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { name: 'Trading: Products', href: '/dashboard/admin/trading/products', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Trading: Orders', href: '/dashboard/admin/trading/orders', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
      ];
    } else if (userRole === 'INVESTOR') {
      const isTrial = (mySub?.plan === 'TRIAL') || (mySub?.status === 'TRIAL');
      return [
        ...commonLinks,
        { name: 'Investment Dashboard', href: '/dashboard/investment', icon: <FiTrendingUp className="mr-3 h-5 w-5" /> },
        { name: 'Chat', href: '/dashboard/investment-chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { name: 'Browse Projects', href: '/dashboard/investment/browse', icon: <FiFolder className="mr-3 h-5 w-5" /> },
        { name: 'My Portfolio', href: '/dashboard/investment/portfolio', icon: <FiPieChart className="mr-3 h-5 w-5" /> },
        { name: 'Subscription', href: '/dashboard/subscription', icon: <FiCreditCard className="mr-3 h-5 w-5" />, badge: (mySub?.status === 'TRIAL' || mySub?.plan === 'TRIAL') ? (<span className="inline-block text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Trial</span>) : null },
        { name: 'Reports', href: '/dashboard/investment/reports', icon: <FiFileText className="mr-3 h-5 w-5" /> },
      ];
    } else if (userRole === 'PROJECT_OWNER') {
      return [
        ...commonLinks,
        { name: 'Project Dashboard', href: '/dashboard/project-owner', icon: <FiHome className="mr-3 h-5 w-5" /> },
        { name: 'Chat', href: '/dashboard/investment-chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { name: 'My Projects', href: '/dashboard/project-owner/projects', icon: <FiFolder className="mr-3 h-5 w-5" /> },
        { name: 'Financial Reports', href: '/dashboard/project-owner/reports', icon: <FiFileText className="mr-3 h-5 w-5" /> },
        { name: 'Subscription', href: '/dashboard/subscription', icon: <FiCreditCard className="mr-3 h-5 w-5" />, badge: (mySub?.status === 'TRIAL') ? (<span className="inline-block text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Trial</span>) : null },
      ];
    } else if (userRole === 'BUYER') {
      return [
        ...commonLinks,
        { name: 'Buyer Dashboard', href: '/dashboard/buyer', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
        { name: 'Chat', href: '/dashboard/chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { name: 'Marketplace', href: '/dashboard/marketplace', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
        { name: 'Orders', href: '/dashboard/orders', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Subscription', href: '/dashboard/subscription', icon: <FiCreditCard className="mr-3 h-5 w-5" />, badge: (mySub?.status === 'TRIAL') ? (<span className="inline-block text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Trial</span>) : null },
      ];
    } else if (userRole === 'SELLER') {
      return [
        ...commonLinks,
        { name: 'Seller Dashboard', href: '/dashboard/seller', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Chat', href: '/dashboard/chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { name: 'Company', href: '/dashboard/seller/company', icon: <FiUserCheck className="mr-3 h-5 w-5" /> },
        { name: 'Products', href: '/dashboard/products', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Orders', href: '/dashboard/orders', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
        { name: 'Subscription', href: '/dashboard/subscription', icon: <FiCreditCard className="mr-3 h-5 w-5" />, badge: (mySub?.status === 'TRIAL') ? (<span className="inline-block text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Trial</span>) : null },
      ];
    } else {
      return [
        ...commonLinks,
        { name: 'Chat', href: '/dashboard/chat', icon: <FiMessageCircle className="mr-3 h-5 w-5" />, badge: chatUnreadCount > 0 ? <NotificationBadge count={chatUnreadCount} size="sm" /> : null },
        { name: 'Profile', href: '/dashboard/profile', icon: <FiUser className="mr-3 h-5 w-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings className="mr-3 h-5 w-5" /> },
      ];
    }
  };

  let dashboardLinks = getDashboardLinks();
  // Fallback: if links empty, provide role-aware minimal menu to avoid blank on mobile
  if (!dashboardLinks || dashboardLinks.length === 0) {
    const role = user?.user?.role;
    if (role === 'SUPER_ADMIN') {
      dashboardLinks = [
        { name: 'Super Admin Panel', href: '/dashboard/super-admin', icon: <FiShield className="mr-3 h-5 w-5" /> },
        { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: <FiCreditCard className="mr-3 h-5 w-5" /> },
        { name: 'Settings', href: '/dashboard/super-admin/settings/bank', icon: <FiSettings className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'ADMIN_TRADING') {
      dashboardLinks = [
        { name: 'Trading Dashboard', href: '/dashboard/admin/trading', icon: <FiActivity className="mr-3 h-5 w-5" /> },
        { name: 'Products', href: '/dashboard/admin/trading/products', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Orders', href: '/dashboard/admin/trading/orders', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'ADMIN_INVESTMENT') {
      dashboardLinks = [
        { name: 'Investment Admin Panel', href: '/dashboard/admin', icon: <FiShield className="mr-3 h-5 w-5" /> },
        { name: 'Projects', href: '/dashboard/projects', icon: <FiFolder className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'ADMIN') {
      dashboardLinks = [
        { name: 'Admin Panel', href: '/dashboard/admin', icon: <FiShield className="mr-3 h-5 w-5" /> },
        { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: <FiCreditCard className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'INVESTOR') {
      dashboardLinks = [
        { name: 'Investment Dashboard', href: '/dashboard/investment', icon: <FiTrendingUp className="mr-3 h-5 w-5" /> },
        { name: 'Portfolio', href: '/dashboard/investment/portfolio', icon: <FiPieChart className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'PROJECT_OWNER') {
      dashboardLinks = [
        { name: 'Project Dashboard', href: '/dashboard/project-owner', icon: <FiHome className="mr-3 h-5 w-5" /> },
        { name: 'My Projects', href: '/dashboard/project-owner/projects', icon: <FiFolder className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'BUYER') {
      dashboardLinks = [
        { name: 'Buyer Dashboard', href: '/dashboard/buyer', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
        { name: 'Orders', href: '/dashboard/orders', icon: <FiPackage className="mr-3 h-5 w-5" /> },
      ];
    } else if (role === 'SELLER') {
      dashboardLinks = [
        { name: 'Seller Dashboard', href: '/dashboard/seller', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Products', href: '/dashboard/products', icon: <FiPackage className="mr-3 h-5 w-5" /> },
        { name: 'Orders', href: '/dashboard/orders', icon: <FiShoppingBag className="mr-3 h-5 w-5" /> },
      ];
    } else {
      // last resort generic
      dashboardLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="mr-3 h-5 w-5" /> },
        { name: 'Subscription', href: '/dashboard/subscription', icon: <FiCreditCard className="mr-3 h-5 w-5" /> },
        { name: 'Profile', href: '/dashboard/profile', icon: <FiUser className="mr-3 h-5 w-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings className="mr-3 h-5 w-5" /> },
      ];
    }
  }

  // Check scroll indicators on mount and resize
  useEffect(() => {
    // Load chat unread count on mount/role change
    (async () => {
      try {
        const chats = await chatService.listMyChats();
        const sum = (chats || []).reduce((acc, c: any) => acc + (c.unreadCount || 0), 0);
        setChatUnreadCount(sum);
      } catch {}
    })();

    const checkScrollIndicators = (element: HTMLDivElement | null) => {
      if (!element) return;
      const { scrollTop, scrollHeight, clientHeight } = element;
      setShowTopIndicator(scrollTop > 10);
      setShowBottomIndicator(scrollTop < scrollHeight - clientHeight - 10);
    };

    const desktopElement = desktopScrollRef.current;
    const mobileElement = mobileScrollRef.current;
    
    if (desktopElement) checkScrollIndicators(desktopElement);
    if (mobileElement) checkScrollIndicators(mobileElement);

    const handleResize = () => {
      if (desktopElement) checkScrollIndicators(desktopElement);
      if (mobileElement) checkScrollIndicators(mobileElement);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dashboardLinks, isCollapsed]);

  // Decide if Upgrade button should show (non-admin roles)
  useEffect(() => {
    const role = user?.user.role;
    setShowUpgrade(role === 'INVESTOR' || role === 'PROJECT_OWNER' || role === 'BUYER' || role === 'SELLER');
  }, [user?.user.role]);

  // Fetch billing plans for prices (e.g., GOLD_MONTHLY)
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await subscriptionService.getSubscriptionPlans();
        setPlans(res || []);
      } catch (e) {
        // ignore silently
      }
    };
    if (showUpgrade) loadPlans();
  }, [showUpgrade]);

  // Fetch current subscription to render Trial badge and possibly show Enterprise expired modal once
  useEffect(() => {
    const loadMySub = async () => {
      try {
        const res = await subscriptionService.getMySubscription();
        setMySub(res || null);
        // Determine expiry for enterprise custom
        const now = Date.now();
        const end = res?.status === 'TRIAL' ? (res?.trialEndsAt || res?.expiresAt) : (res?.currentPeriodEnd || res?.expiresAt);
        const expired = end ? (new Date(end).getTime() < now) : false;
        const onSubscriptionPage = pathname?.startsWith('/dashboard/subscription');
        // Global guard via window + localStorage + single-owner to avoid duplicate overlays across multiple mounts/renders
        const win: any = typeof window !== 'undefined' ? window : undefined;
        const alreadyShown = !!(win && win.__enterpriseExpiredShown) || (typeof window !== 'undefined' && localStorage.getItem('enterpriseExpiredShown') === '1');
        if (win && !win.__enterpriseExpiredOwnerId) {
          win.__enterpriseExpiredOwnerId = instanceIdRef.current;
        }
        const isOwner = win ? win.__enterpriseExpiredOwnerId === instanceIdRef.current : true;

        if (res?.plan === 'ENTERPRISE_CUSTOM' && expired && !onSubscriptionPage && isOwner) {
          if (!enterpriseExpiredShownRef.current && !alreadyShown && !showEnterpriseExpired) {
            enterpriseExpiredShownRef.current = true;
            if (win) win.__enterpriseExpiredShown = true;
            if (typeof window !== 'undefined') localStorage.setItem('enterpriseExpiredShown', '1');
            setShowEnterpriseExpired(true);
          }
        } else {
          setShowEnterpriseExpired(false);
        }
      } catch (e) {
        setMySub(null);
        setShowEnterpriseExpired(false);
      }
    };
    loadMySub();
  }, [user?.user?.id, pathname]);

  // Ensure a single modal root element exists for portal rendering
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    let root = document.getElementById('enterprise-expired-modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'enterprise-expired-modal-root';
      document.body.appendChild(root);
    }
    modalRootRef.current = root;
    return () => {
      // Do not remove on unmount to keep a single persistent root
    };
  }, []);

  const goldMonthlyPlan = useMemo(() => plans.find((p: any) => p.plan === 'GOLD_MONTHLY'), [plans]);

  const handleUpgrade = async () => {
    setBuying(true);
    setErrorMsg(null);
    try {
      // Prefer IDR plan (Xendit), fallback to USD (PayPal requires billingPlanId)
      const goldIdr = plans.find((p: any) => p.plan === 'GOLD_MONTHLY' && p.currency === 'IDR') || null;
      const goldUsd = plans.find((p: any) => p.plan === 'GOLD_MONTHLY' && p.currency === 'USD') || null;
      const plan = goldIdr || goldUsd || goldMonthlyPlan;
      const price = plan?.price;
      if (!price || typeof price !== 'number') {
        setErrorMsg('Harga plan belum dikonfigurasi. Hubungi admin.');
        setBuying(false);
        return;
      }
      const currency = (plan?.currency as 'IDR' | 'USD') || 'IDR';
      const provider = currency === 'USD' ? 'paypal' : 'xendit';
      const payload: any = {
        type: 'subscription',
        plan: 'GOLD_MONTHLY',
        price,
        currency,
        provider,
      };
      if (provider === 'paypal') {
        const billingPlanId = (plan as any)?.providerPlanId;
        if (!billingPlanId) {
          setErrorMsg('Billing plan PayPal belum dikonfigurasi. Hubungi admin.');
          setBuying(false);
          return;
        }
        payload.billingPlanId = billingPlanId;
      }
      const res = await subscriptionService.checkout(payload);
      const url = (res && (res.paymentLink || res.approval_url)) as string | undefined;
      if (url) window.location.href = url;
      else setErrorMsg('Gagal mendapatkan link pembayaran.');
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || 'Gagal memulai pembayaran.');
    } finally {
      setBuying(false);
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname ? pathname.startsWith(href) : false;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col md:top-16 transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? 'md:w-20' : 'md:w-64'
      }`} style={{ height: '100vh' }}>
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm overflow-hidden">
          <div className="sidebar-scroll-container flex-1 relative">
            {/* Scroll Indicators */}
            {showTopIndicator && (
              <div className="sidebar-scroll-indicator top"></div>
            )}
            {showBottomIndicator && (
              <div className="sidebar-scroll-indicator bottom"></div>
            )}
            
            <div 
              ref={desktopScrollRef}
              onScroll={handleScroll}
              className={`flex flex-1 flex-col overflow-y-auto overflow-x-hidden sidebar-scroll ${
                isCollapsed ? 'collapsed pt-3 pb-3' : 'pt-5 pb-4'
              }`}
            >
            {/* Logo and Brand */}
            <div className={`flex flex-shrink-0 items-center justify-center mb-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
              <div className="flex items-center">
                <div className={`bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl transition-all duration-200 ${
                  isCollapsed ? 'p-3' : 'p-2.5 mr-3'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`text-white ${isCollapsed ? 'h-7 w-7' : 'h-6 w-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">TradeInvest</h1>
                    <p className="text-xs text-gray-500">Center</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <nav className={`flex-1 overflow-hidden ${isCollapsed ? 'px-1 space-y-1' : 'px-3 space-y-1'}`}>
              <div className="space-y-1">
                {dashboardLinks.map((item) => (
                   <div key={`${item.href}`} className={`relative group ${isCollapsed ? 'nav-item' : ''}`}>
                     <Link
                       href={item.href}
                       className={`group flex items-center text-sm font-medium rounded-lg transition-all duration-200 overflow-hidden ${
                         isActiveLink(item.href)
                           ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                           : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                       } ${isCollapsed ? 'justify-center px-1 py-3 mx-1' : 'px-3 py-3'}`}
                     >
                      <span className={`flex-shrink-0 transition-all duration-200 ${
                          isActiveLink(item.href) ? 'text-purple-700' : 'text-gray-400 group-hover:text-gray-600'
                        } ${isCollapsed ? 'text-base' : 'mr-3'}`}>
                          {item.icon}
                        </span>
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.name}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto">{item.badge}</span>
                      )}
                    </Link>
                    {/* Badge for collapsed state */}
                    {isCollapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 z-10">
                        {item.badge}
                      </div>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Upgrade button */}
              {!isCollapsed && showUpgrade && (
                <div className="mt-4 p-3">
                  <button
                    onClick={() => setUpgradeOpen(true)}
                    className="group w-full inline-flex items-center justify-between gap-2 rounded-lg border border-purple-600 bg-white text-purple-700 px-3 py-2 text-sm font-medium shadow-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    title="Upgrade ke Gold"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FiCreditCard className="h-4 w-4" />
                      <span>Upgrade</span>
                    </span>
                    <FiArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </button>
                  <p className="text-[11px] text-gray-500 mt-2">Dapatkan fitur premium dengan plan Gold.</p>
                </div>
              )}
            </nav>
            </div>
          </div>

          {/* User Info at Bottom */}
          <div className={`flex flex-shrink-0 bg-gray-50 border-t border-gray-200 overflow-hidden ${isCollapsed ? 'p-3' : 'p-4'}`}>
            <div className={`flex items-center w-full overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="flex-shrink-0">
                <div className={`rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white font-semibold transition-all duration-200 ${
                  isCollapsed ? 'h-12 w-12 text-lg' : 'h-10 w-10'
                }`}>
                  {user?.user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {user?.user.role?.toLowerCase().replace('_', ' ') || 'User'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onMobileMenuClose}
          ></div>
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onMobileMenuClose}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sidebar-scroll-container flex-1 min-h-0 relative">
              {/* Mobile Scroll Indicators */}
              {showTopIndicator && (
                <div className="sidebar-scroll-indicator top"></div>
              )}
              {showBottomIndicator && (
                <div className="sidebar-scroll-indicator bottom"></div>
              )}
              
              <div 
                ref={mobileScrollRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 pt-6 pb-6 overflow-y-auto sidebar-scroll"
              >
              {/* Mobile Logo */}
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TradeInvest</h1>
                  <p className="text-xs text-gray-500">Center</p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="px-3 space-y-1 mt-1">
                {dashboardLinks.map((item) => (
                  <Link
                    key={`${item.href}`}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm md:text-base font-medium rounded-lg transition-all duration-200 ${
                      isActiveLink(item.href)
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={onMobileMenuClose}
                  >
                    <span className={`${
                      isActiveLink(item.href) ? 'text-purple-700' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="ml-3 truncate">{item.name}</span>
                  </Link>
                ))}
                {showUpgrade && (
                  <div className="pt-2">
                    <button
                      onClick={() => { onMobileMenuClose(); setUpgradeOpen(true); }}
                      className="group w-full inline-flex items-center justify-between gap-2 rounded-lg border border-purple-600 bg-white text-purple-700 px-3 py-2 text-sm font-medium shadow-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      title="Upgrade ke Gold"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiCreditCard className="h-4 w-4" />
                        <span>Upgrade</span>
                      </span>
                      <FiArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                    </button>
                    <p className="text-[11px] text-gray-500 mt-2">Dapatkan fitur premium dengan plan Gold.</p>
                  </div>
                )}
              </nav>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white font-semibold">
                    {user?.user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.user.role?.toLowerCase().replace('_', ' ') || 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {upgradeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setUpgradeOpen(false)}>
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Upgrade ke Gold</h3>
              <p className="text-sm text-gray-600 mt-1">Akses fitur premium seperti prioritas dukungan, laporan lanjutan, dan limit yang lebih tinggi.</p>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {(groupedPlans && groupedPlans.length > 0) ? (
              groupedPlans.map((g: any) => {
                const key = g.key;
                const hasIDR = !!g.idr;
                const hasUSD = !!g.usd;
                const selected = selectedCurrencyByGroup[key] || (hasIDR ? 'IDR' : 'USD');
                const activePlan = selected === 'USD' ? g.usd : g.idr;
                return (
                  <div key={key} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{activePlan?.name || g.plan}</div>
                      <div className="text-xs text-gray-500">{(g.period || '').toLowerCase()} • {(activePlan?.provider || '-')} • {(activePlan?.status || '-')}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">{hasIDR ? `IDR ${typeof g.idr?.price==='number'?g.idr.price.toLocaleString():g.idr?.price}` : 'IDR -'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">{hasUSD ? `USD ${typeof g.usd?.price==='number'?g.usd.price.toLocaleString():g.usd?.price}` : 'USD -'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">{activePlan ? (typeof activePlan.price === 'number' ? activePlan.price.toLocaleString() : activePlan.price) : '-'} {selected}</div>
                      {hasIDR && hasUSD ? (
                        <div className="relative w-28 h-8 bg-gray-100 rounded-full p-0.5 mx-auto mt-2">
                          <div className={`absolute top-0.5 bottom-0.5 w-1/2 rounded-full bg-white shadow transition-transform ${selected==='USD' ? 'translate-x-full' : ''}`}></div>
                          <div className="relative z-10 grid grid-cols-2 text-center text-xs h-full">
                            <button type="button" className={`z-10 ${selected==='IDR' ? 'text-gray-900' : 'text-gray-500'}`} onClick={() => setSelectedCurrencyByGroup(prev => ({...prev, [key]: 'IDR'}))}>IDR</button>
                            <button type="button" className={`z-10 ${selected==='USD' ? 'text-gray-900' : 'text-gray-500'}`} onClick={() => setSelectedCurrencyByGroup(prev => ({...prev, [key]: 'USD'}))}>USD</button>
                          </div>
                        </div>
                      ) : (
                        <div className={`px-3 py-1 rounded-full border text-xs mt-2 ${hasIDR ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>{selected}</div>
                      )}
                      <button onClick={() => activePlan && handleUpgradePlan(activePlan)} disabled={buying || processingPlanKey !== null || !activePlan} className="mt-2 px-3 py-1.5 rounded bg-purple-600 text-white text-xs hover:bg-purple-700 disabled:opacity-60">
                        {(processingPlanKey && activePlan && processingPlanKey === `${activePlan.provider}-${activePlan.plan}-${activePlan.period}`) ? 'Memproses...' : 'Pilih'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-600">Belum ada billing plan yang tersedia.</div>
            )}
            {errorMsg && <div className="text-xs text-red-600">{errorMsg}</div>}
          </div>
          <div className="px-6 pb-6 flex items-center justify-end space-x-3">
            <button onClick={() => setUpgradeOpen(false)} className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">Tutup</button>
          </div>
            <div className="px-6 pb-4 text-[11px] text-gray-500">Untuk Enterprise Custom, hubungi tim kami (hanya Super Admin yang dapat membuat secara bulk).</div>
          </div>
        </div>
      )}

      {/* Enterprise Custom Expired Modal */}
      {(function(){
        const win: any = typeof window !== 'undefined' ? window : undefined;
        const isOwner = win ? win.__enterpriseExpiredOwnerId === instanceIdRef.current : true;
        const shouldRender = showEnterpriseExpired && isOwner && modalRootRef.current;
        if (!shouldRender) return null;
        return createPortal(
          (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEnterpriseExpired(false)}>
              <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Subscription expired</h3>
                  <p className="text-sm text-gray-600 mt-1">Akses Anda telah berakhir. Silahkan lakukan perpanjangan langganan untuk melanjutkan.</p>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-xs text-gray-600">Plan Anda adalah Enterprise Custom yang dikelola oleh organisasi. Perpanjangan dilakukan oleh label/organisasi atau Super Admin.</p>
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => { const w:any = typeof window!=='undefined'?window:undefined; if(w) w.__enterpriseExpiredShown = true; if (typeof window !== 'undefined') localStorage.setItem('enterpriseExpiredShown','1'); setShowEnterpriseExpired(false); }} className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">Tutup</button>
                    <a href="/dashboard/subscription" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Perpanjang sekarang</a>
                    <a href="/support" className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">Butuh bantuan?</a>
                  </div>
                </div>
              </div>
            </div>
          ),
          modalRootRef.current as HTMLElement
        );
      })()}
    </>
  );
};

export default DashboardSidebar;