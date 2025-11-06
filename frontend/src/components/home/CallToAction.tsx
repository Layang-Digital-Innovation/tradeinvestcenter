"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Global Business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-purple-100 max-w-3xl mx-auto mb-10"
          >
            Join TradeInvestCenter today and connect with global opportunities in investment and trading.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register" className="px-8 py-4 bg-white text-purple-600 font-medium rounded-md hover:bg-gray-100 transition-colors text-center">
              Get Started for Free
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-transparent border border-yellow-300 text-white font-medium rounded-md hover:bg-white/10 transition-colors text-center">
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;