"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useEffect, useRef, useState } from 'react';
import {
  FiHome,
  FiShield,
  FiActivity,
  FiTrendingUp,
  FiFolder,
  FiShoppingBag,
  FiPackage,
  FiPieChart,
  FiCreditCard,
  FiUser,
  FiSettings,
  FiMessageCircle,
  FiFileText
} from 'react-icons/fi';

interface NavItem { name: string; href: string; icon: React.ReactNode }

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isSuperAdmin } = usePermissions();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState<number>(56);

  // Reserve space for bottom nav on mobile so content never hides it
  useEffect(() => {
    const updatePadding = () => {
      if (typeof window === 'undefined') return;
      const isMobile = window.innerWidth < 768;
      const height = navRef.current?.getBoundingClientRect().height || 56;
      setNavHeight(height);
      if (isMobile) {
        document.body.style.paddingBottom = `${height}px`;
      } else {
        document.body.style.paddingBottom = '';
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    // Adjust when virtual keyboard opens/closes on mobile
    if (typeof window !== 'undefined' && (window as any).visualViewport) {
      (window as any).visualViewport.addEventListener('resize', updatePadding);
    }

    return () => {
      window.removeEventListener('resize', updatePadding);
      if (typeof window !== 'undefined' && (window as any).visualViewport) {
        (window as any).visualViewport.removeEventListener('resize', updatePadding);
      }
      document.body.style.paddingBottom = '';
    };
  }, []);

  const role = user?.user?.role as string | undefined;

  const generic: NavItem[] = [
    { name: 'Home', href: '/dashboard', icon: <FiHome className="h-5 w-5" /> },
    { name: 'Subs', href: '/dashboard/subscription', icon: <FiCreditCard className="h-5 w-5" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <FiUser className="h-5 w-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings className="h-5 w-5" /> },
  ];

  let items: NavItem[] = generic;
  if (role === 'SUPER_ADMIN' || isSuperAdmin()) {
    items = [
      { name: 'Super', href: '/dashboard/super-admin', icon: <FiShield className="h-5 w-5" /> },
      { name: 'Users', href: '/dashboard/users', icon: <FiUser className="h-5 w-5" /> },
      { name: 'Subs', href: '/dashboard/subscriptions', icon: <FiCreditCard className="h-5 w-5" /> },
      { name: 'Pay', href: '/dashboard/payments', icon: <FiCreditCard className="h-5 w-5" /> },
    ];
  } else if (role === 'ADMIN_TRADING') {
    items = [
      { name: 'Trade', href: '/dashboard/admin/trading', icon: <FiActivity className="h-5 w-5" /> },
      { name: 'Product', href: '/dashboard/admin/trading/products', icon: <FiPackage className="h-5 w-5" /> },
      { name: 'Order', href: '/dashboard/admin/trading/orders', icon: <FiShoppingBag className="h-5 w-5" /> },
      { name: 'Sett', href: '/dashboard/profile', icon: <FiSettings className="h-5 w-5" /> },
    ];
  } else if (role === 'ADMIN_INVESTMENT') {
    items = [
      { name: 'Invest', href: '/dashboard/admin', icon: <FiShield className="h-5 w-5" /> },
      { name: 'Project', href: '/dashboard/projects', icon: <FiFolder className="h-5 w-5" /> },
      { name: 'Chat', href: '/dashboard/investment-chat', icon: <FiMessageCircle className="h-5 w-5" /> },
      { name: 'Sett', href: '/dashboard/profile', icon: <FiSettings className="h-5 w-5" /> },
    ];
  } else if (role === 'ADMIN') {
    items = [
      { name: 'Admin', href: '/dashboard/admin', icon: <FiShield className="h-5 w-5" /> },
      { name: 'Users', href: '/dashboard/users', icon: <FiUser className="h-5 w-5" /> },
      { name: 'Subs', href: '/dashboard/subscriptions', icon: <FiCreditCard className="h-5 w-5" /> },
      { name: 'Pay', href: '/dashboard/payments', icon: <FiCreditCard className="h-5 w-5" /> },
    ];
  } else if (role === 'INVESTOR') {
    items = [
      { name: 'Invest', href: '/dashboard/investment', icon: <FiTrendingUp className="h-5 w-5" /> },
      { name: 'Browse', href: '/dashboard/investment/browse', icon: <FiFolder className="h-5 w-5" /> },
      { name: 'Portfolio', href: '/dashboard/investment/portfolio', icon: <FiPieChart className="h-5 w-5" /> },
      { name: 'Reports', href: '/dashboard/investment/reports', icon: <FiFileText className="mr-3 h-5 w-5" /> },
    ];
  } else if (role === 'PROJECT_OWNER') {
    items = [
      { name: 'Project', href: '/dashboard/project-owner', icon: <FiHome className="h-5 w-5" /> },
      { name: 'MyProject', href: '/dashboard/project-owner/projects', icon: <FiFolder className="h-5 w-5" /> },
      { name: 'Report', href: '/dashboard/project-owner/reports', icon: <FiFolder className="h-5 w-5" /> },
      { name: 'Subs', href: '/dashboard/subscription', icon: <FiCreditCard className="h-5 w-5" /> },
    ];
  } else if (role === 'BUYER') {
    items = [
      { name: 'Buyer', href: '/dashboard/buyer', icon: <FiShoppingBag className="h-5 w-5" /> },
      { name: 'Market', href: '/dashboard/marketplace', icon: <FiShoppingBag className="h-5 w-5" /> },
      { name: 'Orders', href: '/dashboard/orders', icon: <FiPackage className="h-5 w-5" /> },
      { name: 'Subs', href: '/dashboard/subscription', icon: <FiCreditCard className="h-5 w-5" /> },
    ];
  } else if (role === 'SELLER') {
    items = [
      { name: 'Seller', href: '/dashboard/seller', icon: <FiPackage className="h-5 w-5" /> },
      { name: 'Product', href: '/dashboard/products', icon: <FiPackage className="h-5 w-5" /> },
      { name: 'Orders', href: '/dashboard/orders', icon: <FiShoppingBag className="h-5 w-5" /> },
      { name: 'Subs', href: '/dashboard/subscription', icon: <FiCreditCard className="h-5 w-5" /> },
    ];
  }

  return (
    <div
      ref={navRef}
      className="md:hidden fixed bottom-0 inset-x-0 z-[80] border-t shadow-sm backdrop-blur bg-white/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <nav className="grid grid-cols-4 gap-0 py-2">
        {items.map((item) => {
          const active = pathname ? pathname.startsWith(item.href) : false;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center text-[12px] ${active ? 'text-purple-700' : 'text-gray-700'}`}
            >
              <span>{item.icon}</span>
              <span className="mt-0.5 truncate max-w-[72px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
