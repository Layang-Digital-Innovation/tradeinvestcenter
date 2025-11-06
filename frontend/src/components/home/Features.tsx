"use client";

import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiGlobe, FiShoppingCart, FiMessageCircle, FiCreditCard } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Role-Based Access",
      description: "Different interfaces for Investors, Project Owners, Buyers, Sellers, and Admins."
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: "Investment Crowdfunding",
      description: "Browse projects, invest, and track profit sharing with transparent reporting."
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Global Trading",
      description: "Connect with international buyers and sellers across multiple commodities."
    },
    {
      icon: <FiShoppingCart className="w-6 h-6" />,
      title: "Marketplace",
      description: "Browse products, place orders, and track shipments in real-time."
    },
    {
      icon: <FiMessageCircle className="w-6 h-6" />,
      title: "Real-time Communication",
      description: "Integrated WhatsApp chat with admin for seamless communication."
    },
    {
      icon: <FiCreditCard className="w-6 h-6" />,
      title: "Subscription Plans",
      description: "Access premium features with monthly or yearly subscription options."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Platform Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            TradeInvestCenter combines investment opportunities with global trading in one powerful platform
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-purple-600 mb-4 p-3 bg-purple-50 rounded-full inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;