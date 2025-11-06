import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import InvestmentSection from '@/components/home/InvestmentSection';
import TradingSection from '@/components/home/TradingSection';
import SubscriptionPlans from '@/components/home/SubscriptionPlans';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <InvestmentSection />
      <TradingSection />
      <SubscriptionPlans />
      <Testimonials />
      <CallToAction />
    </>
  );
}
