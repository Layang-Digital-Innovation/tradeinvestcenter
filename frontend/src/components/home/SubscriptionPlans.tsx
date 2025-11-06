"use client";

import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import Link from 'next/link';

const SubscriptionPlans = () => {
  const plans = [
    {
      name: "Free Trial",
      price: "Free",
      duration: "7 days",
      features: [
        "Basic access to platform",
        "Browse investment projects",
        "View marketplace listings",
        "Limited chat support"
      ],
      buttonText: "Start Free Trial",
      buttonLink: "/register",
      highlighted: false
    },
    {
      name: "Gold Plan",
      price: "$49",
      duration: "per month",
      features: [
        "Full access to platform",
        "Unlimited investment opportunities",
        "Unlimited marketplace listings",
        "Priority chat support",
        "Detailed analytics dashboard",
        "Export-import documentation",
        "Shipment tracking"
      ],
      buttonText: "Subscribe Now",
      buttonLink: "/subscribe",
      highlighted: true,
      yearlyPrice: "$499"
    },
    {
      name: "Enterprise",
      price: "Custom",
      duration: "tailored solution",
      features: [
        "All Gold Plan features",
        "Dedicated account manager",
        "Custom integration options",
        "Advanced analytics",
        "Priority processing",
        "24/7 support"
      ],
      buttonText: "Contact Us",
      buttonLink: "/contact",
      highlighted: false
    }
  ];

  return (
    <section id="subscription" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Subscription Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Choose the plan that fits your business needs
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-lg overflow-hidden ${
                plan.highlighted 
                  ? 'ring-2 ring-yellow-500 shadow-xl' 
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="ml-2 text-gray-500">{plan.duration}</span>
                </div>
                
                {plan.highlighted && (
                  <div className="mb-6 p-3 bg-purple-50 rounded-md text-center">
                    <p className="text-purple-700 font-medium">Save 15% with yearly billing</p>
                    <p className="text-purple-900 font-bold mt-1">{plan.yearlyPrice} per year</p>
                  </div>
                )}
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={plan.buttonLink}
                  className={`w-full block text-center px-6 py-3 rounded-md font-medium ${
                    plan.highlighted
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All plans include a 7-day free trial. No credit card required to start.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;