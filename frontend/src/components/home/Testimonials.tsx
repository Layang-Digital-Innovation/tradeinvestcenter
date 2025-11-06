"use client";

import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "TradeInvestCenter has transformed how we connect with global buyers. The platform's ease of use and admin support make international trade accessible.",
      author: "Sarah Johnson",
      role: "Export Manager, Green Coffee Co."
    },
    {
      quote: "As an investor, I appreciate the transparency and detailed reporting. I can track my investments and see real returns from export projects.",
      author: "Michael Chen",
      role: "Angel Investor"
    },
    {
      quote: "The collaborative export-import features have helped us expand to new markets we couldn't reach before. Highly recommended for growing businesses.",
      author: "David Rodriguez",
      role: "CEO, Global Textiles Ltd."
    }
  ];

  return (
    <section className="py-20 bg-purple-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-purple-900 mb-4"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Success stories from investors and businesses using our platform
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm relative"
            >
              <div className="absolute top-4 left-4 text-6xl text-yellow-200">"</div>
              <div className="relative z-10">
                <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-purple-900">{testimonial.author}</p>
                  <p className="text-purple-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;