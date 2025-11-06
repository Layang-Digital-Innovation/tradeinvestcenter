"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t shadow-sm">
      <nav className="grid grid-cols-4 gap-0">
        {items.map((item) => {
          const active = pathname ? pathname.startsWith(item.href) : false;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center py-2 text-[11px] ${active ? 'text-purple-700' : 'text-gray-600'}`}>
              <span>{item.icon}</span>
              <span className="mt-0.5 truncate max-w-[72px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
